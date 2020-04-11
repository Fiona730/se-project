// pages/userpage/posts/posts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pposts:[],
  },

  generatePseudoTests:function(){
    let pposts=this.data.pposts;
    for(let i=0;i<10;i++){
      pposts.push({
        title:`Title${i}`,
        content: `Content${i}`,
        article:`Article${i}`,
        num_likes: Math.floor((i*77 + 9) / 3)%53 + 2,
        num_replies: Math.floor((i *81 + 5) / 3)%47 + 6,
        createTime: undefined,
      })
    }
    this.setData({"pposts":pposts});
  },

  tapPost:function(e){
    // 进入相应帖子的查看界面
    let idx = e.currentTarget.dataset.idx;
    this.saySth(`你点击了帖子${idx}`);
  },

  saySth: function (sth) {
    wx.showToast({
      title: sth,
      duration: 1500,
      mask: true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.generatePseudoTests();
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

})