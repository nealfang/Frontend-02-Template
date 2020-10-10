import { createElement } from './framework'
import { Timeline, Animation } from './animation'
import { Carousel } from './Carousel'

let imgs = ['cat.jpg', 'cat1.jpg', 'cat2.jpg', 'cat3.jpg'];
(<Carousel src={imgs} />).mountTo(document.body);

let timeline = new Timeline()
timeline.add(new Animation({}, 'a', 0, 100, 1000, null))
timeline.start()