var app = getApp();
// pages/order/downline.js
var userInfo = app.get_user_info();
Page({
  data:{
    itemData:{},
    userId:0,
    paytype:'weixin',//0线下1微信
    remark:'',
    productid:[],
    addrId:0,//收货地址//测试--
    btnDisabled:false,
    productData:[],
    orderProduct:[],
    total:0,
    vprice:0,
    vid:0,
    addemt:1,
    vou:[],
    orderId:{},
    productid:[],
    amount:'',
    cartId:'321'
  },
  onShow: function () {
    app.getColor();
  },
  /**
   * 
   * action = direct_buy
   * 如果 action = direct_buy，需要参数
   *  productid = xxx
   *  amount = 2
   *  
   *  如果存在促销规则，则有参数 cuxiao_type，同时，带有对应的促销需要的其他参数
   * 
   * 否则带参数：
   *  xxx=aaaa
   * 
   * 
   */
  onLoad:function(options){
    console.log("sssss");
    console.log(options);
    console.log("sssss");
    
    this.setData({
      productid: options.productid,

      cuxiao_type: options.cuxiao_type,

      //如果cuxiao_type == duorenpintuan 
      jiantuanid:options.jiantuanid,
      price_type: options.price_type,

      //如果cuxiao_type == sharekanjia
      
      
      action: options.action,
      
      amount: options.amount
    });

    this.loadProductDetail();

  },
  loadProductDetail:function(){
    var that = this;
    var userInfo = app.get_user_info();
    if (that.data.action == "direct_buy") {
      console.log(1111111);
      console.log(1111111);
      console.log(that.data.productid + 'bbbbbbb');
      var data_params = {
        productid: that.data.productid,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        action: 'direct_buy',
        amount: that.data.amount,
        cuxiao_type: that.data.cuxiao_type,                                            
        sellerid: app.get_sellerid()
      };

      if (that.data.cuxiao_type == 'duorenpintuan'){
        data_params.jiantuanid = that.data.jiantuanid;
        data_params.price_type = that.data.price_type;
      }
      else if (that.data.cuxiao_type == 'sharekanjia') {
      }
      else if (that.data.cuxiao_type == 'aaaaaaaa') {
      }

      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_queren',
        method: 'post',
        data: data_params,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideLoading();
          var code = res.data.code;
          if (code == 1) {
            var order_detail = res.data.address;
            console.log(order_detail);
            that.setData({
              order_detail: order_detail,
              productData: res.data.orderlist,
              all_price: res.data.all_price,
              traffic_price: res.data.traffic_price,
              pay_price: res.data.pay_price,
              addemt: 0
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
    }else{
      console.log(22222222);
      console.log(22222222);
      console.log(that.data.productid+'ssssssss');
          wx.request({
            url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_queren',
            method: 'post',
            data: {
             // productid: that.data.productId,
              productid: that.data.productid,
              userid: userInfo.userid,
              checkstr: userInfo.checkstr,
              sellerid: app.get_sellerid()
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

              var code = res.data.code;
              console.log(res.data);
              if (code == 1) {
                  var order_detail=res.data.address;
                  console.log(order_detail);
                  console.log(res);
                  that.setData({
                    order_detail: order_detail,
                    productData:res.data.orderlist,
                    all_price: res.data.all_price,
                    traffic_price: res.data.traffic_price,
                    pay_price: res.data.pay_price,
                    addemt: 0
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

  

  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

 //选择优惠券
  getvou:function(e){
    var vid = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.vprice;
    var cprice = parseFloat(zprice) - parseFloat(price);
    this.setData({
      total: cprice,
      vid: vid
    })
  }, 

//微信支付
  createProductOrderByWX:function(e){
    this.setData({
      paytype: 'weixin',
    });
    this.createProductOrder();
  },

  //线下支付
  createProductOrderByXX:function(e){
    this.setData({
      paytype: 'cash',
    });
    wx.showToast({
      title: "线下支付开通中，敬请期待!",
      duration: 3000
    });
    return false;
    this.createProductOrder();
  },

  //确认订单
  /*
  createProductOrder:function(){
  //  this.setData({
  //    btnDisabled:false,
  //  })
    //创建订单 
    var that = this;
    var userInfo = app.get_user_info();
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_add',
      method:'post',
      data: {
        buyer_memo: that.data.remark,
        all_price: that.data.all_price,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        traffic_price: that.data.traffic_price,
        sellerid: app.get_sellerid(),
        payment:3
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if(data.code == 1){
          //创建订单成功
          that.setData({
            paytype: 'weixin',
            orderid:res.data.orderid,
            orderno: res.data.orderno,
          });
          that.wxpay(data);
        }else{
          wx.showToast({
            title:"下单失败!",
            duration:2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
*/


  createOrder:function(){
    var that = this;
    var userInfo = app.get_user_info();
    console.log(that.data.pay_price);
    console.log(that.data.all_price);
    var data_orderAdd = {

      buyer_memo: that.data.remark,
      all_price: that.data.all_price,
      userid: userInfo.userid,
      checkstr: userInfo.checkstr,
      traffic_price: that.data.traffic_price,
      pay_price: that.data.pay_price,
      sellerid: app.get_sellerid(),
      payment: 3
    };

    if (that.data.cuxiao_type == 'duorenpintuan') {
      data_orderAdd.cuxiao_type = 'duorenpintuan';
      data_orderAdd.jiantuanid = that.data.jiantuanid;
      data_orderAdd.price_type = that.data.price_type;
      data_orderAdd.price2 = that.data.all_price;
      }
    else if (that.data.cuxiao_type == 'sharekanjia') {

    }
    else if (that.data.cuxiao_type == 'aaaaaaaa') {
    }
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_add',
      method: 'post',
      data: data_orderAdd,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if (data.code == 1) {
          //创建订单成功
          that.setData({
            paytype: 'weixin',
            orderid: res.data.orderid,
            orderno: res.data.orderno,
          });

          if (that.data.cuxiao_type == 'sharekanjia'){
            //var share_kanjia_page = 'https://yanyubao.tseo.cn/'
            var share_kanjia_page = app.globalData.http_server + '?g=Home&m=ShareKanjia&a=share_detail&productid=' + that.data.productid + '&userid=' + userInfo.userid;

            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(share_kanjia_page),
            });
          }
          else{

            wx.navigateTo({
              url: '../order/zhifu?orderId=' + that.data.orderid,
            })
          }
          




        } else {
          wx.showToast({
            title: "下单失败!",
            duration: 2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
  //调起微信支付
  wxpay: function(order){
    var userInfo = app.get_user_info();
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_buy',
        data: {
         // productid: that.data.productid,
          orderid: order.orderid,
          payment_type:3,
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
          'Content-Type':  'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          if(res.data.code==1){
            var payment_parameter_str = res.data.wxpay_params;

            var payment_parameter = JSON.parse(payment_parameter_str);
            
            console.log(payment_parameter);

            wx.requestPayment({
              appId: payment_parameter.appId,
              timeStamp: payment_parameter.timeStamp,
              nonceStr: payment_parameter.nonceStr,
              package: payment_parameter.package,
              signType: payment_parameter.signType,
              paySign: payment_parameter.paySign,
              success: function(res){
                wx.showToast({
                  title:"支付成功!",
                  duration:2000,
                });

                setTimeout(function(){
                  wx.navigateTo({
                    url: '../user/dingdan?currentTab=1&otype=deliver',
                  });
                },2500);

              },
              fail: function(res) {
                wx.showToast({
                  title: '支付失败',
                  duration:3000
                })
              }
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            });
          }
        },
        fail: function() {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      })
  },

});