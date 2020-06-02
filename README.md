### NoteCompass字条罗盘

本代码实现了一个可以发送树洞的微信小程序，下载后使用微信开发者工具打开Map文件夹编译即可
而SimpleCloud是一个简单的测试，是开发者们熟悉微信小程序云开发时使用的测试代码
下面对Map下面各个目录做介绍
- cloudfunctions是云函数代码，下面各个函数主要是向数据库中添加、修改、删除数据
- colorui是前端使用的库
- resources是代码中用到的一些图片
- miniprogram里是一些测试代码
- pages下
  - heatmap是热力图界面
  - login是登录界面
  - map是地图界面
  - show是展示界面
  - publish主要是发布相关界面，具体的，分别是：投票(vote)、求助(help)、发帖(text)、集合(meet)
  - userpage是用户主页相关界面，具体的，posts是用户以前发过的帖子、friends是用户朋友