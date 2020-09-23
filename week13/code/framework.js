export function createElement(type, attributes, ...children) {
  let element;

  if (typeof type === 'string') { // html 标签
    element = new ElementWrapper(type)
  } else { // 组件名称
    element = new type
  }

  if (attributes) { // 设置属性
    for (let name in attributes) {
      element.setAttribute(name, attributes[name])
    }
  }

  for (const child of children) { // 遍历插入子节点
    if (typeof child === 'string') { // 文本
      child = new TextNodeWrapper(child)
    }
    element.appendChild(child)
  }

  return element;
}

export class Component {
  constructor(type) {
    // this.root = this.render(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    this.root = document.createElement(type)
  }
}

class TextNodeWrapper extends Component {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}