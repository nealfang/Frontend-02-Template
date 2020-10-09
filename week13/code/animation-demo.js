import { Timeline, Animation } from './animation.js'
import { linear, ease, easeIn, easeInOut, easeOut } from './ease.js'

let timeline = new Timeline()
timeline.add(new Animation(
  document.querySelector('#el').style,
  'transform',
  0,
  500,
  3000,
  0,
  easeOut,
  v => `translateX(${v}px)`))
timeline.start()

document.querySelector('#pause-btn').addEventListener('click', () => timeline.pause())
document.querySelector('#resume-btn').addEventListener('click', () => timeline.resume())