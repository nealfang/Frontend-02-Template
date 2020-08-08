

const images = require('images');

function render(viewport, element) {
    if (element.style) { // 有样式才进行操作
        var img = images(element.style.width, element.style.height); // 创建新的image对象

        if (element.style["background-color"]) {
            let color = element.style["background-color"] || "rgb(0,0,0)";
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }

    if (element.children) {
        for(var child of element.children) {
            render(viewport, child);
        }
    }
}

module.exports = render;