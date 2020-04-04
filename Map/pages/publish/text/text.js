Page({
  data: {
    focus: false,
    inputValue: '',
    titleValue: '',
    contentValue: '',
    imgPath: '',
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
      tag: 'text', 
      title: this.data.titleValue, 
      content: this.data.contentValue,
      img: this.data.imgPath,
      position: this.data.position
    });
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1000,
    });
    setTimeout(function () { wx.navigateBack();}, 1000);
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
        _this.setData({
          imgPath: res.tempFilePaths[0]
        })
      },
      fail: e => {
        console.error(e);
      },
      complete: () => {
        wx.hideLoading();
      }
    })
    
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;
    wx.getLocation({
      success: function(res) {
        _this.setData({
          position: res
        });
      },
      fail: function(e){
        console.error(e);
        wx.navigateBack()
      }
    })
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