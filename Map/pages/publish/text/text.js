const app = getApp()
Page({
  data: {
    focus: false,
    inputValue: '',
    titleValue: '',
    contentValue: '',
    imgPath: '',
    local_imgPath: '',
    isAnonymous: false,
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
  checkboxChange: function(e) {
    console.log(e.detail.value);
    let newValue = !this.data.isAnonymous;
    this.setData({
      isAnonymous: newValue
    });
  },
  addHole: function(){
    wx.cloud.callFunction({
      name: "addHole",
      data: {
        holeTitle: this.data.titleValue,
        holeContent: {content: this.data.contentValue},
        holeType: "帖子",
        num_likes: 0,
        num_replies: 0,
        imgPath: this.data.imgPath,
        position: this.data.position,
        userId: app.globalData.userData._id,
        userName: app.globalData.userInfo.nickName,
        userImage: app.globalData.userInfo.avatarUrl,
        isAnonymous: this.data.isAnonymous
      },
      success(res) {
        console.log("添加树洞成功", res)
        // add hole id to user's record
        wx.cloud.callFunction({
          name: "addPostToUser",
          data: {
            userId: app.globalData.userData._id,
            postId: res.result._id
          },
          success(res) {
            console.log("添加用户树洞关联信息成功", res)
          },
          fail(res) {
            console.log("添加用户树洞关联信息失败", res)
          }
        })
      },
      fail(res) {
        console.log("添加树洞失败", res)
      }
    });
  },
  bindButtonPublish: function () {
    if (this.data.local_imgPath != ""){
      const filePath = this.data.local_imgPath;
      let timestamp = (new Date()).valueOf();
      const cloudPath = app.globalData.openid + "_" + timestamp + filePath.match(/\.[^.]+?$/)[0];
      wx.cloud.uploadFile({
        cloudPath:cloudPath,
        filePath: filePath,
        success: res => {
          console.log('[上传文件] 成功：', res)
          this.setData({
            imgPath: res.fileID
          })
          console.log("this.data", this.data.imgPath)
          this.addHole()
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        }
      });
    }
    else {
      this.addHole()
    }

    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1000,
    });
    setTimeout(function () { wx.navigateBack();}, 1000);
  },
  chooseImage: function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        that.setData({
          local_imgPath: res.tempFilePaths[0]
        })
        console.log("local_imgPath", that.data.local_imgPath)
      },
      fail: e => {
        console.error(e);
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },
  viewImage:function(e){
    wx.previewImage({
      urls: [this.data.local_imgPath],
      current: e.currentTarget.dataset.url
    });
  },
  deleteImg:function(e){
    console.log(e.currentTarget.dataset.index);
    this.setData({
      editable: !this.data.editable,
      local_imgPath: ''
    });
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