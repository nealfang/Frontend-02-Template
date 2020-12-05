学习笔记

流程
  public-server（本地）--> public-tool（连接桥梁）-->server (线上)

把本地文件发送到线上服务
scp -P 8022 -r ./* neal@127.0.0.1:/home/neal/server
  ./*  在win10无效
  改用 Xftp 的方式发送文件


nodejs
流
