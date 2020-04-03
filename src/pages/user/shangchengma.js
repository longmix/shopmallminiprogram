var app = getApp();
var userInfo = app.get_user_info();
// pages/user/shoucang.js
Page({
  data: {
    page: 1,
    favoriteList: [],
  },
  onLoad: function (options) {
    app.set_option_list_str(null, app.getColor());
    
    this.loadProductData();
  },
  onShow: function () {
    // 页面显示
    this.loadProductData();

  },
  loadProductData:function(){
     
  },
  formSubmit: function (e) {
  var shangchengma = e.detail.value.name;
  console.log(e);
  if (shangchengma==null){
         return;
  }
  wx.request({
    url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_sellerid_by_shangchengma',
    data: {
      shangchengma: shangchengma,
    },
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {// 设置请求的 header
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      // success
      var code = res.data.code;
      if (code == 1) {
        wx.showToast({
          title: '获取成功',
          duration: 2000
        });
        app.globalData.sellerid = res.data.sellerid
        app.set_sellerid(res.data.sellerid);
        wx.switchTab({
          url: '../index/index'
        });
      } else if(code==0){
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        });
      }
    },
    fail: function () {
      // fail
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  });
  }
})