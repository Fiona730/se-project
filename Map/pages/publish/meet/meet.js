Page({
  data: {
    focus: false,
    inputValue: '',
    titleValue: '',
    contentValue: '',
    date: '',
    time: '',
    position: null
  },
  titleInput: function (e) {
    this.setData({
      titleValue: e.detail.value
    })
  },
  contentInput: function (e) {
    this.setData({
      contentValue: e.detail.value
    })
  },
  bindButtonPublish: function () {
    console.log({
      tag: 'meet', 
      title: this.data.titleValue, 
      content: this.data.contentValue,
      date: this.data.date,
      time: this.data.time,
      position: this.data.position
    });
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1000,
    });
    setTimeout(function () { wx.navigateBack();}, 1000);
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;

    wx.chooseLocation({
      success: function(res) {
        _this.setData({
          position: res
        });
      },
      fail: function(e){
        console.error(e);
        wx.navigateBack();
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})