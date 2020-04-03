Page({
  data: {
    focus: false,
    inputValue: '',
    titleValue: '',
    contentValue: '',
    imgPath: '',
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
      tag: 'text', 
      title: this.data.titleValue, 
      content: this.data.contentValue,
      img: this.data.imgPath
    });
  },
  doUpload: function(){
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        // const filePath = res.tempFilePaths[0];
        _this.setData({
          imgPath: res.tempFilePaths[0]
        })
        // 上传图片
        // const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        // wx.cloud.uploadFile({
        //   cloudPath,
        //   filePath,
        //   success: res => {
        //     console.log('[上传文件] 成功：', res)

        //     app.globalData.fileID = res.fileID
        //     app.globalData.cloudPath = cloudPath
        //     app.globalData.imagePath = filePath

        //     wx.navigateTo({
        //       url: '../storageConsole/storageConsole'
        //     })
        //   },
        //   fail: e => {
        //     console.error('[上传文件] 失败：', e)
        //     wx.showToast({
        //       icon: 'none',
        //       title: '上传失败',
        //     })
        //   },
        //   complete: () => {
        //     wx.hideLoading()
        //   }
        // })

      },
      fail: e => {
        console.error(e);
      },
      complete: () => {
        wx.hideLoading();
      }
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