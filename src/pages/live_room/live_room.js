var api = require('../../utils/api');

var app = getApp();
// pages/live_room/live_room.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    live_list: [],
    wxa_shop_nav_bg_color:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //如果指定了roomid，直接跳转到直播间
    if(options && options.roomid){
      roomId = options.roomid;


      console.log('ddddddd',roomId);

      let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
     
      wx.navigateTo({
          url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
      })

      return;
    }

    app.set_option_list_str(this, this.callback_func_setoption_list_str);
    
    this.getLiveList();
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

  callback_func_setoption_list_str:function(that, cb_params){
    console.log('cb_params==',cb_params)
    if(!cb_params){
      return;
    }
    app.getColor();
    this.setData({
      wxa_shop_nav_bg_color: cb_params.wxa_shop_nav_bg_color
    })
  },


  // 跳转直播间
  toLiveStudio: function(e){

    let index = e.currentTarget.dataset.index;

    let roomId = this.data.live_list[index].roomid;

    roomId = [roomId] // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取


    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）

    wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    })
  },

  getLiveList: function(){

    console.log('ssss')

    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/VideoLiveData/wxa_live_room_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        wxa_appid: app.globalData.xiaochengxu_appid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        let data = res.data

        console.log('wxa_live_room_list==', res)
        if(data.code == 1){
          let live_list = data.data;
          this.setData({
            live_list: live_list
          })
        }
        else{
          wx.showModal({
            title:'错误',
            content:data.msg,
            cancelColor: 'cancelColor',
          })
        }
        
     
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})