// pages/about_applet/about_applet.js
var app = getApp();
Page({
  data:{
    telephone: '021-31128716'
  },
  onShow: function () {
    app.getColor();
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    var num = app.globalData.version_number;
    that.setData({
      version_number: num,
    });

  },
  callTel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.telephone
    })
  },
  useHelp: function () {
    wx.navigateTo({
      url: '../help_detail/help_detail?action=detail&id=xiaochengxuhelp'
    });
  },
  shenMing:function(){
    wx.navigateTo({
      url: '../help_detail/help_detail?action=detail&id=yinsishengming'
    });
  },
  onReady:function(){
    // 页面渲染完成
  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})