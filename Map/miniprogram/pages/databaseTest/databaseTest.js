// pages/databaseTest/databaseTest.js
const app = getApp()
const test_db = wx.cloud.database()
let content = ""
let holeId = ""

Page({
  data: {
    avatarUrl: "user_unlogin.png",
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    datalist: [],
  },

  onLoad: function () {

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              app.globalData.userInfo = res.userInfo
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    }),

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      console.log("userInfo", e.detail.userInfo)
    }
  },

  addContent(event){ content = event.detail.value },
  delContent(event) { holeId = event.detail.value },
  updId(event) { holeId = event.detail.value },
  updContent(event) { content = event.detail.value },
  addData(){
    wx.cloud.callFunction({
      name:"addHole",
      data:{
        holeContent: content,
        holeType: "帖子",
        userId: app.globalData.openid,
        userName: app.globalData.userInfo.nickName
      },
      success(res){
        console.log("添加数据成功", res)
      },
      fail(res) {
        console.log("添加数据失败", res)
      }
    })
  },
  getData(){
    let that = this
    wx.cloud.callFunction({
      name: "getHoles",
      success(res){
        console.log("请求云函数成功", res)
        that.setData({datalist: res.result.data}) //现在datalist里面就存着返回的数据
      },
      fail(res){
        console.log("请求云函数失败", res)
      }
    })
  },
  delData(){
    wx.cloud.callFunction({
      name: "delHole",
      data: {
        holeId: holeId
      },
      success(res) {
        console.log("删除数据成功", res)
      },
      fail(res) {
        console.log("删除数据失败", res)
      }
    })
  },
  updData(){
    wx.cloud.callFunction({
      name: "updateHole",
      data: {
        holeId: holeId,
        holeContect: content,
      },
      success(res) {
        console.log("更新数据成功", res)
      },
      fail(res) {
        console.log("更新数据失败", res)
      }
    })
  },

  
  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})