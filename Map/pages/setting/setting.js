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

  tapLogout: function(){
    // 用户点击退出登录
    app.globalData.userInfo = null;
    wx.redirectTo({
      url: '/pages/setting/setting',
    });
    this.saySth("已退出");
  },

  tapUserPage: function(){
    // 用户点击用户页面入口
    if(this.data.hasUserInfo){
      // Todo: jump to user's homepage
      wx.navigateTo({
        url: `/pages/userpage/homepage/homepage`,
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
    // this.data.userData.friends
    // example cloud function usage for adding friends
    let _this = this;
    wx.cloud.callFunction({
      name: "addFriend",
      data: {
        userId: _this.data.userData._id,
        newFriend: {
          nickName: "Sherry",
          openId: "Sherry's _id",
        }
      },
      success(res) {
        console.log("添加好友成功", res)
      },
      fail(res) {
        console.log("添加好友失败", res)
      }
    })
  },
  
  toPosts:function(){
    // wx.navigateTo({
    //   url: '/pages/userpage/posts/posts',
    // })   
    
    wx.navigateTo({
      url: `/pages/userpage/collections/collections?mode=posts&user=${app.globalData.openid}`,
    })
  },

  toCollections:function(){
    wx.navigateTo({
      url: `/pages/userpage/collections/collections?mode=collections&user=${app.globalData.openid}`,
    })
    // this.data.userData.collections
  },



})