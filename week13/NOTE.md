学习笔记

#### 一、 js 实现动画的三种方式:
  ```js
  // 1， 不推荐，可能会挤压执行
    setInterval(()=>{}, 16)
  // 2
    let tick = () =>{
      // do something
      setTimeout(()=>{}, 16)
    }
  // 3, 现代浏览器推荐使用
    let tick = () =>{
      // do something
      requestAnimationFrame(tick)
    }
  ```
#### 二、css 动画实现的原理
  + 13