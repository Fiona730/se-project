// pages/userpage/posts/posts.js
const app = getApp()
var eventChannel

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:[],
  },

  // generatePseudoTests:function(){
  //   let posts=this.data.posts;
  //   for(let i=0;i<10;i++){
  //     posts.push({
  //       title:`Title${i}`,
  //       content: `Content${i}`,
  //       // article:`Article${i}`,
  //       num_likes: Math.floor((i*77 + 9) / 3)%53 + 2,
  //       num_replies: Math.floor((i *81 + 5) / 3)%47 + 6,
  //       createTime: undefined,
  //     })
  //   }
  //   this.setData({"posts":posts});
  // },

  tapPost:function(e){
    // 进入相应帖子的查看界面
    let idx = e.currentTarget.dataset.idx;
    // this.saySth(`你点击了帖子${idx}`);
  },

  saySth: function (sth) {
    
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
          posts_value.push({
            type:res.result.data.type,
            title:res.result.data.title,
            content: res.result.data.content,
            hot: res.result.data.hot,
            num_likes: res.result.data.num_likes,
            num_replies: res.result.data.num_reply,
            createTime: res.result.data.createTime.substring(5,10),
          })
          _this.setData({posts: posts_value})
        },
        fail(res){
          console.log("请求getHolebyId云函数失败", res)
        },
      })
    }
    _this.setData({posts: posts_value})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.generatePseudoTests();
    console.log("posts_value_1", this.data.posts)
    this.getPostsFromUser()
    console.log("posts_value_2", this.data.posts)
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