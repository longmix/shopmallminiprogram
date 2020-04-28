var app = getApp();
var userInfo = app.get_user_info();
var util = require('../../utils/util.js');
Page({
  data: {
    date:'2016-09-01',
    zz_pay:true,
    payView:true,
    pageBackgroundColor:''
  },
  onShow: function () {
    
  },
  onLoad: function (options) {
    console.log('options', options)

    app.set_option_list_str(null, app.getColor());

    var date = util.formatTime(new Date());
    var time = util.formatTime2(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      date: date,
      time: time
    });
    showView: (options.showView == "true" ? true : false)
    this.setData({
      orderId: options.orderId,
      traffic_price: options.traffic_price ? options.traffic_price : 0,
    });

    if (options.balance_zengsong_dikou){
      this.setData({
        balance_zengsong_dikou: options.balance_zengsong_dikou,
      })
    } else {
      this.setData({
        balance_zengsong_dikou: util.sprintf("%6.2f", 0),
      })
    }

    if (options.balance_dikou) {
      this.setData({
        balance_dikou: options.balance_dikou,
      })
    }else{
      this.setData({
        balance_dikou: util.sprintf("%6.2f", 0),
      })
    }

    if (options.recharge){
      this.setData({
        recharge: options.recharge,
      })
    }

    var huikuan_info = wx.getStorageSync('huikuan_info');
    if (huikuan_info){
      this.setData({
        adds: huikuan_info
      })
    }

    this.loadOrderDetail();
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=payment_type_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        appid: app.globalData.xiaochengxu_appid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var code = res.data.code;
        if (code == 1) {
          var type_list = res.data.data;


          var show_weixin_pay = 0;
          var show_zhuanzhang_pay = 0;
          for(var i=0; i<type_list.length; i++){
            if (type_list[i].payment_type == 3){
              show_weixin_pay = 1;
            }

            if (type_list[i].payment_type == 6) {
              show_zhuanzhang_pay = 1;
            }
          }
 
          that.setData({
            type_list: type_list,
            show_weixin_pay: show_weixin_pay,
            show_zhuanzhang_pay: show_zhuanzhang_pay
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
        

          var pay_price = parseFloat(orderData.order_total_price);
          

          if(that.data.balance_zengsong_dikou < pay_price){
            pay_price = pay_price - that.data.balance_zengsong_dikou;
          }else{
            pay_price = 0
          }

          
          if (that.data.balance_dikou < pay_price) {
            pay_price = pay_price - that.data.balance_dikou;
          } else {
            pay_price = 0
          }

          
          that.setData({
            orderData: orderData,
            pay_price: util.sprintf("%6.2f", pay_price),
          });

          if (pay_price == 0.00){
            that.setData({
              zz_pay:false
            })
          }

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
    that.data.date = e.detail.value;
    console.log(e);
    that.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
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
    
    wx.setStorageSync('huikuan_info', adds)
    that.setData({
      adds:adds
    })

  },
  dateInput:function(){
    var that = this;
    var time = e.detail.value;
    console.log(e);
    that.setData({
      date: date
    })
  },
  timeInput: function () {
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

    var data_params = {
      orderid: that.data.orderId,
      payment_type: 6,
      userid: userInfo.userid,
      checkstr: userInfo.checkstr,
      sellerid: app.get_sellerid(),
      money: that.data.pay_price,
      yue_amount: that.data.balance_dikou,
      zengkuan_amount: that.data.balance_zengsong_dikou,
      // offlinepayid: that.data.payList.offlinepayid,
      time: that.data.date + ' ' + that.data.time,
      // huikuan_pingtai: that.data.adds.huikuan_pingtai,
      // name: that.data.adds.name,
      body: "商城支付订单",
      subject: "商城支付订单",
    }


    if(that.data.pay_price != 0.00){
      data_params.offlinepayid = that.data.payList.offlinepayid;
        data_params.huikuan_pingtai = that.data.adds.huikuan_pingtai;
     data_params.name = that.data.adds.name;
    }

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_buy',
      data: data_params,
      method: 'POST', 
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.code == 1) {

          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.showLoading({
                  title: '正在跳转...',
                })
                setTimeout(function () {
                  wx.hideLoading()
                  if (that.data.recharge == 1) {
                    wx.switchTab({
                      url: '/pages/user/user',
                    });
                  } else {
                    wx.navigateTo({
                      url: '../user/dingdan?currentTab=0&otype=',
                    });
                  }
                }, 1500);
              } 
            }
          })
        

              
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
  wxpay: function (e) {
    console.log('eeee',e)
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
          if (res.data.str == 'yue') {
            wx.showToast({
              title: "支付成功!",
              duration: 2000,
            });

            setTimeout(function () {
              if(that.data.recharge == 1){
                wx.switchTab({
                  url: '/pages/user/user',
                });
              }else{
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=0&otype=',
                });
              }
              
            }, 500);
            return;
          }
         

          if (res.data.wxpay_params && res.data.wxpay_params.errcode == 1) {
            // wx.showToast({
            //   title: "网络错误!",
            //   duration: 2000,
            //   icon: 'none',
            // });

            wx.showModal({
              title: '提示',
              content: '启动微信钱包失败！',
            })


            return;
          }

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
                if (that.data.recharge == 1) {
                  wx.switchTab({
                    url: '/pages/user/user',
                  });
                } else {
                  wx.navigateTo({
                    url: '../user/dingdan?currentTab=0&otype=',
                  });
                }
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

  // dikouzhifu: function(e) {
  //   console.log('88888',this)
  //   var that = this;
  //   var userInfo = app.get_user_info();
  //   wx.request({
  //     url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_buy',
  //     data: {
  //       orderid: that.data.orderId,
  //       payment_type: 6,
  //       userid: userInfo.userid,
  //       checkstr: userInfo.checkstr,
  //       sellerid: app.get_sellerid(),
  //       money: 0,
  //       yue_amount: that.data.balance_dikou,
  //       zengkuan_amount: that.data.balance_zengsong_dikou,
  //       offlinepayid: that.data.payList.offlinepayid,
  //       time: that.data.date + ' ' + that.data.time,
  //       huikuan_pingtai: that.data.adds.huikuan_pingtai,
  //       name: that.data.adds.name,
  //       body: "商城支付订单",
  //       subject: "商城支付订单",
  //     },
  //     method: 'POST',
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }, // 设置请求的 header
  //     success: function (res) {
  //       if (res.data.code == 1) {
  //         wx.showToast({
  //           title: res.data.msg,
  //           duration: 2000,
  //         });

  //         setTimeout(function () {
  //           wx.navigateTo({
  //             url: '../user/dingdan?currentTab=0&otype=',

  //           });
  //         }, 2500);
  //       } else {
  //         wx.showToast({
  //           title: "支付失败",
  //           duration: 2000
  //         });
  //       }
  //     },
  //     fail: function () {
  //       // fail
  //       wx.showToast({
  //         title: '网络异常！',
  //         duration: 2000
  //       });
  //     }
  //   })


  // },

})