// pages/userpage/posts/posts.js
const app = getApp()
let longtap = false;
// lazy loading things
let user_posts= undefined;
let num_loaded=0;
let next_loaded=0;
const batch_size = 10;

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

  revQuestState:function(){
    // 变化求助类型帖子标记 reverse the state of quest type
    this.data.selected_post.content.help = !this.data.selected_post.content.help;
    wx.showLoading({ title: '正在请求', mask: true });
    let that=this;
    wx.cloud.callFunction({
      name: "updateHole",
      data: {
        holeId: that.data.selected_post._id,
        holeContect: that.data.selected_post.content
      },
      success(res) {
        console.log("updateHole成功", res);
        that.setData({posts:that.data.posts});
        wx.showToast({
          title: '状态已变更',
          icon: 'success',
          duration: 1000,
        });
      },
      fail(res) {
        console.log("updateHole失败", res)
      },
      complete(res){
        wx.hideLoading();
      }
      
    })
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
    this.setData({ selected_post: this.data.posts[idx] });
    this.selectedPost=idx; //记住当前选中的帖子
    this.selectedItemEvent=e;
  },

  hideOptions:function(){
    this.setData({showOptions:false});
    this.selectedPost = undefined;
    this.selectedItemEvent = undefined;
  },

  loadBatch: function(){
    console.log(num_loaded);
    let len = user_posts.length;
    if(len==num_loaded)return;
    let _this=this;
    let new_batch = Math.min(batch_size, len-num_loaded);
    next_loaded+=new_batch;
    wx.showLoading({title: '加载中',mask:true});

    for (let i = num_loaded; i < num_loaded + new_batch; i++) {
      wx.cloud.callFunction({
        name: "getHolebyId",
        data: {
          holeId: user_posts[i]
        },
        success(res) {
          console.log("请求getHolebyId云函数成功", res)

          let cur_post = {
            _id: res.result.data._id,
            type: res.result.data.type,
            title: res.result.data.title,
            content: res.result.data.content,
            hot: res.result.data.hot,
            num_likes: res.result.data.num_likes,
            num_replies: res.result.data.num_reply,
            createTime: res.result.data.createTime.substring(5, 10),
            avatarURL: res.result.data.userImage,
            userName: res.result.data.userName,
            anonymous: res.result.data.isAnonymous,
            image: res.result.data.img,
            poster_id : res.result.data.userId,
          }
          // 每个请求成功时, 都直接对this.data.posts的对应下标使用setData
          // 可以防止因为网络波动导致的乱序~
          _this.setData({
            [`posts[${i}]`]: cur_post,
          })
          num_loaded+=1;
          if(num_loaded==next_loaded){
            wx.hideLoading();
            wx.showToast({
              title: '加载完成',
              icon: 'success',
              duration: 1000,
            });
          }
        },
        fail(res) {
          console.log("请求getHolebyId云函数失败", res)
        },
      })
    }

    
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
    user_posts = app.globalData.userData.posts;
    this.setData({num_posts: user_posts.length});
    this.loadBatch();
    

    // let len = user_posts.length;
    // for(let i=0; i<len; i++){
    //   wx.cloud.callFunction({
    //     name: "getHolebyId",
    //     data: {
    //       holeId: user_posts[i]
    //     },
    //     success(res){
    //       console.log("请求getHolebyId云函数成功", res)

    //       let cur_post = {
    //         _id: res.result.data._id,
    //         type: res.result.data.type,
    //         title: res.result.data.title,
    //         content: res.result.data.content,
    //         hot: res.result.data.hot,
    //         num_likes: res.result.data.num_likes,
    //         num_replies: res.result.data.num_reply,
    //         createTime: res.result.data.createTime.substring(5, 10),
    //         avatarURL: res.result.data.userImage,
    //         userName: res.result.data.userName,
    //         anonymous: res.result.data.isAnonymous,
    //       }
    //       // 每个请求成功时, 都直接对this.data.posts的对应下标使用setData
    //       // 可以防止因为网络波动导致的乱序~
    //       _this.setData({
    //         [`posts[${i}]`]:cur_post,
    //       })
          
    //     },
    //     fail(res){
    //       console.log("请求getHolebyId云函数失败", res)
    //     },
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.generatePseudoTests();
    num_loaded=next_loaded=0;
    this.setData({ user_id: app.globalData.userData._id})
    this.getPostsFromUser();
    
  },

  onReachBottom: function(){
    // lady loading 测试版...!
    this.loadBatch();
  }

})