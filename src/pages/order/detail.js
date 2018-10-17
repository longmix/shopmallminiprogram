var app = getApp();
// pages/order/detail.js
var userInfo = app.get_user_info();
Page({
  data:{
    orderId:0,
    orderData:{},
    proData:[],
  },
  onShow: function () {
    app.getColor();
  },
  onLoad:function(options){
    this.setData({
      orderId: options.orderId,
    })
    this.loadProductDetail();
  },
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_xiangqing',
      method: 'post',
      data: {
        orderid: that.data.orderId,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var code = res.data.code;
        if (code == 1) {
          var orderData = res.data.orderinfo;
          that.setData({
            orderData: orderData,
            orderList: orderData.orderProduct
          });
          console.log(that.data.orderList);
        } else {
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
  },

})