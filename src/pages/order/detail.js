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

  },
  onLoad:function(options){

    app.set_option_list_str(null, app.getColor());


    app.set_option_list_str(this, this.callback_set_option);
    
    this.setData({
      orderId: options.orderId,
      balance_zengsong_dikou: options.balance_zengsong_dikou,
      balance_dikou: options.balance_dikou,
    })
    this.loadProductDetail();
  },


  callback_set_option:function(that, cb_params){
    console.log('getShopOptionAndRefresh+++++:::' + cb_params)

    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");
    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    if (!option_list) {
      return;
    }


    if (option_list.wxa_shop_nav_bg_color) {
      that.setData({
        wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color
      });
    }

    if (option_list.wxa_shop_nav_font_color) {
      that.setData({
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color
      });
    }

    this.setData({
      wxa_order_hide_sanji_address: option_list.wxa_order_hide_sanji_address
    })


  },

  loadProductDetail:function(){
    var app = getApp();
    // pages/order/detail.js
    var userInfo = app.get_user_info();
    var that = this;
    console.log('userid', userInfo.userid);
    console.log('userstr', userInfo.checkstr);
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