import { Component, createElement } from './framework'

class Carousel extends Component {
  constructor() {
    super()
    this.attributes = Object.create(null)
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  render() {
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (let reocrd of this.attributes.src) {
      let child = document.createElement('div')
      child.style.backgroundImage = 'url(./' + reocrd + ')'
      this.root.appendChild(child)
    }

    let position = 0

    this.root.addEventListener('mousedown', e => {
      const startX = e.clientX
      let children = this.root.children;

      const move = e => {
        const x = e.clientX - startX
        let current = position - ((x - x % 500) / 500)

        for (const offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos + children.length) % children.length // 处理掉负数
          const child = children[pos]
          child.style.transition = 'none'
          child.style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
        }
      }

      const up = e => {
        const x = e.clientX - startX
        position -= Math.round(x / 500)
        for (const child of children) {
          child.style.transition = ''
          child.style.transform = `translateX(${-position * 500}px)`
        }
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })


    // let currentIndex = 0;
    // setInterval(() => {
    //   let children = this.root.children;
    //   let nextIndex = [currentIndex + 1] % children.length
    //   let current = children[currentIndex]
    //   let next = children[nextIndex]

    //   next.style.transition = 'none'
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`

    //   setTimeout(() => {
    //     next.style.transition = ''
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
    //     next.style.transform = `translateX(${- nextIndex * 100}%)`
    //     currentIndex = nextIndex
    //   }, 16);

    // }, 2000)

    return this.root
  }
  mountTo(parent) {
    parent.appendChild(this.render())
  }
}

let imgs = ['cat.jpg', 'cat1.jpg', 'cat2.jpg', 'cat3.jpg']

// document.body.appendChild(b)
let a = <Carousel src={imgs} />
a.mountTo(document.body)