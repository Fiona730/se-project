// pages/userpage/friends/friends.js
const app = getApp()
const batch_size = 8;

Page({

  data: {
    friends: [],
  },

  loadBatch: function () {

    let len = this.listFriends.length;
    if (len == this.num_loaded) return;
    let that = this;
    let new_batch = Math.min(batch_size, len - this.num_loaded);
    this.next_loaded += new_batch;
    wx.showLoading({ title: '加载中' });

    for (let i = this.num_loaded; i < this.num_loaded + new_batch; i++) {
      if (that.listFriends[i].nickName == "Sherry") {
        let cur_post = {
          _id: that.listFriends[i],
          // nickName: "xxx",
          nickName: "Sherry",
          image: null
        }
        that.setData({
          [`friends[${i}]`]: cur_post,
        })
        that.num_loaded += 1;
        if (that.num_loaded == that.next_loaded) {
          wx.hideLoading();
          wx.showToast({
            title: '加载完成',
            icon: 'success',
            duration: 1000,
          });
        }
        continue;
      }
      wx.cloud.callFunction({
        name: "getUserByUserId",
        data: {
          userId: this.listFriends[i]
        },
        success(res) {
          console.log("请求getUserByUserId云函数成功", res)
          console.log(res.result.data)
          let cur_post = {
            _id: that.listFriends[i],
            // nickName: "xxx",
            nickName: res.result.data[0].userinfo.nickName,
            image: res.result.data[0].userinfo.avatarUrl
          }
          // 每个请求成功时, 都直接对this.data.posts的对应下标使用setData
          // 可以防止因为网络波动导致的乱序~
          that.setData({
            [`friends[${i}]`]: cur_post,
          })
          that.num_loaded += 1;
          if (that.num_loaded == that.next_loaded) {
            wx.hideLoading();
            wx.showToast({
              title: '加载完成',
              icon: 'success',
              duration: 1000,
            });
          }
        },
        fail(res) {
          console.log("请求getUserByUserId云函数失败", res)
        },
      })
    }
  },

  getFriendsFromUser: function () {
    let that = this
    wx.cloud.callFunction({
      name: "getUserByUserId",
      data: {
        userId: that.tgt_user,
      },
      success(res) {
        console.log("请求getUserByUserId云函数成功", res);
        that.userData = res.result.data[0];
        that.listFriends = that.userData.friends;
        that.setData({ num_friends: that.listFriends.length });
        that.loadBatch();
      },
      fail(res) {
        console.log("请求getUserByUserId云函数失败", res);
        assert(false);  // hoho
      }
    })
  },

  toUser: function (e) {
    let uid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/userpage/homepage/homepage?user=${uid}&viewer=${this.tgt_user}`,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (args) {
    this.num_loaded = this.next_loaded = 0;
    this.tgt_user = args.user;
    this.getFriendsFromUser();
    this.setData({
      user_id: app.globalData.userData._id,  // 当前登录用户的ID
      tgt_user: args.user, // 当前被浏览用户的openID
    })
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    // lady loading
    this.loadBatch();
  }

})