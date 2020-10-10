let element = document.documentElement;

element.addEventListener('mousedown', event => {
  let mousemove = event => {
    console.log(456);
  }

  let mouseup = event => {
    console.log(123);
    element.removeEventListener('mousemove', mousemove)
    element.removeEventListener('mouseup', mouseup)
  }

  element.addEventListener('mousemove', mousemove)
  element.addEventListener('mouseup', mouseup)

})

element.addEventListener('touchstart', event=>{

})

element.addEventListener('touchmove', event=>{

})

element.addEventListener('touchend', event=>{
  
})