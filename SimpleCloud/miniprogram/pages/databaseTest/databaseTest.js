// pages/databaseTest/databaseTest.js
const test_db = wx.cloud.database()
let content = ""
let holeId = ""

Page({
  addContent(event){ content = event.detail.value },
  delContent(event) { holeId = event.detail.value },
  updId() { holeId = event.detail.value },
  updContent() { content = event.detail.value },
  addData(){
    test_db.collection("Test").add({
      data:{
        createTime: test_db.serverDate(),
        content: content,
        type: "帖子",
        num_likes: 0,
        num_collections: 0,
        num_reply: 0,
        hot: 1
      }}).then(res => {console.log(res)})
  },
  getData(){
    test_db.collection("Test").where({num_likes: 0}).get().then(res => {console.log(res)})
  },
  delData(){
    test_db.collection("Test").doc(holeId).remove().then(res => { console.log(res) })
  },
  updData(){
    test_db.collection("Test").doc(id).update({ data: content }).then(res => { console.log(res) })
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