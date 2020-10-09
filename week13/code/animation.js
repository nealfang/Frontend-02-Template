// 私有变量
const TICK = Symbol('tick')
const TICk_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const RESUME_TIME = Symbol('resume-time')

export class Timeline {
  constructor() {
    this.state = "inited"
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }

  start() {
    if (this.state !== "inited") {
      return;
    }
    this.state = "started"
    let startTime = Date.now()
    this[RESUME_TIME] = 0
    this[TICK] = () => {
      let now = Date.now()
      for (const animation of this[ANIMATIONS]) {
        let t = 0
        let animationStartTime = this[START_TIME].get(animation)

        if (animationStartTime < startTime) {
          t = now - startTime - this[RESUME_TIME] - animation.delay
        } else {
          t = now - animationStartTime - this[RESUME_TIME] - animation.delay
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        if (t > 0) {
          animation.receive(t)
        }
      }
      this[TICk_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }

  // set rate(){}
  // get rate(){}

  pause() {
    if (this.state !== "started") return;
    this.state = 'paused'
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICk_HANDLER])
  }

  resume() {
    if (this.state !== "paused") return;
    this.state = 'started'
    this[RESUME_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset() {
    this.pause()
    this.state = "inited"
    this[PAUSE_TIME] = 0
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
    this[PAUSE_START] = 0
    this[TICK_HANDLER] = null
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
    this.timingFunction = timingFunction || (v => v)
    this.delay = delay
    this.template = template || (v => v)
  }

  receive(time) {
    let progress = this.timingFunction(time / this.duration)
    let range = this.endValue - this.startValue
    this.object[this.property] = this.template(this.startValue + range * progress)
  }
}