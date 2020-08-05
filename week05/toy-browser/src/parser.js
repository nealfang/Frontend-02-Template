const css = require('css')
const EOF = Symbol('EOF') // end of file
let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [{ type: 'document', children: [] }]

// rules数组保持CSS规则
let rules = []
function addCSSRules(text) {
  var ast = css.parse(text)
  // console.log(JSON.stringify(ast, null, '   '))
  rules.push(...ast.stylesheet.rules)
}


/**
 *  CSS  四元组，从左到右，权重依次下降; 
 *  [ 0,      0 , 0,     0 ]
 *  [ inline, id, class, tag]
*/

function specificity(selector) {
  const p = [0, 0, 0, 0]
  const selectorParts = selector.split(" ")

  for (const part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1]++
    } else if (part.charAt(0) === '.') {
      p[2]++
    } else {
      p[3]++
    }
  }
  return p
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0])
    return sp1[0] - sp2[0]
  if (sp1[1] - sp2[1])
    return sp1[1] - sp2[1]
  if (sp1[2] - sp2[2])
    return sp1[2] - sp2[2]

  return sp1[3] - sp2[3]
}


/**
 *  selector: 这里只处理简单选择器，比如
 *  .a
 *  #a
 *  div
 *  选作
 *  复合选择器的匹配
*/

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false
  }
  if (selector.charAt(0) == '#') {
    var attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt(0) == '.') {
    var attr = element.attributes.filter(attr => attr.name === 'class')[0]
    if (attr && attr.value === selector.replace('.', '')) {
      return true
    }
  } else {
    if (element.tagName === selector) {
      return true
    }
  }
}

function computeCSS(element) {

  // console.log(rules)
  // console.log('compute CSS for element', element);

  // slice 重新复制stack
  // reverse，元素匹配是从内到外的，CSS需要从父到子（从外向内），所以使用reverse倒叙一下
  let elements = stack.slice().reverse()

  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split(" ").reverse();

    if (!match(element, selectorParts[0])) {
      continue
    }

    let matched = false

    var j = 1
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }
    }
    if (j >= selectorParts.length) {
      matched = true
    }

    if (matched) {
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle
      for (var declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
      // console.log(element.computedStyle);
    }
  }
}

function emit(token) {
  let stackTop = stack[stack.length - 1]

  if (token.type == 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (let p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCSS(element)
    stackTop.children.push(element)
    // 这里存在循环引用，最后输出的dom，调用JSON.stringfy会报错
    // element.parent = stackTop

    if (!token.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (stackTop.tagName !== token.tagName) {
      throw new Error('Tag start end doesn\'t match!')
    } else {
      // ++++++++遇到style标签时，执行添加CSS规则的操作+++++++++++++ //
      if (stackTop.tagName === 'style') {
        addCSSRules(stackTop.children[0].content)
      }
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      stackTop.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c == '<') {
    return tagOpen
  } else if (c == EOF) {
    emit({ type: 'EOF' })
    return
  } else {
    emit({ type: 'text', content: c })
    return data
  }
}

function tagOpen(c) {
  if (c == '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c) // 如果是字母，就进入标签名的状态机
  } else {
    return
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if (c == '>') {

  } else if (c == EOF) {

  } else {

  }
}

function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) { // \t tab符   \n 换行符   \f 禁止符   空格
    return beforeAttributeName
  } else if (c == '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c
    return tagName
  } else if (c == '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c)
  } else if (c == '=') {

  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}


function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c)
  } else if (c == '=') {
    return beforeAttributeValue
  } else if (c == '\u0000') { // 空字符

  } else if (c == '\"' || c == "'" || c == '<') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == '/') {
    return selfClosingStartTag;
  } else if (c == '=') {
    return beforeAttributeValue;
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: '',
      value: ''
    };
    return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return beforeAttributeValue
  } else if (c == '\"') { // 双引号
    return doubleQuotedAttributeValue
  } else if (c == '\'') { // 单引号
    return singleQuotedAttributeValue
  } else if (c == '>') {

  } else { // 无引号
    return unQuotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c == '\u0000') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c == '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c == '\u0000') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c
    return singleQuotedAttributeValue
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c == '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == '\u0000') {

  } else if (c == '\"' || c == `'` || c == '<' || c == '=' || c == '`') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c
    return unQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (c == '/') {
    return selfClosingStartTag
  } else if (c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c == '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c == 'EOF') {

  } else {

  }
}

module.exports.parserHTML = function parserHTML(html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
  return stack[0]
}