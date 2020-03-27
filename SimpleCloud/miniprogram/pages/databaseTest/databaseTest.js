// pages/databaseTest/databaseTest.js
const test_db = wx.cloud.database()
let content = ""
let holeId = ""

Page({
  data: {
    datalist: []
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
        userId: wx.getStorageSync('userId'),
        userName: wx.getStorageSync('userName')
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
  _handlerSubmit: function (evt) {
    //console.log(evt)
    // 1.get value
    let account = evt.detail.value.account
    let pwd = evt.detail.value.pwd
    // console.log(account, pwd)
    //2.save into cloud database
    const db = wx.cloud.database()
    const accountCollection = db.collection("Sample")

    if (evt.detail.target.id === "login") {
      accountCollection.where({
        account: account,
        pwd: pwd
      }).get().then(res => {
        if (res.data.length > 0) {
          console.log("Login successful", res)
        }
        else {
          console.log("Login unsuccessful", res)
        }
      }).catch(err => {
        console.log("Login unsuccessful", err)
      })
    }
    else {
      accountCollection.add({
        data: {
          account: account,
          pwd: pwd
        },
      })
    }
  },
  
  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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