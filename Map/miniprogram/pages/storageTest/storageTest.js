// pages/storageTest/storageTest.js
Page({
  _handlerChoose() {
    wx.chooseImage({
      success: (res) => {
        // console.log(res)
        let path = res.tempFilePaths[0]

        //cloud storage file upload
        wx.cloud.uploadFile({
          cloudPath: "hello world.png",
          filePath: path,
          success: (res) => {
            console.log("File upload successful", res)
            this.setData({
              imageSrc: res.fileID
            })
          },
          fail: (err) => {
            console.log("File upload unsuccessful", err)
          }
        })
      },
    })
  },

  /**
   * Page initial data
   */
  data: {
    imageSrc: "cloud://se-course-0ypqs.7365-se-course-0ypqs-1301555129/Hello World2.jpeg"
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