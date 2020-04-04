var app = getApp()

Page({
  data: {
    "longitude": "",
    "latitude": "",
    "location": true,
    hasUserInfo: false,
    UserInfo: {},
    //帖子集合
    Posts:{
      haslist: false,
      list: []
    },
    markers: [],
    //tab菜单
    hastablist: false,
    tablist: [
      { id: 0, value: "PKU" },
      { id: 1, value: "燕南"},
      { id: 2, value: "学五" },
      { id: 3, value: "一教" },
      { id: 4, value: "理教" },
      { id: 5, value: "学一" },
      { id: 6, value: "二教" },
      { id: 7, value: "三教" }],
    inputInfo: '请输入关键字',
    isPopping: false,
    animadd: {},
    animloc: {},
    animmail: {},
  },
  getmess: function () {
    var that = this;
    const mks = this.data.Posts.list.map((value, index) =>{
      return {
        iconPath: value.iconPath,
        id: value.id,
        latitude: value.latitude,
        longitude: value.longitude,
        width: 50,
        height: 50,
        clickable: true
      }
    })
    that.setData({
      markers: that.data.markers.concat(mks)
    })
    console.log(this.data.markers)
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          /*
          //添加当前位置
          markers: [{
            id: 0,
            iconpath: "/resources/1.png",
            longitude: res.longitude,
            latitude: res.latitude,
            clickable: false
          }]*/
        })
        //后端交互获取帖子信息
        //显示帖子
        that.getmess();
      }
    })
  },

  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   console.log("用户信息存在")
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // }
    // else{
    //   this.setData({hasUserInfo: false})
      // 强制跳转到登录界面？
      // wx.navigateTo({url: '/pages/login/login',})
    //}
  },
  onShow: function () {
    if (app.globalData.userInfo) {
      console.log("用户信息存在")
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    else {
      this.setData({ hasUserInfo: false })
      // 强制跳转到登录界面？
      // wx.navigateTo({url: '/pages/login/login',})
    }
    var that = this;
    that.setData({
      location: true,
      userInfo: app.globalData.userInfo,
    })
    that.getLocation()
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },
  //回到当前定位位置
  tapclick() {
    //将地图中心移动到当前定位点。需要配合map组件的show-location使用
    var that = this;
    that.setData({
      location: true
    })
    this.mapCtx.moveToLocation()
  },
  //当移动地图时触发
  regionchange: function (e) {
    var that = this;
    if (e.causedBy == "drag") {
      that.setData({
        location: false
      })
    }
  },
  //点击头像，进入用户界面
  userchange: function () {
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },
  //点击未登录头像，登录
  nouser: function () {
    wx.navigateTo({ url: '/pages/setting/setting', })
  },
  //点击帖子
  markertap: function () {

  },
  //弹出tab列表
  choosetab: function () {
    this.setData({
      hastablist: !this.data.hastablist
      //向后端请求tab列表并赋值

    })
  },

  //将焦点给到 input（在真机上不能获取input焦点）
  tapInput() {
    this.setData({
      //在真机上将焦点给input
      inputFocus: true,
      //初始占位清空
      inputInfo: ''
    });
  },
  //input 失去焦点后将 input 的输入内容给到cover-view
  blurInput(e) {
    var that = this;
    that.setData({
      inputInfo: e.detail.value
    });
    if (that.data.inputInfo==''){
      that.setData({
        inputInfo: "请输入关键字"
      });
    }
  },
  //点击弹出
  add: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.takeback();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.popp();
      this.setData({
        isPopping: true
      })
    }
  },
  //弹出动画
  popp: function () {
    //add顺时针旋转
    var animationadd = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationloc = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationmail = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationchk = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    animationadd.rotateZ(45).step();
    animationloc.translate(-80, 0).rotateZ(360).opacity(1).step();
    animationmail.translate(80, 0).rotateZ(360).opacity(1).step();
    animationchk.translate(0, -80).rotateZ(360).opacity(1).step();
    this.setData({
      animadd: animationadd.export(),
      animloc: animationloc.export(),
      animmail: animationmail.export(),
      animchk: animationchk.export(),
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationadd = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationloc = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationmail = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationchk = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    animationadd.rotateZ(0).step();
    animationloc.translate(0, 0).rotateZ(0).opacity(0).step();
    animationmail.translate(0, 0).rotateZ(0).opacity(0).step();
    animationchk.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animadd: animationadd.export(),
      animloc: animationloc.export(),
      animmail: animationmail.export(),
      animchk: animationchk.export(),
    })
  },
  //图文
  addmail: function (){
    wx.navigateTo({
      url: '../publish/text/text',
    })
  },
  //集合点
  addloc: function () {
    wx.navigateTo({
      url: '../publish/meet/meet',
    })
  },
  //签到
  addchk: function () {
    wx.navigateTo({
      url: '../publish/checkin/checkin',
    })
  }
})