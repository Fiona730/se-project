<<<<<<< HEAD

const app = getApp()
let longtap=false;
// lazy loading things
let user_collections = undefined;
let num_loaded = 0;
let next_loaded = 0;
const batch_size = 8;
=======
// pages/userpage/posts/posts.js
const app = getApp()
>>>>>>> 0ed5d705b90e89303bb232971a26928d1c9c8a85

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    num_posts: undefined,
    selected_post: undefined,
  },

  // generatePseudoTests: function () {
  //   let posts = this.data.posts;
  //   for (let i = 0; i < 10; i++) {
  //     posts.push({
  //       title: `Title${i}`,
  //       content: `Content${i}`.repeat(15),
  //       // article: `Article${i}`,
  //       userName: `User${i}`,
  //       type: '帖子',
  //       avatarURL: "/resources/nouser_akarin.jpg",
  //       hot: 0,
  //       num_likes: 0,
  //       num_replies: 0,
  //       createTime: "2000-00-00",
  //     })
  //   };
  //   this.setData({ "posts": posts });
  // },

  removeCollection: function(){
    // 取消当前帖子的收藏... T T
    console.log(this.selectedPost);
    console.log(this.data.posts[this.selectedPost]);
    let postID = this.data.posts[this.selectedPost]._id;
    let that=this;
    wx.showLoading({ title: '正在请求', mask: true });

    wx.cloud.callFunction({
      name: "deleCollection",
      data: {
        holeId: postID,
        userId: app.globalData.userData._id,
      },
      success(res) {
        console.log("取消收藏成功", res);

        // 在本地删除已取消的收藏 @async
        for(let i=0;i<that.data.posts.length;i++)
          if(that.data.posts[i]._id==postID){
            that.data.posts.splice(i, 1);
            break;
          }
        that.setData({posts:that.data.posts});
        that.setData({ num_posts: that.data.posts.length });

        wx.showToast({
          title: '已取消收藏',
          icon: 'success',
          duration: 1000,
        })
        
        wx.cloud.callFunction({
          name: "getUser",
          data: {
            openId: app.globalData.openid
          },
          success(res) {
            console.log("请求getUser云函数成功", res)
            app.globalData.userData = res.result.data[0]
          },
          fail(res) {
            console.log("请求getUser云函数失败", res)
          }
        })
      },
      fail(res) {
        console.log("取消收藏失败", res)
      },
      complete(res) {
        wx.hideLoading();
      }
    });

    this.hideOptions();
    // this.getCollectionsFromUser();
  },

  showPost: function () {
    this.tapPost(this.selectedItemEvent);
    this.hideOptions();
  }, // 从帖子选单进入查看帖子 就包装一下

  longtapPost: function (e) {
    longtap = true;
    this.showOptions(e);
  },

  selectedPost: undefined,
  selectedItemEvent: undefined,
  showOptions: function (e) {
    // 点击了相应帖子的“更多”选项
    let idx = e.currentTarget.dataset.idx;
    this.setData({ showOptions: true });
    
    this.selectedPost = idx; //记住当前选中的帖子
    this.selectedItemEvent = e;
  },

<<<<<<< HEAD
  hideOptions: function () {
    this.setData({ showOptions: false });
    this.selectedPost = undefined;
    this.selectedItemEvent = undefined;
  },

  loadBatch: function () {

    let len = user_collections.length;
    if (len == num_loaded) return;
    let _this = this;
    let new_batch = Math.min(batch_size, len - num_loaded);
    next_loaded += new_batch;
    wx.showLoading({ title: '加载中', mask: true });

    console.log(num_loaded);
    console.log(next_loaded);

    for (let i = num_loaded; i < num_loaded + new_batch; i++) {
      wx.cloud.callFunction({
        name: "getHolebyId",
        data: {
          holeId: user_collections[i]
        },
        success(res) {
          console.log("请求getHolebyId云函数成功", res)

          let cur_post = {
            _id: res.result.data._id,
            type: res.result.data.type,
            title: res.result.data.title,
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
          _this.setData({
            [`posts[${i}]`]: cur_post,
          })
          num_loaded += 1;
          console.log(num_loaded);
          console.log(next_loaded);
          if (num_loaded == next_loaded) {
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
=======
  generatePseudoTests: function () {
    let pposts = this.data.pposts;
    for (let i = 0; i < 10; i++) {
      pposts.push({
        title: `Title${i}`,
        content: `Content${i}`.repeat(15),
        // article: `Article${i}`,
        userName: `User${i}`,
        type: '帖子',
        avatarURL: "/resources/nouser_akarin.jpg",
        hot: 0,
        num_likes: 0,
        num_replies: 0,
        createTime: undefined,
>>>>>>> 0ed5d705b90e89303bb232971a26928d1c9c8a85
      })
    }
  },

  getCollectionsFromUser: function(){
    let _this = this
    wx.cloud.callFunction({
      name: "getUser",
      data: {
        openId: app.globalData.openid
      },
      success(res){
        console.log("请求getUser云函数成功", res)
        app.globalData.userData = res.result.data[0]
      },
      fail(res){
        console.log("请求getUser云函数失败", res)
      }
    })
<<<<<<< HEAD
    user_collections = app.globalData.userData.collections;
    this.setData({ num_posts: user_collections.length});
    this.loadBatch();
=======
    let user_collections = app.globalData.userData.collections;
    let len = user_collections.length;
    for(let i=0; i<len; i++){
      wx.cloud.callFunction({
        name: "getHolebyId",
        data: {
          holeId: user_collections[i]
        },
        success(res){
          console.log("请求getHolebyId云函数成功", res)

          let cur_post = {
            type:res.result.data.type,
            title:res.result.data.title,
            content: res.result.data.content,
            hot: res.result.data.hot,
            num_likes: res.result.data.num_likes,
            num_replies: res.result.data.num_reply,
            createTime: res.result.data.createTime.substring(5,10),
            avatarURL: res.result.data.userImage,
          }
          if (cur_post.avatarURL == undefined)
            cur_post.avatarURL = "/resources/nouser_akarin.jpg"
          console.log('cur_post', cur_post)
          // 每个请求成功时, 都直接对this.data.posts的对应下标使用setData
          // 可以防止因为网络波动导致的乱序~
          _this.setData({
            [`pposts[${i}]`]:cur_post,
          })
        },
        fail(res){
          console.log("请求getHolebyId云函数失败", res)
        },
      })
    }
>>>>>>> 0ed5d705b90e89303bb232971a26928d1c9c8a85
  },

  tapPost: function (e) {
    // 进入相应帖子的查看界面
    if(longtap==true){
      longtap=false;
      return;
    }
    let idx = e.currentTarget.dataset.idx;
    console.log("e", e)
    // this.saySth(`你点击了帖子${idx}`);
    wx.navigateTo({
      url: '/pages/show/text/text?id=' + e.currentTarget.id,
    });
  },

  saySth: function (sth) {
    wx.showToast({
      title: sth,
      icon: 'success',
      duration: 1000,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
<<<<<<< HEAD
    // this.generatePseudoTests();
    num_loaded = next_loaded = 0;
=======
    //this.generatePseudoTests();
>>>>>>> 0ed5d705b90e89303bb232971a26928d1c9c8a85
    this.getCollectionsFromUser();
    this.setData({ user_id: app.globalData.userData._id })
  },

  onReachBottom: function () {
    // lady loading 测试版...!
    this.loadBatch();
  }

})