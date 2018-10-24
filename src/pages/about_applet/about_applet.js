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

    that.setData({
      shop_name: app.globalData.shop_name,
      version_number: app.globalData.version_number,
      kefu_telephone: app.globalData.kefu_telephone,
      kefu_qq: app.globalData.kefu_qq,
      kefu_website: app.globalData.kefu_website,
      kefu_gongzhonghao: app.globalData.kefu_gongzhonghao
    });

    console.log("444444", that.data.shop_name)

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