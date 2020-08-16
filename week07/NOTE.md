学习笔记

---

一、盒 

+ 盒模型

<img src="https://github.com/nealfang/Frontend-02-Template/blob/master/week06/images/1.jpg" alt="img" style="zoom:50%;" />

+ 正常流
  + 排版的基本步骤
    + 收集盒和文字进行
    +  计算盒在行中的排布
    + 计算行的排布
  + 分类
    + BFC 块级格式化上下文，从上往下排列
    + IFC 行级格式化上下文，从左往右排列
    + 图例

<img src="https://github.com/nealfang/Frontend-02-Template/blob/master/week06/images/2.jpg" alt="img" style="zoom:50%;" />

+ 正常流的行级排布

<img src="https://github.com/nealfang/Frontend-02-Template/blob/master/week06/images/3.jpg" alt="img" style="zoom:50%;" />

+ 正常流的块级排布 

  + float 浮动
  + clear 清楚浮动
  + 堆叠
  + margin 折叠 （只有在正常流的BFC出现）

+ BFC合并

  + 基础概念

    + Block Container，里面有BFC，即能够容纳正常流的BFC

      + block container、block、inline-block、table cell、grid cell、table-caption
      + 概括： 所有能容纳里边不是特殊的display的模式box，里面默认是正常流

    + Block-level Box，外面有BFC

      ![4](https://github.com/nealfang/Frontend-02-Template/blob/master/week06/images/4.jpg)

    + Block Box = 上面两种相加，里外都有BFC

+ 设立BFC （创建新的BFC）
  + floats
  + absolutely positioned elements
  + block containers
  + block boxes with 'overflow' other than 'visible'
+ BFC 合并
  + block box && overflow:visible
    + BFC合并与float
    + BFC合并与边距折叠
    + 小结：处在同一个BFC，对float和margin会有影响
+ Flex 排版
  + 基本逻辑
  + 收集盒进行
  + 计算盒在主轴方向的排布
  + 计算盒在交叉轴方向的排布
+ 动画
  + animation
    + animation-name 动画名字
    + animation-duration 动画的时长
    + animation-timing-function 动画的时间曲线
    + animation-interation-delay 动画开始前的延迟animation-interation-count 动画播放的参数
    + animation-direction 动画的方向
  + transition
    + transition-property 要变换的属性
    + transition-duration 变换的时长
    + transition-timing-function 时间曲线
    + transition-delay 延迟
  + 贝塞尔曲线实验  [https://cubic-bezier.com/#.17,.67,.83,.67](#.17,.67,.83,.67)

+ 颜色
  + HSL（色相，饱和度，亮度） 和 HSV（色相，饱和度，色值）
  + 主要的区别：L在100%时，为白色；V在100%时，为纯色
  + w3c 使用HSL
+ 绘制
  + 几何图形
    + border
    + box-shadow
    + border-radius
+ 文字
  + font
  + text-decoration
+ 位图
  + background-image



CSS 属性分类（初稿，原图在images文件夹）

<img src="[https://github.com/nealfang/Frontend-02-Template/blob/master/week06/images/CSS%E5%B1%9E%E6%80%A7%E5%88%86%E7%B1%BB.png](https://github.com/nealfang/Frontend-02-Template/blob/master/week06/images/CSS属性分类.png)" alt="CSS属性分类" style="zoom:200%;" />