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
    // console.log("主题：" + this.data.titleValue + " 内容：" + this.data.contentValue);
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
  // bindButtonTap: function () {
  //   this.setData({
  //     focus: true
  //   })
  // },
  // bindKeyInput: function (e) {
  //   this.setData({
  //     inputValue: e.detail.value
  //   })
  // },
  // bindReplaceInput: function (e) {
  //   var value = e.detail.value
  //   var pos = e.detail.cursor
  //   if (pos != -1) {
  //     // 光标在中间
  //     var left = e.detail.value.slice(0, pos)
  //     // 计算光标的位置
  //     pos = left.replace(/11/g, '2').length
  //   }

  //   // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
  //   return {
  //     value: value.replace(/11/g, '2'),
  //     cursor: pos
  //   }
  //   // 或者直接返回字符串,光标在最后边
  //   // return value.replace(/11/g,'2'),
  // },
  // bindHideKeyboard: function (e) {
  //   if (e.detail.value === "123") {
  //     //收起键盘
  //     wx.hideKeyboard()
  //   }
  // },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;
    let loc;
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