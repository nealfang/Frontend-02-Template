// 私有变量
const TICK = Symbol('tick')
const TICk_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const RESUME_TIME = Symbol('resume-time')

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }

  start() {
    let startTime = Date.now()
    this[RESUME_TIME] = 0
    this[TICK] = () => {
      let now = Date.now()
      for (const animation of this[ANIMATIONS]) {
        let t = 0
        let animationStartTime = this[START_TIME].get(animation)

        if (animationStartTime < startTime) {
          t = now - startTime - this[RESUME_TIME]
        } else {
          t = now - animationStartTime - this[RESUME_TIME]
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        animation.receive(t)
      }
      this[TICk_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }

  // set rate(){}
  // get rate(){}

  pause() {
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICk_HANDLER])
  }

  resume() {
    this[RESUME_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset() {

  }

  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now()
    }
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }
}
export class Animation {
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction,
    template
  ) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.timingFunction = timingFunction
    this.delay = delay
    this.template = template
  }

  receive(time) {
    let range = this.endValue - this.startValue
    this.object[this.property] = this.template(this.startValue + range * time / this.duration) // 如何理解？
  }
}