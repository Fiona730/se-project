const app = getApp()
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
    wx.cloud.callFunction({
      name: "addHole",
      data: {
        holeTitle: this.data.titleValue,
        holeContent: this.data.contentValue,
        holeType: "帖子",
        num_likes: 0,
        num_replies: [],
        imgPath: this.data.imgPath,
        position: this.data.position,
        userId: app.globalData.userData._id,
        userName: app.globalData.userInfo.nickName
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
    })
    // console.log({
    //   tag: 'text', 
    //   title: this.data.titleValue, 
    //   content: this.data.contentValue,
    //   img: this.data.imgPath,
    //   position: this.data.position
    // });
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