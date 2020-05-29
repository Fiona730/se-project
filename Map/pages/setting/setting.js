// pages/setting/setting.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo : {},
    userData : {},
    isDev: true,
    msgNum: 0,
    switch1Chked : false,
    switch2Chked : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if(app.globalData.userInfo){
      _this.setData({
        userInfo:app.globalData.userInfo, hasUserInfo:true,
        userData: app.globalData.userData
      })
    }else{
      this.setData({hasUserInfo:false});
      //是否强制登录？
    }
  },

  Logout:function(){
    app.globalData.userInfo = null;
    wx.redirectTo({
      url: '/pages/setting/setting',
    });
    this.saySth("已退出");
    this.hideQuit();
  },

  showQuit: function(){
    // 用户点击退出登录
    this.setData({showQuit: true});
  },

  hideQuit:function(){
    this.setData({ showQuit: false });
  },

  tapUserPage: function(){
    // 用户点击用户页面入口
    if(this.data.hasUserInfo){
      // Todo: jump to user's homepage
      wx.navigateTo({
        url: `/pages/userpage/homepage/homepage?user=${this.data.userData._id}&viewer=${this.data.userData._id}`,
      });
    }
    else{
      // 没登录...!
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }
  },

  saySth:function(sth){
    wx.showToast({
      title: sth,
      icon: 'success',
      duration: 1000,
    });
  },

  toMessages: function(){
    // this.data.userData.messages
    // wx.navigateTo({
    //   url: '/pages/userpage/messages/messages',
    // });
    this.saySth("开发中> <");
  },

  toFriends:function(){
    wx.navigateTo({
      url: `/pages/userpage/friends/friends?user=${this.data.userData._id}`,
    })
  },
  
  toPosts:function(){
    wx.navigateTo({
      url: `/pages/userpage/posts/posts?mode=posts&user=${this.data.userData._id}`,
    })
  },

  toCollections:function(){
    wx.navigateTo({
      url: `/pages/userpage/posts/posts?mode=collections&user=${this.data.userData._id}`,
    })
  },

})