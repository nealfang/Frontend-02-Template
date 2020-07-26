学习笔记

---

浏览器

一、工作原理

+ 浏览器架构图

  + ![image-20200725163243909](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200725163243909.png)

+ 有限状态机 （简称：状态机）cm 什么是有限状态机

  + 每一个状态都是一个机器

  + 每一个机器知道下一个状态

  + ![image-20200725163856827](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200725163856827.png)

    参考： https://zhuanlan.zhihu.com/p/47434856

  + js 如何实现Mealy状态机
    
    + ![image-20200725164402447](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200725164402447.png)

+ http 协议的解析

  + ![image-20200726101053111](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200726101053111.png)
  
+ 服务器环境的搭建

  + nodejs

+ 第一步 实现http请求

  + ![image-20200726110110104](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200726110110104.png)

+ 第二步 send函数总结

  + ![image-20200726110959295](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200726110959295.png)

+ 第三步 发送请求

  + response 的基本格式
  + ![image-20200726112111825](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200726112111825.png)

+ 第四步 responseParser

  + ![image-20200726140424752](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200726140424752.png)

+ 第五步 bodyParser 

  + ![image-20200726175001326](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20200726175001326.png)
