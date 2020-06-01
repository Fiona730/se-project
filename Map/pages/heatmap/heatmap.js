var app = getApp()
var context = "";
var grd = "";
var max = 1;
var min = 0;
var str1;var str2;var str3;var str4;var str5;var str6;
var heatMapData = [
];
var imageData;
var getRed = (alpha => {
  if (alpha > 128) return 255;
  else if (alpha > 64) return 4 * (alpha - 64);
  else return 0;
})
var getGreen = (alpha => {
  if (alpha > 128) return 2 * (255 - alpha);
  else if (alpha > 31) return 255;
  else if (alpha > 0) return 8 * alpha;
  else return 0;
})
var getBlue = (alpha => {
  if (alpha > 64) return 0;
  else if (alpha > 32) return 8 * (64 - alpha);
  else if (alpha > 0) return 255;
  else return 0;
})
var drawHeatMap = function() {
  context = wx.createCanvasContext('myCanvas');//创建Canvas
  //context.clearRect(0,0,320,504);
  heatMapData.forEach(point => {
    //console.log("point", point);
    let { x, y, value } = point;
    grd = context.createCircularGradient(x, y, 50);
    context.beginPath();
    context.arc(x, y, 50, 0, 2 * Math.PI, false);
    context.closePath();
    grd.addColorStop(0.0, 'rgba(0,0,0,1)');
    grd.addColorStop(1.0, 'rgba(0,0,0,0)');
    context.setFillStyle(grd);

    let globalAlpha = (value - min) / (max - min);
    context.globalAlpha = Math.max(Math.min(globalAlpha, 1), 0);
    context.fill();
  })
  context.draw();
  wx.canvasGetImageData({
    canvasId: 'myCanvas',
    x: 0,
    y: 0,
    width: 320,
    height: 500,
    success(res) {
      //console.log(res);
      var data = res.data;
      for (var i = 3; i < data.length; i = i + 4) {
        var tmp = data[i];
        data[i - 3] = getRed(tmp);
        data[i - 2] = getGreen(tmp);
        data[i - 1] = getBlue(tmp);
        if (tmp > 0) data[i] = 255;

      }
      wx.canvasPutImageData({
        canvasId: 'myCanvas',
        data: data,
        x: 0,
        y: 0,
        width: 320,
        height: 500
      })
    }
  })
  context.draw();
}



Page({
  data: {
    "longitude": "",
    "latitude": "",
    "location": true,
    "scale": 14,
    hasUserInfo: false,
    UserInfo: {},
    //帖子集合
    haslist: false,
    list: [],
    markers: [],
    //符合搜索条件帖子
    hassearch: false,
    searchlist: [],
    //tab菜单
    tablist: [
      { id: 0, add: true, value: "集合" },
      { id: 1, add: true, value: "求助" },
      { id: 2, add: true, value: "帖子" },
      { id: 3, add: true, value: "投票" }],
    tabname: { "集合": 0, "求助": 1, "帖子": 2, "投票": 3 },
    tabnum: 0,
    hasinput: false,
    inputInfo: '请输入关键字',
    isPopping: false,
    animadd: {},
    animloc: {},
    animmail: {},
    animhlp: {},
  },
  //显示符合类型的Holes
  getmess: function () {
    var that = this;
    var color = ''
    const mks = that.data.list.map((value, index) => {
      //console.log("mkrs", value)
      if (that.data.tablist[that.data.tabname[value.type]].add) {
        color = '#77b6e962'
        if (value.type == '求助') {
          if (value.content.help == false) {
            color = '#e9777762'
          }
          else {
            color = '#8ee97762'
          }
        }
        return {
          iconPath: '/resources/' + that.data.tabname[value.type] + '.png',
          id: value._id,
          type: value.type,
          latitude: value.position.coordinates[1] + (Math.random() - 0.5) * 0.0006,
          longitude: value.position.coordinates[0] + (Math.random() - 0.5) * 0.0006,
          width: 35,
          height: 35,
          clickable: true,
          callout: {
            content: value.title.slice(0, 5),
            color: '#444141',
            borderRadius: 3,
            borderWidth: 1,
            borderColor: '#77b6e962',
            bgColor: color,
            padding: 5,
            textAlign: 'center',
            display: 'ALWAYS'
          }
        }
      }
    })
    that.setData({
      markers: mks
    })
    //console.log("markaers", this.data.markers)
  },
  getHeatMap: function() {
    var that = this;
    const mks = that.data.list.map((value, index) => {
      
      if (that.data.tablist[that.data.tabname[value.type]].add) {
        var latitude = value.position.coordinates[1] + (Math.random() - 0.5) * 0.0006;
        var longitude = value.position.coordinates[0] + (Math.random() - 0.5) * 0.0006;
        return {
          x: (320*(longitude-this.data.longitude)/(str3-str1))+160,
          y: 252-(504*(latitude-this.data.latitude)/(str4-str2)),
          value: value.hot
        }
      }
    });
    //console.log("HeatMap", mks);
    mks.forEach(point => {
      if (point.value > max) {
        max = point.value;
      }
      heatMapData.push(point);
    })
    console.log("HeatMap", heatMapData);
  },
  //获取地理位置并显示Holes
  getLocation: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        })
        //后端交互获取帖子信息
        wx.cloud.callFunction({
          name: 'getHoles',
          data: {},
          success: res => {
            that.setData({
              haslist: true,
              list: res.result.data
            })
            console.log('[云函数] [getHoles] Holes: ', that.data.list)
            //显示帖子
            that.getmess();
            that.getHeatMap();
          },
          fail: err => {
            console.error('[云函数] [getHoles] 调用失败', err)
          }
        })
      }
    })
  },

  onLoad: function (options) {
    str1 = parseFloat(options.str1);
    str2 = parseFloat(options.str2);
    str3 = parseFloat(options.str3);
    str4 = parseFloat(options.str4);
    str5 = parseFloat(options.str5);
    str6 = parseFloat(options.str6);
    var sca = 3;
    var delta = str3-str1;
    console.log("FUCK", str1);
    console.log("FUCK", str3);
    console.log("FUCK", str5);
    console.log("DELTA", delta);
    while (delta < 50.0) {
      delta *= 2;
      sca++;
    }
    this.setData({
      scale: sca
    })
    //this.mapCtx.moveToLocation();
  },

  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {

    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map');
    
    
  },

  onShow: function () {

    if (app.globalData.userInfo) {
      console.log("用户信息存在")
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    else {
      this.setData({ hasUserInfo: false })
      // 强制跳转到登录界面？
      // wx.navigateTo({url: '/pages/login/login',})
    }
    var that = this;
    that.setData({
      location: true,
      userInfo: app.globalData.userInfo,
    })
    that.getLocation();
    
    setTimeout(function() {
      drawHeatMap();
    },2000);
    heatMapData = [];
    console.log("HSHS", that.data.longitude);
    console.log("HSHS", that.data.latitude);
    console.log("HSHS", that.data.scale);
  }
  
  
})