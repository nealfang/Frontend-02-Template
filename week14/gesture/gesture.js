let element = document.documentElement;

element.addEventListener('mousedown', event => {
  start(event)
  let mousemove = event => {
    move(event)
  }

  let mouseup = event => {
    end(event)
    element.removeEventListener('mousemove', mousemove)
    element.removeEventListener('mouseup', mouseup)
  }

  element.addEventListener('mousemove', mousemove)
  element.addEventListener('mouseup', mouseup)
})

element.addEventListener('touchstart', event => {
  for (const touch of event.changedTouches) {
    start(touch)
  }
})

element.addEventListener('touchmove', event => {
  for (const touch of event.changedTouches) {
    move(touch)
  }
})

element.addEventListener('touchend', event => {
  for (const touch of event.changedTouches) {
    end(touch)
  }
})

element.addEventListener('touchcancel', event => {
  for (const touch of event.changedTouches) {
    cancel(touch)
  }
})

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false

const start = (point) => {
  // console.log(point);
  startX = point.clientX, startY = point.clientY

  isTap = true
  isPan = false
  isPress = false

  handler = setTimeout(() => {
    console.log('press');
    isTap = false
    isPan = false
    isPress = true
    handler = null
  }, 500);
}
const move = (point) => {
  let dx = point.clientX - startX, dy = point.clientY - startY

  if (!isPan && dx ** 2 + dy ** 2 > 100) { // 处理10px的逻辑
    isTap = false
    isPan = true
    isPress = false
    clearTimeout(handler)
  }

  if (isPan) {
    console.log('pan');
  }
}

const end = (point) => {
  if (isTap) {
    console.log('tap');
    clearTimeout(handler)
  }
  if (isPan) {
    console.log('panend');
  }
  if (isPress) {
    console.log('pressend');
  }
}
const cancel = (point) => {
  console.log(point);
  clearTimeout(handler)
}