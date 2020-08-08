function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for (let prop in element.computedStyle) {
    // const p = element.computedStyle.value
    element.style[prop] = element.computedStyle[prop].value

    if (
      element.style[prop].toString().match(/px$/) ||
      element.style[prop].toString().match(/^[0-9\.]+$/)
    ) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }
  return element.style
}

function layout(element) {
  if (!element.computedStyle) {
    return
  }

  const elementStyle = getStyle(element)

  if (elementStyle.display !== 'flex') {
    return
  }

  const items = element.children.filter(e => e.type === 'element')

  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  const style = elementStyle;

  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row'
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch'
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap'
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch'
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase

  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexWrap === 'wrap-reverse') {
    let tmp = crossStart
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  let isAutoMainSize = false

  if (!style[mainSize]) {
    // 如果没有style[mainSize]，那就给elementStyle[mainSize]设置一开始等于0
    elementStyle[mainSize] = 0;
    // 把所有子元素的mainSize加起来
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);

      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  let flexLine = []
  let flexLines = [flexLine]

  let mainSpace = elementStyle[mainSize]; // 剩余空间等于元素的父元素的mainSize
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) { // 循环所有的flexitem
    let item = items[i];
    let itemStyle = getStyle(item); // 把每个item的style属性取出来

    if (itemStyle[mainSize] === null) { // 如果没有就设为0
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) { // 如果有flex属性，不是display：flex，说明此元素可伸缩
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) { // 如果是AuroMainSize，就直接
      mainSpace -= itemStyle[mainSize]; // 减去主轴空间
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) // 在nowrap的情况item交叉轴尺寸不等于null的话
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]); // 找出flex 的行高就是交叉轴尺寸最大的那个

      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) { // 元素的尺寸比主轴尺寸大的就压到跟主轴尺寸一般大
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) { // 主轴剩下的空间不足以容纳每个元素了
        flexLine.mainSpace = mainSpace; // 旧的flexLine，主轴的剩余空间给存到这一行上
        flexLine.crossSpace = crossSpace; //旧的flexLine， 交叉轴的剩余空间给存到这一行上
        // 然后创建一个新的flexLine，因为前一行已经放不下元素了
        flexLine = [item];
        flexLines.push(flexLine);
        // 这个时候重置一下mainSpace和crossSpace两个属性
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else { // 这里是放得下
        flexLine.push(item);
      }
      //  在wrap的情况不管怎么样都要计算一下交叉轴的尺寸
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);

      mainSpace -= itemStyle[mainSize]; // 减去主轴空间
    }
  }

  flexLine.mainSpace = mainSpace; // 给最后一行的line加上space


  if (style.flexWrap === 'noWrap' || isAutoMainSize) { // 如果是nowrap就保存crossSpace
    flexLine.crossSpace = (style[crossSize] !== (void 0)) ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  // 单行的逻辑
  if (mainSpace < 0) { // mainSpace < 0对所有元素进行等比压缩，根据主轴的size进行压缩
    let scale = style[mainSize] / (style[mainSize] - mainSpace); // 主轴除以主轴尺寸减去剩余空间表示期望的尺寸，相当于等比压缩
    let currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);

      if (itemStyle.flex) { // flex 没有权利参加等比压缩的，所以它的尺寸是0 
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale; // 如果有主轴尺寸，就乘以scale

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // 多行的逻辑
    flexLines.forEach(items => {

      let mainSpace = items.mainSpace;
      let flexTotal = 0;

      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }
      if (flexTotal > 0) { // 有flex的元素
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        let currentMain, step;
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase;
          step = 0; // 无间隔
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase;
          step = 0; // 无间隔
        }
        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase;
          step = 0; // 无间隔
        }
        if (style.justifyContent === 'space-between') {
          step = mainSpace / (items.length - 1) * mainSign;
          currentMain = mainBase;
        }
        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign;
          currentMain = step / 2 + mainBase;
        }

        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          // itemStyle[mainStart, currentMain];
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    })
  }

  // let crossSpace;

  if (!style[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  let lineSize = style[crossSize] / flexLines.length; // 行数

  let step;
  if (style.alignContent === 'flex-start') {
    crossBase += 0;
    step = 0;
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace;
    step = 0;
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2;
    step = 0;
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if (style.alignContent === 'space-around') {
    step = crossSpace / (flexLines.length);
    crossBase += crossSign * step / 2;
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0;
    step = 0;
  }
  flexLines.forEach(items => {
    // 这一行的真实的交叉轴的尺寸
    let lineCrossSize = style.alignContent === 'stretch' ?
      items.crossSpace + crossSpace / flexLines.length : items.crossSpace;

    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);

      let align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = (align === 'stretch') ?
          lineCrossSize : 0;
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize);

        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }

    }
    crossBase += crossSign * (lineCrossSize + step);
  });

  // console.log(JSON.stringify(items, null, '  '));

}

module.exports = layout