// pages/userpage/homepage/homepage.js
const app = getApp()

Page({

  data: {
    isDev: true,
    msgNum: 0,
    isFriend: undefined,
  },

  onLoad: function (args) {
    this.user_id = args.user;
    this.setData({ isMe: this.user_id == app.globalData.userData._id})
    this.getUserData();
    // 如果不是我 检查是否已是好友 and set isFriend variable
    
  },

  tapLogout: function () {
    // 用户点击退出登录
    app.globalData.userInfo = null;
    wx.redirectTo({
      url: '/pages/setting/setting',
    });
    this.saySth("已退出");
  },

  tapUserPage: function () {
    // 用户点击用户页面入口
    if (this.data.hasUserInfo) {
      // Todo: jump to user's homepage
      wx.navigateTo({
        url: `/pages/userpage/homepage/homepage`,
      });
    }
    else {
      // 没登录...!
      wx.redirectTo({
        url: '/pages/login/login',
      });
    }
  },

  getUserData: function () {
    wx.showLoading({ title: '加载中' });
    let that = this
    wx.cloud.callFunction({
      name: "getUserByUserId",
      data: {
        userId: this.user_id,
      },
      success(res) {
        console.log("请求getUser云函数成功", res);
        that.userData = res.result.data[0];
        that.setData({userData: that.userData});
      },
      fail(res) {
        console.log("请求getUser云函数失败", res);
        assert(false);  // hoho
      },
      complete(res) {
        wx.hideLoading();
      }
    })
  },

  toUserPosts: function () {
    console.log(this.userData);
    wx.navigateTo({
      url: `/pages/userpage/posts/posts?mode=posts&user=${this.data.userData._id}`,
    });
  },

  toUserCollections: function () {
    wx.navigateTo({
      url: `/pages/userpage/posts/posts?mode=collections&user=${this.data.userData._id}`,
    });
  },

  //  _______________________________________Add Friend_______________________________________
  //添加关注模态框
  ShowModel(e) {
    console.log("关注", e.currentTarget.dataset)
    this.setData({
      ModelName: this.userData.userinfo.nickName,
      ModelUrl: this.userData.userinfo.avatarUrl,
      Model_id: this.user_id,
    })
  },

  HideModel(e) {
    this.setData({
      Model_id: null
    })
  },

  //添加关注
  AddFriend() {
    let that = this
    wx.cloud.callFunction({
      name: "addFriend",
      data: {
        userId: app.globalData.userData._id,
        newFriend: that.user_id
      },
      success(res) {
        console.log("添加好友成功", res)
      },
    });
    this.HideModel();
  }
})