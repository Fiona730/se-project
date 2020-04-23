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
    Comments: [],
    //交互信息
    Collect: false,
    Like: false
  },

  //查询数据库获得帖子本身信息
  async HoleData(index){
    var that = this
    console.log("holeId", index)
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "getHolebyId",
        data: {
          holeId: index
        },
        success(res) {
          console.log("请求getHolebyId云函数成功", res)
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
          let user_collections = app.globalData.userData.collections
          if (user_collections.indexOf(that.data.PageID) >= 0)
          {
            that.setData({ Collect: true })
          }
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
      db.collection('Users').where({
        _id:that.data.PostUserId
      }).get({
        success: res => {
          console.log("发帖人信息", res.data[0])
          that.setData({
            PostUserUrl: res.data[0].userinfo.avatarUrl,
            PostUserName: res.data[0].userinfo.nickName
          })
          resolve(res)
        }
      })
    })
  },

  //查询数据库获得回复信息
  async CommentData() {
    var that = this
    const db = wx.cloud.database()
    return new Promise((resolve, reject) => {
      db.collection('Comments').where({
        holeId: that.data.PageID
      }).get({
        success: res => {
          console.log("回复信息", res.data)
          that.setData({
            Comments: res.data
          })
          var len = that.data.Comments.length
          var time = ''
          for(let i = 0; i < len; i++) 
          {
            time = util.formatTime(that.data.Comments[i].createTime)
            that.setData({
              ["Comments[" + i + "].createTime"]: time
            })
          }
          console.log("回复日期", that.data.Comments[0].createTime)
          resolve(res)
        },
      })
    })
  },

  //async
  async GetData(index){
    const do1 = await this.HoleData(index)
    const do2 = await this.PostUserData()
    const do3 = await this.CommentData()
  },

  onLoad: function (e) {
    var that = this
    console.log('e', e)
    var index = e.id
    that.GetData(index)
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
  },

  //添加收藏
  AddCollect() {
    let that = this
    let user_collections = app.globalData.userData.collections
    console.log("收藏", user_collections)
    if (user_collections.indexOf(that.data.PageID)<0)
    {
      wx.cloud.callFunction({
        name: "addCollection",
        data: {
          holeId: that.data.PageID,
          userId: app.globalData.userData._id,
        },
        success(res) {
          console.log("添加收藏成功", res)
          that.setData({ Collect: true})
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
          console.log("添加收藏失败", res)
        }
      })
    }
    else
    {
      wx.cloud.callFunction({
        name: "deleCollection",
        data: {
          holeId: that.data.PageID,
          userId: app.globalData.userData._id,
        },
        success(res) {
          console.log("取消收藏成功", res)
          that.setData({ Collect: false })
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
        }
      })
    }
  },

  //添加点赞
  AddLike() {
    let that = this
    that.setData({ Like: !that.data.Like })
  }

})
