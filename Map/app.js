App({
  onLaunch: function () {
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function(res){
        console.log("系统信息")
        console.log(res)
        that.globalData.iw = res.windowWidth
        that.globalData.ih = res.windowHeight
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    iw : '',
    ih : ''
  }
})