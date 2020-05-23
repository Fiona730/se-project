const app = getApp()
const batch_size = 8;

Page({

  data: {
    posts: [],
  },

  deletePost: function () {
    // 删除当前选中的帖子...
    let postID = this.data.posts[this.selectedPost]._id;
    let that = this;
    wx.cloud.callFunction({
      name: "getHoleByHoleId",
      data: {
        holeId: postID,
      },
      success(res) {
        console.log("获取树洞信息成功", res)
        that.deleteCollection(res.result.data.collections, postID);
        wx.cloud.callFunction({
          name: "delePost",
          data: {
            holeId: postID,
            userId: that.data.user_id
          },
          success(res) {
            console.log("删除树洞成功", res)
            // 在本地删除已取消的收藏 @async
            for (let i = 0; i < that.data.posts.length; i++)
              if (that.data.posts[i]._id == postID) {
                that.data.posts.splice(i, 1);
                break;
              }
            that.setData({ posts: that.data.posts });
            that.setData({ num_posts: that.data.posts.length });
          },
          fail(res) {
            console.log("删除树洞失败", res)
          }
        })
      },
      fail(res) {
        console.log("获取树洞信息失败", res)
      }
    })
    this.hideOptions();
  },

  deleteCollection: function (collectors, postID) {
    // 这个函数是delectPost调用的
    // 跟removeCollection区分一下~
    let len = collectors.length;
    let that = this;
    for (let i = 0; i < len; i++) {
      wx.cloud.callFunction({
        name: "deleCollectionInUser",
        data: {
          userId: collectors[i],
          holeId: postID
        },
        success(res) {
          console.log("删除用户栏收藏成功", res)
        },
        fail(res) {
          console.log("删除用户栏收藏失败", res)
        }
      })
    }
  },

  removeCollection: function () {
    // 取消当前帖子的收藏... T T
    console.log(this.selectedPost);
    console.log(this.data.posts[this.selectedPost]);
    let postID = this.data.posts[this.selectedPost]._id;
    let that = this;
    wx.showLoading({ title: '正在请求' });

    wx.cloud.callFunction({
      name: "deleCollection",
      data: {
        holeId: postID,
        userId: app.globalData.userData._id,
      },
      success(res) {
        console.log("取消收藏成功", res);

        // 在本地删除已取消的收藏 @async
        for (let i = 0; i < that.data.posts.length; i++)
          if (that.data.posts[i]._id == postID) {
            that.data.posts.splice(i, 1);
            break;
          }
        that.setData({ posts: that.data.posts });
        that.setData({ num_posts: that.data.posts.length });

        wx.showToast({
          title: '已取消收藏',
          icon: 'success',
          duration: 1000,
        })

        // wx.cloud.callFunction({
        //   name: "getUser",
        //   data: {
        //     openId: app.globalData.openid
        //   },
        //   success(res) {
        //     console.log("请求getUser云函数成功", res)
        //     app.globalData.userData = res.result.data[0]
        //   },
        //   fail(res) {
        //     console.log("请求getUser云函数失败", res)
        //   }
        // })
      },
      fail(res) {
        console.log("取消收藏失败", res)
      },
      complete(res) {
        wx.hideLoading();
      }
    });

    this.hideOptions();
  },

  showPost: function () {
    console.log(this.selectedItemEvent);
    this.tapPost(this.selectedItemEvent);
    this.hideOptions();
  }, // 从帖子选单进入查看帖子 就包装一下

  longtapPost: function (e) { // warpper
    this.longtap = true;
    console.log(e);
    this.showOptions(e);
  },

  showOptions: function (e) {
    // 点击了相应帖子的“更多”选项
    let idx = e.currentTarget.dataset.idx;
    this.selectedItemEvent = e;
    console.log(this.selectedItemEvent);
    this.selectedPost = idx; //记住当前选中的帖子
    this.setData({ showOptions: true });
    this.setData({ selectedPost: this.data.posts[this.selectedPost] })

  },

  hideOptions: function () {
    this.setData({ showOptions: false });
    // this.selectedPost = undefined;
    // this.selectedItemEvent = undefined;
  },

  loadBatch: function () {

    let len = this.listPosts.length;
    if (len == this.num_loaded) return;
    let that = this;
    let new_batch = Math.min(batch_size, len - this.num_loaded);
    this.next_loaded += new_batch;
    wx.showLoading({ title: '加载中' });

    for (let i = this.num_loaded; i < this.num_loaded + new_batch; i++) {
      wx.cloud.callFunction({
        name: "getHolebyId",
        data: {
          holeId: this.listPosts[i]
        },
        success(res) {
          console.log("请求getHolebyId云函数成功", res)

          let cur_post = {
            _id: res.result.data._id,
            type: res.result.data.type,
            title: res.result.data.title.substring(0, 10),
            content: res.result.data.content,
            hot: res.result.data.hot,
            num_likes: res.result.data.num_likes,
            num_replies: res.result.data.num_reply,
            createTime: res.result.data.createTime.substring(5, 10),
            avatarURL: res.result.data.userImage,
            userName: res.result.data.userName,
            anonymous: res.result.data.isAnonymous,
            image: res.result.data.img,
            poster_id: res.result.data.userId,
          }
          // 每个请求成功时, 都直接对this.data.posts的对应下标使用setData
          // 可以防止因为网络波动导致的乱序~
          that.setData({
            [`posts[${i}]`]: cur_post,
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
          console.log("请求getHolebyId云函数失败", res)
        },
      })
    }
  },

  revQuestState: function () {
    // 变化求助类型帖子标记 reverse the state of quest type
    this.data.selectedPost.content.help = !this.data.selectedPost.content.help;
    wx.showLoading({ title: '正在请求' });
    let that = this;
    wx.cloud.callFunction({
      name: "updateHole",
      data: {
        holeId: that.data.selectedPost._id,
        holeContect: that.data.selectedPost.content
      },
      success(res) {
        console.log("updateHole成功", res);
        that.setData({ posts: that.data.posts });
        wx.showToast({
          title: '状态已变更',
          icon: 'success',
          duration: 1000,
        });
      },
      fail(res) {
        console.log("updateHole失败", res)
      },
      complete(res) {
        wx.hideLoading();
      }

    })
    this.hideOptions();
  },

  getCollectionsFromUser: function () {
    let that = this
    wx.cloud.callFunction({
      name: "getUser",
      data: {
        openId: app.globalData.openid
      },
      success(res) {
        console.log("请求getUser云函数成功", res)
        app.globalData.userData = res.result.data[0]
        that.listPosts = app.globalData.userData.collections;
        that.setData({ num_posts: that.listPosts.length });
        that.loadBatch();
      },
      fail(res) {
        console.log("请求getUser云函数失败", res)
      }
    })
  },

  getPostsFromUser: function () {
    let that = this
    wx.cloud.callFunction({
      name: "getUserByUserId",
      data: {
        userId: that.tgt_user,
      },
      success(res) {
        console.log("请求getUser云函数成功", res);
        that.userData = res.result.data[0];
        if (that.mode == 'posts')
          that.listPosts = that.userData.posts;
        else if (that.mode == 'collections')
          that.listPosts = that.userData.collections;
        that.setData({ num_posts: that.listPosts.length });
        that.loadBatch();
      },
      fail(res) {
        console.log("请求getUser云函数失败", res);
        assert(false);  // hoho
      }
    })
  },

  tapPost: function (e) {
    // 进入相应帖子的查看界面

    if (this.longtap == true) {
      this.longtap = false;
      return;
    }
    console.log("TapPost called");
    let idx = e.currentTarget.dataset.idx;
    wx.navigateTo({
      url: '/pages/show/text/text?id=' + this.data.posts[idx]._id,
    });
  },

  saySth: function (sth) {
    wx.showToast({
      title: sth,
      icon: 'success',
      duration: 1000,
    })
  },

  toUser:function(e){
    let uid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/userpage/homepage/homepage?user=${uid}`,
    });
  },

  onLoad: function (args) {
    /*  Arguments
      user: user_id [[[需要usedata.openid,而不是userdata._id为什么呢]]]
      mode: 'collections'|'posts' 
    */
    // 其他用户/自己 的 收藏/发布(4种情况)
    this.num_loaded = this.next_loaded = 0;
    this.mode = args.mode;
    this.tgt_user = args.user;
    console.log(this.tgt_user);
    this.getPostsFromUser();
    this.setData({
      user_id: app.globalData.userData._id,  // 当前登录用户的ID
      mode: args.mode,    // 模式：发布 OR 收藏
      tgt_user: args.user, // 当前被浏览用户的openID
      isMe: (args.user == app.globalData.userData._id)  // 这用户是我吗...(权限检查) 
    })
  },

  onReachBottom: function () {
    // lady loading
    this.loadBatch();
  }

})