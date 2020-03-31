// pages/setting/setting.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : {},
    switch1Chked : false,
    switch2Chked : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
      this.setData({userInfo:app.globalData.userInfo})
    }
  },

  tapLogout: function(){
    // 用户点击退出登录
    wx.showToast({
      title: '开发中> <',
      duration: 1500,
      mask: true,
    })
  },

  tapUserPage: function(){
    // 用户点击用户页面入口
    wx.showToast({
      title: '开发中> <',
      duration: 1500,
      mask: true,
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


})