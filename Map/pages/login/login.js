
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:null,
    hasUserInfo:false,
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //按钮的点击事件
  bindGetUserInfo: function (res) {
    let info = res;
    console.log("用户信息");
    console.log(info);
    if (info.detail.userInfo) {
      console.log("点击了同意授权");
      let _this = this;
      // wx.login({
      //   success: function (res) {
      //     if (res.code) {
      //       //后端交互获取用户信息
      //       console.log(res)
      //       console.log(res.code)
      //     }
      //     else {
      //       console.log("授权失败");
      //     }
      //   },
      // });
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          app.globalData.userInfo = info.detail.userInfo;
          console.log(app.globalData);
          wx.cloud.callFunction({
            name: "getUser",
            data: {
              openId: app.globalData.openid
            },
            success(res){
              console.log("请求getUser云函数成功", res)
              if (res.result.data.length === 1)
                {
                  console.log("获得UserData", res)
                  app.globalData.userData = res.result.data[0]
                }
              else if (res.result.data.length === 0)
                {
                  console.log("无该User记录，新建数据库条目", res)
                  wx.cloud.callFunction(
                    {
                      name: "addUser",
                      data: {
                        openId: app.globalData.openid,
                        userInformation: app.globalData.userInfo,
                        nickName: app.globalData.userInfo.nickName
                      },
                      success(res){
                        console.log("请求addUser云函数成功", res)
                        wx.cloud.callFunction({
                          name: "getUser",
                          data: {
                            openId: app.globalData.openid
                          },
                          success(res){
                            console.log("添加用户后请求getUser云函数成功", res)
                            app.globalData.userData = res.result.data[0]
                          },
                          fail(res){
                            console.log("添加用户后请求getUser云函数失败", res)
                          }
                        })
                      },
                      fail(res){
                        console.log("请求addUser云函数失败", res)
                      }
                    }
                  )
                }
              else {
                console.log("多于1个User条目", res)
              }
            },
            fail(res){
              console.log("请求getUser云函数失败", res)
            }
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })

      wx.redirectTo({
        url: "/pages/map/map"
      })

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }
})
