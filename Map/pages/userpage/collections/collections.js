// pages/userpage/posts/posts.js
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
        article: `Article${i}`,
        userName: `User${i}`,
        type: '帖子',
        avatarURL: "/resources/nouser_akarin.jpg",
        hot: 0,
        num_likes: 0,
        num_replies: 0,
        createTime: "2000-00-00",
      })
    }
    this.setData({ "pposts": pposts });
  },

  getCollectionsFromUser: function(){

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
    this.generatePseudoTests();
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