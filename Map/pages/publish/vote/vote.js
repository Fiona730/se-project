const app = getApp()
Page({
  data: {
    focus: false,
    inputValue: '',
    titleValue: '',
    aValue: '',
    bValue: '',
    cValue: '',
    dValue: '',
    imgPath: '',
    isAnonymous: false,
    position: null
  },
  titleInput: function (e) {
    this.setData({
      titleValue: e.detail.value
    })
  },
  aInput: function (e) {
    this.setData({
      aValue: e.detail.value
    })
  },
  bInput: function (e) {
    this.setData({
      bValue: e.detail.value
    })
  },
  cInput: function (e) {
    this.setData({
      cValue: e.detail.value
    })
  },
  dInput: function (e) {
    this.setData({
      dValue: e.detail.value
    })
  },
  checkboxChange: function (e) {
    console.log(e.detail.value);
    let newValue = !this.data.isAnonymous;
    this.setData({
      isAnonymous: newValue
    });
  },
  bindButtonPublish: function () {
    wx.cloud.callFunction({
      name: "addHole",
      data: {
        holeTitle: this.data.titleValue,

        holeContent: {vote: [{ name: this.data.aValue, id: 0, num: 0 }, {name: this.data.bValue, id: 1, num: 0}, {name: this.data.cValue, id: 2, num: 0
    }, {name: this.data.dValue, id: 3, num: 0}], voter:[]},

        holeContent: [this.data.aValue, this.data.bValue, this.data.cValue, this.data.dValue],

        holeType: "投票",
        num_likes: 0,
        num_replies: [],
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
    })
    console.log({
      tag: 'vote', 
      title: this.data.titleValue, 
      content: [this.data.aValue, this.data.bValue, this.data.cValue, this.data.dValue],
      img: this.data.imgPath,
      position: this.data.position
    });
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1000,
    });
    setTimeout(function () { wx.navigateBack(); }, 1000);
  },
  chooseImage: function () {
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
  editImage: function () {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      editable: !this.data.editable,
      imgPath: ''
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let _this = this;
    wx.getLocation({
      success: function (res) {
        _this.setData({
          position: res
        });
      },
      fail: function (e) {
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