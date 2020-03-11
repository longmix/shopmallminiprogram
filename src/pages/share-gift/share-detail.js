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
  onLoad: function (o) {
    console.log('options',o);
    var that = this
    var url_current_parentid = o.parentid //= 106,
      //sellerid = o.sellerid //= 'pmyxQxkkU'

    if (o && o.parentid) {
      app.set_current_parentid(o.parentid);
    }


    if (!userInfo){
      userInfo = app.get_user_info();
    }

    that.setData({
      url_current_parentid: url_current_parentid,
    })
    
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

    app.getColor();

      wx.request({
        url: app.globalData.http_server + 'openapi/ShareGiftData/get_share_gift_user_info',
        data: {
          userid: url_current_parentid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          console.log('ddd', res);
         
            var data = res.data
            var data2 = data.data
            var headimgurl = data.data.headimgurl
            var nickname = data.data.nickname
            console.log(headimgurl);
            that.setData({
              headimgurl: headimgurl,
              nickname: nickname,
            });
          

        }
      })
 




    //var url = 'http://192.168.0.205/yanyubao_server/index.php/openapi/ShareGiftData/get_share_gift_set'
    var url = app.globalData.http_server + 'index.php/openapi/ShareGiftData/get_share_gift_set';
      //app.globalData.http_server + '',
      wx.request({
        url: url,
        method: 'post',
        data: {
          key: 'share_gift_detail_set',
          sellerid: app.get_sellerid()
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('share_gift_detail_set', res);
          var data = res.data;
          if (data.code == 1) {
            var share_gift_option = data.share_gift_option;
            that.setData({
              describe: share_gift_option.describe,
              share_gift_detail_bg_color: share_gift_option.share_gift_detail_bg_color ? share_gift_option.share_gift_detail_bg_color : '#ffffff',
              share_gift_detail_btn_bg_color: share_gift_option.share_gift_detail_btn_bg_color ? share_gift_option.share_gift_detail_btn_bg_color : '#ff0000',
              share_gift_detail_btn_font: share_gift_option.share_gift_detail_btn_font ? share_gift_option.share_gift_detail_btn_font : '立即参与',
              share_gift_detail_btn_font_color: share_gift_option.share_gift_detail_btn_font_color ? share_gift_option.share_gift_detail_btn_font_color : '#ffffff',
              share_gift_detail_title: share_gift_option.share_gift_detail_title ? share_gift_option.share_gift_detail_title : '活动页标题',
              share_gift_detail_img: share_gift_option.share_gift_detail_img
            })
          }
          wx.setNavigationBarTitle({
            title: share_gift_option.share_gift_detail_title
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
    if (!userInfo) {
      userInfo = app.get_user_info();
    }
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
    

  },

  getInActivity:function(){
    var that = this;
    console.log('aaaa',that.data.aaaa)
    
    if(!userInfo){
      wx.navigateTo({
        url: '../login/login?fromPage=share-detail',
      })
    }else{
      wx.request({
        url: app.globalData.http_server + 'openapi/ShareGiftData/share_gift_check_parentid',
        data: {
          url_parentid: that.data.url_current_parentid,
          userid:userInfo.userid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          wx.navigateTo({
            url: 'share-gift',
          })
        }
      })

    }

  },










})