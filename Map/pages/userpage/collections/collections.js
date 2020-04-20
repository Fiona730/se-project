// pages/userpage/posts/posts.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pposts: [],
  },

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
      })
    }
    this.setData({ "pposts": pposts });
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
  },

  tapPost: function (e) {
    // 进入相应帖子的查看界面
    let idx = e.currentTarget.dataset.idx;
    // this.saySth(`你点击了帖子${idx}`);
  },

  saySth: function (sth) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.generatePseudoTests();
    this.getCollectionsFromUser();
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

  onReachBottom: function () {
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