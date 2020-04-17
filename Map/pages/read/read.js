Page({
  data: {
    focus: false,
    inputValue: '',
    titleValue: '',
    contentValue: '',
    imgPath: '',
    position: null,

    title_content:[{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: black;'
      },
      children: [{
        type: 'text',
        text: '这是帖子的主题'
      }]
    }],

    article_content: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: black;'
      },
      children: [{
        type: 'text',
        text: '这是帖子的内容'
      }]
    }]
  },
  titleInput: function (e) {
    this.setData({
      titleValue: e.detail.value
    })
  },
  contentInput: function (e) {
    this.setData({
      contentValue: e.detail.value
    })
  },

  doUpload: function () {
    let _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        _this.setData({
          imgPath: res.tempFilePaths[0]
        })
      },
      fail: e => {
        console.error(e);
      },
      complete: () => {
        wx.hideLoading();
      }
    })

  },

  onLoad: function (e) {
    console.log('e', e)
    var index = e.id
    //后端交互获取帖子信息
    const db = wx.cloud.database()
    db.collection('Holes').where({
      _id: index
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res.data[0])
        this.setData({
          imgPath: res.data[0].img,
          "title_content[0].children[0].text": res.data[0].title,
          "article_content[0].children[0].text": res.data[0].content,
        })   
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})