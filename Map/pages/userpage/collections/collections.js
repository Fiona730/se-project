const app = getApp()
let longtap=false;
// lazy loading things
let user_collections = undefined;
let num_loaded = 0;
let next_loaded = 0;
const batch_size = 8;

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
    wx.showLoading({ title: '正在请求'});


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
    wx.showLoading({ title: '加载中'});

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
    user_collections = app.globalData.userData.collections;
    this.setData({ num_posts: user_collections.length});
    this.loadBatch();
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

  onLoad: function (args) {
    /*  Arguments
      user: user_id [[[需要usedata.openid,而不是userdata._id为什么呢]]]
      mode: 'collections'|'posts' 
    */
    // 其他用户/自己 的 收藏/发布(4种情况)
    this.num_loaded = this.next_loaded = 0;
    this.mode=args.mode;
    this.tgt_user=args.user;
    console.log(this.tgt_user);
    // this.getCollectionsFromUser();
    this.getPostsFromUser();
    this.setData({ 
                user_id: app.globalData.userData._id,  // 当前登录用户的ID
                mode: args.mode,    // 模式：发布 OR 收藏
                tgt_user: args.user, // 当前被浏览用户的openID
                isMe: (args.user == app.globalData.userData._id)  // 这用户是我吗...(权限检查) 
                 })  
  },

  onReachBottom: function () {
    // lady loading 测试版...!
    this.loadBatch();
  }

})