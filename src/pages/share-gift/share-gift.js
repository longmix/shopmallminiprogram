// pages/share-gift/share-gift.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var userInfo = app.get_user_info();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //从本地读取
<<<<<<< HEAD

    app.set_option_list_str(null, app.getColor());
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    


    if(!userInfo){
      userInfo = app.get_user_info();
    }

    if ((!userInfo) || (!userInfo.userid)) {
      wx.redirectTo({
        url: '../login/login',
      })
      return;
    }
    console.log('userInfo', userInfo);


    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '333333333');

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    if (!option_list) {
      return;
    }
    
<<<<<<< HEAD

=======
    app.getColor();
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

  that.setData({
    wxacode_url: 'https://yanyubao.tseo.cn/index.php/openapi/ShareGiftData/get_share_gift_wxa_img/appid/' + app.globalData.xiaochengxu_appid +'/userid/'+ userInfo.userid,
  })
    
    console.log('wxacode_url', that.data.wxacode_url)

   

    var url = 'http://192.168.0.205/yanyubao_server/index.php/openapi/ShareGiftData/get_share_gift_set'
    url = app.globalData.http_server + 'index.php/openapi/ShareGiftData/get_share_gift_set',
    //app.globalData.http_server + '',
    wx.request({
      url: url,
      method: 'post',
      data: {
        key: 'share_gift_activity_set',
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       console.log('get_share_gift_set',res);
       var data = res.data;
       if(data.code == 1){
         var share_gift_option = data.share_gift_option;
         that.setData({
           describe: share_gift_option.describe,
           share_gift_activity_bg_color: share_gift_option.share_gift_activity_bg_color ? share_gift_option.share_gift_activity_bg_color : '#ffffff',
           share_gift_activity_btn_bg_color: share_gift_option.share_gift_activity_btn_bg_color ? share_gift_option.share_gift_activity_btn_bg_color : '#ff0000',
           share_gift_activity_btn_font: share_gift_option.share_gift_activity_btn_font ? share_gift_option.share_gift_activity_btn_font : '分享有礼',
           share_gift_activity_btn_font_color: share_gift_option.share_gift_activity_btn_font_color ? share_gift_option.share_gift_activity_btn_font_color : '#ffffff',
           share_gift_activity_title: share_gift_option.share_gift_activity_title ? share_gift_option.share_gift_activity_title : '活动页标题',
           share_gift_activity_img: share_gift_option.share_gift_activity_img
         })
       }

        wx.setNavigationBarTitle({
          title: share_gift_option.share_gift_activity_title
        })
        WxParse.wxParse('content', 'html', share_gift_option.describe, that, 15);

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });

    wx.getSystemInfo({
      
      success(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    });
    
   

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('userInfo===',userInfo);
    var that = this
    var parentid = userInfo.userid;
    var url = '/pages/share-gift/share-detail?';
      return {
        title: '' + app.globalData.shop_name,
        path: url + 'sellerid=' + app.globalData.sellerid + '&parentid=' + parentid, 
        success: function (res) {
          // 分享成功
          console.log('分享成功',res)
        },
        fail: function (res) {
          // 分享失败
          console.log('分享失败', res)
        }
      }
    
  },











})  