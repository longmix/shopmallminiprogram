// pages/help_detail/help_detail.js
var app = getApp();
//var mars = require('../../mars/modules/mars')
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
      headlineItem_img:'',
      content:'',
      title:'',
      id:0,
      listid:0,
      sellerid:'',//如何获取listid和sellerid？？？
      mode:'widthFix'

  },
  onShow: function () {
    app.getColor();
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    console.log(options);
    console.log("商户头条id:"+options.id);
    console.log("sellerid:" + options.sellerid);
    
    var that = this

    that.data.id = options.id;
    that.data.sellerid = options.sellerid;
    if (typeof (that.data.sellerid) == 'undefined') {
      that.data.sellerid = app.globalData.sellerid;
    }

     //=====更新商户头条=================
      var url = app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=yingxiao';//+ app.globalData.sellerid;
      var data = {
        id:options.id,
        action:'detail'
      };
      var cbSuccess = function (res) {
        if (res.data.code == 1) {
          //更新首页的商户头条
          //console.log('成功返回商户头条信息:' + res);
          //console.log(mars.html2json(res.data.data.info));
          that.setData({
              headlineItem_img:res.data.data.pic,
              content:res.data.data.info,
              title:res.data.data.title,
          });

          WxParse.wxParse('content', 'html', res.data.data.info, that, 15);
        }
      };
      var cbError = function (res) {

      };
      app.httpPost(url, data, cbSuccess, cbError);
      //========End====================

    //this.initArticle(options.aid)
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: ''+that.data.title,
      path: 'pages/help_detail/help_detail?id='+that.data.id,
      success: function(res) {
        // 分享成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        // 分享失败
        wx.showToast({
          title: '转发失败',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  show_share_btn: function () {
    console.log('aaaaa');
    //显示分享页面
    wx.showShareMenu({
      withShareTicket: true,
      success:function(){
        console.log('bbbbbb');
      }
    })
  },
  returnto_toutiao:function(){
    var that = this;
    wx.redirectTo({
      url: '../help/help?sellerid=' + that.data.sellerid

    })
  },
  returnto_index: function () {
    var that = this;
    wx.switchTab({
      url: '../index/index?sellerid=' + that.data.sellerid

    })
  },

})