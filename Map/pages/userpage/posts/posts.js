// pages/userpage/posts/posts.js
const app = getApp()
let longtap = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:[],
    num_posts: undefined,
  },

  tapPost:function(e){
    if(longtap==true){
      // trick to handle longtap
      longtap=false;
      return;
    }

    // 进入相应帖子的查看界面
    let idx = e.currentTarget.dataset.idx;
    // this.saySth(`你点击了帖子${idx}`);
    console.log("进入帖子", e)
    wx.navigateTo({
      url: '/pages/show/text/text?id=' + this.data.posts[idx]._id,
    });
  },

  longtapPost:function(e){
    longtap=true;
    this.showOptions(e);
  },

  deletePost:function(){
    // 删除当前选中的帖子...
    console.log(this.selectedPost)
    let postID = this.data.posts[this.selectedPost]._id;
    

    this.hideOptions();
  },

  showPost:function(){
    this.tapPost(this.selectedItemEvent);
    this.hideOptions();
  }, // 从帖子选单进入查看帖子 就包装一下

  selectedPost: undefined,
  selectedItemEvent: undefined,
  showOptions:function(e){
    // 点击了相应帖子的“更多”选项
    let idx = e.currentTarget.dataset.idx;
    this.setData({showOptions:true});
    this.selectedPost=idx; //记住当前选中的帖子
    this.selectedItemEvent=e;
  },

  hideOptions:function(){
    this.setData({showOptions:false});
    this.selectedPost = undefined;
    this.selectedItemEvent = undefined;
  },

  getPostsFromUser:function(){
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
    let user_posts = app.globalData.userData.posts;
    _this.setData({num_posts: len});
    let len = user_posts.length;
    let posts_value = _this.data.posts;
    for(let i=0; i<len; i++){
      wx.cloud.callFunction({
        name: "getHolebyId",
        data: {
          holeId: user_posts[i]
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
            _id: res.result.data._id,
          }
          // 每个请求成功时, 都直接对this.data.posts的对应下标使用setData
          // 可以防止因为网络波动导致的乱序~
          _this.setData({
            [`posts[${i}]`]:cur_post,
          })
        },
        fail(res){
          console.log("请求getHolebyId云函数失败", res)
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.generatePseudoTests();
    this.getPostsFromUser()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  onReachBottom: function(){
    // 不一次加载全部帖子：lazyLoading
    // Todo：加载下一批帖子
    // 好像很复杂 之后再说把= =
    wx.showToast({
      title: 'Loading More...',
      icon: 'loading',
      duration: 1500,
      // mask:true,
    })
  }

})