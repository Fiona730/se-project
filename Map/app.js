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
  globalData: {
    userInfo: null,
    iw : '',
    ih : ''
  }
})