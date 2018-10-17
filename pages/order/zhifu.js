var app = getApp();
var userInfo = app.get_user_info();
var util = require('../../utils/util.js');
Page({
  data: {
    time:'2016-09-01',
    zz_pay:true,
    payView:true,
    pageBackgroundColor:''
  },
  onShow: function () {
    app.getColor();
  },
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time: time
    });
    showView: (options.showView == "true" ? true : false)
    this.setData({
      orderId: options.orderId
    });
    this.loadOrderDetail();
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=payment_type_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var code = res.data.code;
        if (code == 1) {
          var type_list = res.data.data;
          console.log(type_list);
          that.setData({
            type_list: type_list,
          });
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
  radioChange: function (e) {
    var that = this;
    var pay = e.detail.value;
    if (pay=='zz_pay'){
      that.setData({
        zz_pay:false,
      })
    }else{
      that.setData({
        zz_pay:true,
        payView: true
      })
    }
    var userInfo = app.get_user_info();
    var pay_list = that.data.pay_list
    if (typeof (pay_list) == 'undefined'){
    wx.request({
    url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=offlinepay_get',
    method: 'post',
    data: {
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
        var pay_list = res.data.data;
        console.log(pay_list);
        that.setData({
          pay_list: pay_list,
        });
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
    }   
  },
  loadOrderDetail: function () {
    var that = this;
    var userInfo = app.get_user_info();
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
          console.log(orderData);
          that.setData({
            orderData: orderData,
          });
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
  //微信支付
  createProductOrderByWX: function (e) {
    this.setData({
      paytype: 'weixin',
    });
    this.wxpay();
  },
  bindDateChange: function (e) {
    var that = this;
    that.data.time = e.detail.value;
    console.log(e);
    that.setData({
      time: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    var adds = e.detail.value;
    console.log(e);
    that.setData({
      adds:adds
    })
  },
  dateInput:function(){
    var that = this;
    var time = e.detail.value;
    console.log(e);
    that.setData({
      time: time
    })
  },
  zhuangzhangPay: function (e) {
    var that = this;
    var key = e.target.dataset.index;
    console.log(key);
    if(key==null){
      return;
    };
    var pay_list = that.data.pay_list;
    that.setData({
      payList: pay_list[key],
      payView:false,
      key: e.target.dataset.index
    });
  },
  //线下支付
  createProductOrderByZZ: function (e) {
    this.setData({
      paytype: 'zhuanzhang',
    });
    this.zzpay();
  },
  zzpay:function(){
    var that = this;
    var userInfo = app.get_user_info();
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_buy',
      data: {
        orderid: that.data.orderId,
        payment_type: 6,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
        money: that.data.orderData.price,
        yue_amount: true,
        zengkuan_amount: 0.00,
        offlinepayid: that.data.payList.offlinepayid,
        time:that.data.time,
        huikuan_pingtai: that.data.adds.huikuan_pingtai,
        name: that.data.adds.name,
        body: "商城支付订单",
        subject: "商城支付订单",
      },
      method: 'POST', 
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.code == 1) {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
              });

              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=2',
                });
              }, 2500);
        } else {
          wx.showToast({
            title: "支付失败",
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
    })
  },
  wxpay: function () {
    var that=this;
    var userInfo = app.get_user_info();
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_buy',
      data: {
        // productid: that.data.productid,
        orderid: that.data.orderId,
        payment_type: 3,
        trade_type: 'JSAPI_WXA',
        appid: app.globalData.xiaochengxu_appid,
        openid: userInfo.user_openid,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        //sub_appid :'wx00d1e2843c3b3f77'
        client: 'wxa',
        sellerid: app.get_sellerid()
        /*
        appid:
        mch_id:
        nonce_str:
        noncestr:
        partnerid:
        prepay_id:
        sign:
        sub_mch_id:
        */
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        console.log('order_buy order_buy order_buy', res);

        if (res.data.code == 1) {
          var payment_parameter_str = res.data.wxpay_params.parameters;

          var payment_parameter = JSON.parse(payment_parameter_str);
          
          wx.requestPayment({
            appId: payment_parameter.appId,
            timeStamp: payment_parameter.timeStamp,
            nonceStr: payment_parameter.nonceStr,
            package: payment_parameter.package,
            signType: payment_parameter.signType,
            paySign: payment_parameter.paySign,

            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });

              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 2500);

            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
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
    })
  },


})