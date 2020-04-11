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
    switch2Chked : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if(app.globalData.userInfo){
      _this.setData({userInfo:app.globalData.userInfo,
          hasUserInfo:true})
      wx.cloud.callFunction({
        name: "getUser",
        data: {
          openId: app.globalData.openid
        },
        success(res){
          console.log("请求getUser云函数成功", res)
          if (res.result.data.length === 1)
            {
              console.log("获得UserData", res)
              _this.setData({userData: res.result.data[0]})
            }
          else if (res.result.data.length === 0)
            {
              console.log("无该User记录，新建数据库条目", res)
              wx.cloud.callFunction(
                {
                  name: "addUser",
                  data: {
                    openId: app.globalData.openid,
                    userInformation: app.globalData.userInfo,
                    nickName: app.globalData.userInfo.nickName
                  },
                  success(res){
                    console.log("请求addUser云函数成功", res)
                    wx.cloud.callFunction({
                      name: "getUser",
                      data: {
                        openId: app.globalData.openid
                      },
                      success(res){
                        console.log("添加用户后请求getUser云函数成功", res)
                        _this.setData({userData: res.result.data[0]})
                      },
                      fail(res){
                        console.log("添加用户后请求addUser云函数失败", res)
                      }
                    })
                  },
                  fail(res){
                    console.log("请求addUser云函数失败", res)
                  }
                }
              )
            }
          else {
            console.log("多于1个User条目", res)
          }
        },
        fail(res){
          console.log("请求getUser云函数失败", res)
        }
      })
    }else{
      this.setData({hasUserInfo:false})
      //是否强制登录？
    }
  },

  tapLogout: function(){
    // 用户点击退出登录
    app.globalData.userInfo = null;
    wx.redirectTo({
      url: '/pages/setting/setting',
    })
    this.saySth("已退出")
  },

  tapUserPage: function(){
    // 用户点击用户页面入口
    if(this.data.hasUserInfo){
      this.saySth('开发中> <')
      // Todo: jump to user's homepage
    }
    else{
      // 没登录...!
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },

  saySth:function(sth){
    wx.showToast({
      title: sth,
      duration: 1500,
      mask: true,
    })
  },

  toMessages: function(){
    this.saySth("开发中> <")
    // this.data.userData.messages
  },

  toFriends:function(){
    // this.saySth("开发中> <")
    // this.data.userData.fiends
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
    wx.navigateTo({
      url: '/pages/userpage/posts/posts',
    })
    this.saySth("开发中> <")
    // this.data.userData.posts
  },

  toCollections:function(){
    this.saySth("开发中> <")
    // this.data.userData.collections
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


})