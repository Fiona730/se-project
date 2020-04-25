//app.js
App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'se-course-0ypqs',
        traceUser: true
      })
    }

  },
  globalData: {
    userInfo: null
  }
})