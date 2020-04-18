var app = getApp();
var util = require('../../../unit.js');  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //发帖人信息
    PostUserId: '', 
    PostUserUrl: '',
    PostUserName: '',
    //帖子信息
    PageID: '',
    Type: '',
    Day: '',
    Time: '',
    Title: '',
    Content: '',
    ImgPath: '',
    //回复信息
    InputBottom: 0,
    InputValue: '',
    Comments: []
  },

  //查询数据库获得帖子本身信息
  async HoleData(index){
    var that = this
    console.log("holeId", index)
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "getHoleByHoleId",
        data: {
          holeId: index
        },
        success(res) {
          console.log("请求getHoleByHoleId云函数成功", res)
          that.setData({
            PageID: index,
            ImgPath: res.result.data.img,
            Type: res.result.data.type,
            PostUserId: res.result.data.userId,
            Day: res.result.data.createTime.substring(0, 10),
            Time: res.result.data.createTime.substring(11, 16),
            Title: res.result.data.title,
            Content: res.result.data.content,
          })
          resolve(res)
        },
        fail(res) {
          console.log("请求getHolebyId云函数失败", res)
        },
      })
    })
  },

  //查询数据库获得发帖人信息
  async PostUserData() {
    var that = this
    const db = wx.cloud.database()
    console.log("发帖人", db, that.data.PostUserId)
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "getUserByUserId",
        data: { userId: that.data.PostUserId },
        success(res) {
          console.log("请求getUserByUserId云函数成功", res)
          that.setData({
            PostUserUrl: res.result.data[0].userinfo.avatarUrl,
            PostUserName: res.result.data[0].userinfo.nickName
          })
          resolve(res)
        },
      })
    })
  },

  //查询数据库获得回复信息
  async CommentData() {
    var that = this
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "getCommentByHoleId",
        data: { holeId: that.data.PageID },
        success(res) {
          console.log("请求getCommentByHoleId云函数成功", res)
          that.setData({
            Comments: res.result.data
          })
          var len = that.data.Comments.length
          var time = ''
          for(let i = 0; i < len; i++) 
          {
            time = that.data.Comments[i].createTime
            // time = util.formatTime(that.data.Comments[i].createTime)
            that.setData({
              ["Comments[" + i + "].createTime"]: time.substring(0, 10) + " " + time.substring(11, 16)
            })
            console.log("回复日期", that.data.Comments[i].createTime)
          }
          resolve(res)
        },
      })
    })
    // const db = wx.cloud.database()
    // return new Promise((resolve, reject) => {
    //   db.collection('Comments').where({
    //     holeId: that.data.PageID
    //   }).get({
    //     success: res => {
    //       console.log("回复信息", res.data)
    //       that.setData({
    //         Comments: res.data
    //       })
    //       var len = that.data.Comments.length
    //       var time = ''
    //       for(let i = 0; i < len; i++) 
    //       {
    //         time = util.formatTime(that.data.Comments[i].createTime)
    //         that.setData({
    //           ["Comments[" + i + "].createTime"]: time
    //         })
    //       }
    //       console.log("回复日期", that.data.Comments[0].createTime)
    //       resolve(res)
    //     },
    //   })
    // })
  },

  //async
  async GetData(index){
    const do1 = await this.HoleData(index)
    const do2 = await this.PostUserData()
    const do3 = await this.CommentData()
  },

  onLoad: function (e) {
    console.log('e', e)
    var index = e.id
    this.GetData(index)
  },
  //回复
  InputFocus(e) {
    console.log('e', e)
    this.setData({
      InputBottom: e.detail.height
    })

  },
  InputBlur(e) {
    var that = this
    console.log('eB', e)
    that.setData({
      InputBottom: 0,
      InputValue: e.detail.value
    })
  },

  AddComment () {
    var that = this
    if (that.data.InputValue != '') {
      //添加回复
      wx.cloud.callFunction({
        name: "addComment",
        data: {
          holeId: that.data.PageID,
          userId: app.globalData.userData._id,
          userName: app.globalData.userInfo.nickName,
          userUrl: app.globalData.userInfo.avatarUrl,
          commentContent: that.data.InputValue
        },
        success(res) {
          console.log("添加回复成功", res)
          that.setData({ inputValue: '' })
          //刷新界面
          that.GetData(that.data.PageID)
        },
        fail(res) {
          console.log("添加回复失败", res)
        }
      })
    }
  }

})
