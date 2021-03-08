var app = getApp();
// pages/order/downline.js

var util = require('../../utils/util.js');
var api = require('../../utils/api');

Page({
  data:{
    itemData:{},
    userId:0,
    paytype:'weixin',//0线下1微信
    buyer_memo:'',
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
    amount:'',
    cartId:'321',
    balance_zengsong_dikou: 0,
    balance_dikou: 0,
    wxa_order_queren_hide_address:0
  },
  onShow: function () {
     //userInfo = app.get_user_info();
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
   * 如果指定购买的价格，带参数 all_price = 15.50
   * 
   * 否则带参数：
   *  xxx=aaaa
   * 
   * 
   */
  onLoad:function(options){

    console.log('order/pay 参数：', options);

    wx.showLoading({
      title: '加载中...',
    })
    

    if (options.productid) {
      wx.setStorageSync("cache_options", JSON.stringify(options));
    }
    else{
      if (wx.getStorageSync("cache_options")) {
        options = JSON.parse(wx.getStorageSync("cache_options"));
      }
    }

    

    var last_url = '';

    var arr = Object.keys(options);
    var options_len = arr.length;

    if (options_len > 0){
      var params_str = '';

      for(var key in options){
        params_str += key+'='+options[key]+'&';
      }
      params_str = params_str.substr(0, params_str.length - 1);

      last_url = '/pages/order/pay?'+params_str;
    }

    if (!last_url && options.productid) {
      last_url = '/pages/product/detail?productid=' + options.productid;
      this.setData({
        last_url: last_url
      })
    }

    

    if(last_url){
      this.setData({
        last_url: last_url
      })

      //检查用户登录
      if(app.goto_user_login(last_url)){
        return;
      }
    }

    //return;

    this.setData({
      productid: options.productid,
      //如果cuxiao_type == duorenpintuan 
      //如果cuxiao_type == sharekanjia      
      action: options.action,
      
      amount: options.amount
    });


    

    console.log('order/pay 参数002：', options);

    if (options.ucid) {
      this.setData({
        ucid: options.ucid
      })
    }


    if (options.cuxiao_type) {
      this.setData({
        cuxiao_type: options.cuxiao_type,
      });
    }
    if (options.price_type) {
      this.setData({
        price_type: options.price_type,
      });
    }
    if (options.jiantuanid) {
      this.setData({
        jiantuanid: options.jiantuanid,
      });
    }

    if (options.order_option_key_and_value_str) {
      this.setData({
        order_option_key_and_value_str: options.order_option_key_and_value_str
      })
    }


    if (options.all_price) {
      this.setData({
        o2o_all_price: options.all_price
      })
    }

    if (options.buyer_memo) {
      this.setData({
        buyer_memo: options.buyer_memo,
      })
    }






    // 

    //wxa_order_queren_hide_address   userList  

    var from_o2o = wx.getStorageSync('from_o2o');

    if(from_o2o==1){
      

      var address_info_str = wx.getStorageSync('address_info_str');
      if (address_info_str){
        var address_info = JSON.parse(address_info_str)
        this.setData({
          address_info: address_info
        })
      }

      


      var weekItem = wx.getStorageSync('weekItem');
          
      var shouHuoInfo = wx.getStorageSync('shouHuoInfo');
      this.setData({
        from_o2o: from_o2o,
        weekItem: weekItem,
        shouHuoInfo: shouHuoInfo
      })
    }


    if (options.paysuccess_url){
      wx.setStorageSync('paysuccess_url', decodeURIComponent(options.paysuccess_url));
      console.log('wx.getStorageSync paysuccess_url==>>>', wx.getStorageSync('paysuccess_url'));
    }



    app.set_option_list_str(this, this.loadProductDetail);

  },
  loadProductDetail:function(that, option_list){

    if (!option_list) {
      return;
    }

    app.getColor();

    if (!option_list.wxa_order_queren_hide_address) {
      option_list.wxa_order_queren_hide_address = 0;
    }

    this.setData({
      wxa_order_queren_hide_address: option_list.wxa_order_queren_hide_address,
    });


    that.setData({
      wxa_order_hide_coupon: option_list.wxa_order_hide_coupon,
      wxa_order_hide_balance_zengsong: option_list.wxa_order_hide_balance_zengsong,
      wxa_order_hide_balance: option_list.wxa_order_hide_balance,
    })


    var userInfo = app.get_user_info();

    console.log('pay==>>>loadProductDetail===>>>>', userInfo);

   

    if (that.data.action == "direct_buy") {

      var data_params = {
        productid: that.data.productid,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        action: 'direct_buy',
        amount: that.data.amount,
        //cuxiao_type: that.data.cuxiao_type,                                            
        sellerid: app.get_sellerid(),
      };

      if(that.data.buyer_memo){
        data_params.memo = that.data.buyer_memo;
      }

      if (that.data.cuxiao_type){
        data_params.cuxiao_type = that.data.cuxiao_type;
      }

      if (that.data.o2o_all_price){
        data_params.all_price = that.data.o2o_all_price;
      }

      if (that.data.ucid){
        data_params.ucid = that.data.ucid
      }

      if (that.data.cuxiao_type == 'duorenpintuan'){
        data_params.jiantuanid = that.data.jiantuanid;
        data_params.price_type = that.data.price_type;
      }
      else if (that.data.cuxiao_type == 'sharekanjia') {
      }
      else if (that.data.cuxiao_type == 'aaaaaaaa') {
      }

      

      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_queren',
        method: 'post',
        data: data_params,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {        
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          var code = res.data.code;
          if(code == 2) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000,
              
            });
          }
          else if (code == 1) {
           
            var order_address_detail = res.data.address;

            console.log(order_address_detail);

            if (!order_address_detail) {
              that.setData({
                addemt: 1
              });
            }
            else {
              that.setData({
                order_address_detail: order_address_detail,
                addemt: 0
              });
            }

            if(that.data.from_o2o==1){
              // 如果是来自o2o模块的订单

              that.setData({
                pay_price: res.data.pay_price
              })


              if (res.data.user_coupon_item && res.data.user_coupon_item.price) {            

                if (that.data.o2o_all_price) {
                  var o2o_all_price = that.data.o2o_all_price - res.data.user_coupon_item.price

                  if (o2o_all_price < 0) {
                    o2o_all_price = 0
                  }
                  that.setData({
                    o2o_all_price: util.sprintf("%6.2f", o2o_all_price)
                  })
                }else{
                  if (that.data.cuxiao_type == "duorenpintuan" || that.data.cuxiao_type == "sharekanjia") {
                    var pay_price = that.data.pay_price - res.data.user_coupon_item.price
                    if (pay_price < 0) {
                      pay_price = 0
                    }
                    that.setData({
                      pay_price: util.sprintf("%6.2f", pay_price)
                    })
                  }
                }
               
              }
           
              
                     

            } else {
              that.setData({
                all_price: res.data.all_price,
                pay_price: res.data.pay_price,
                pay_price_origin: res.data.pay_price,
              })
            } 

            if (that.data.o2o_all_price) {
              that.setData({
                all_price: that.data.o2o_all_price,
                pay_price: that.data.o2o_all_price,
                pay_price_origin: that.data.o2o_all_price
              })
            } else {
              if (that.data.cuxiao_type == "duorenpintuan" || that.data.cuxiao_type == "sharekanjia") {
                that.setData({
                  all_price: res.data.all_price,
                  pay_price: that.data.pay_price,
                  pay_price_origin: that.data.pay_price
                })
              }
            }    

            that.setData({
              order_address_detail: order_address_detail,
              productData: res.data.orderlist,           
              traffic_price: res.data.traffic_price,
              all_product_take_score: res.data.all_product_take_score,              
              balance: res.data.balance,
              balance_zengsong: res.data.balance_zengsong,
            });

            if (res.data.user_coupon_item){
              that.setData({
                user_coupon_item: res.data.user_coupon_item
              })
            }
          } 
          else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: 'false'
            })            
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


      var data_params = {
        // productid: that.data.productId,
        productid: that.data.productid,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
      }

      if(that.data.ucid){
        data_params.ucid = that.data.ucid
      }

          wx.request({
            url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_queren',
            method: 'post',
            data: data_params,
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {


              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
              var code = res.data.code;
              console.log(res.data);

              if (code == 1) {
                var order_address_detail=res.data.address;
                
                if (!order_address_detail){
                  that.setData({
                    addemt: 1
                  });
                }
                else { 
                  that.setData({
                    order_address_detail: order_address_detail,
                    addemt: 0
                  });
                }




                if (that.data.from_o2o == 1) {
                
                  that.setData({
                    pay_price: res.data.pay_price
                  })


                  if (res.data.user_coupon_item && res.data.user_coupon_item.price) {

                    if (that.data.o2o_all_price) {
                      var o2o_all_price = that.data.o2o_all_price - res.data.user_coupon_item.price

                      if (o2o_all_price < 0) {
                        o2o_all_price = 0
                      }
                      that.setData({
                        o2o_all_price: util.sprintf("%6.2f", o2o_all_price)
                      })
                    } else {
                      if (that.data.cuxiao_type == "duorenpintuan" || that.data.cuxiao_type == "sharekanjia") {
                        var pay_price = that.data.pay_price - res.data.user_coupon_item.price
                        if (pay_price < 0) {
                          pay_price = 0
                        }
                        that.setData({
                          pay_price: util.sprintf("%6.2f", pay_price)
                        })
                      }
                    }

                  }


                  if (that.data.o2o_all_price) {
                    that.setData({
                      all_price: that.data.o2o_all_price,
                      pay_price: that.data.o2o_all_price,
                      pay_price_origin: that.data.o2o_all_price
                    })
                  } else {
                    if (that.data.cuxiao_type == "duorenpintuan" || that.data.cuxiao_type == "sharekanjia") {
                      that.setData({
                        all_price: res.data.all_price,
                        pay_price: that.data.pay_price,
                        pay_price_origin: that.data.pay_price
                      })
                    }
                  } 

                } else {
                  that.setData({
                    all_price: res.data.all_price,
                    pay_price: res.data.pay_price,
                    pay_price_origin: res.data.pay_price,
                  })
                }


                that.setData({
                  order_address_detail: order_address_detail,

                  productData: res.data.orderlist,

                  traffic_price: res.data.traffic_price,
                  all_product_take_score: res.data.all_product_take_score,                 
                  balance: res.data.balance,
                  balance_zengsong: res.data.balance_zengsong,                            
                });

                if (res.data.user_coupon_item) {
                  that.setData({
                    user_coupon_item: res.data.user_coupon_item
                  })
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: 'false'
                }) 
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

    console.log('pay---productid', this.data.productid)
    console.log('pay---action', this.data.action)
    console.log('pay---amount', this.data.amount)

  },


  logout: function () {
    app.del_user_info();

    var sellerid = app.get_sellerid();
    if (typeof (sellerid) != 'undefined') {
      if (sellerid.length > 15) {
        wx.clearStorageSync();
        console.log('清空完成，sellerid：' + app.get_sellerid());
      }
    }

      wx.clearStorageSync();

      if(app.goto_user_login(this.data.last_url)){
        return;
      }
  },
  

  remarkInput:function(e){
    this.setData({
      buyer_memo: e.detail.value,
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

  

  createOrder:function(){
    this.setData({
     btnDisabled:true,
   })
    var that = this;
    
    if (that.data.wxa_order_queren_hide_address != 1 && that.data.from_o2o != 1){
      if (!that.data.order_address_detail || (!that.data.order_address_detail.addressid)){
        wx.showModal({
          title: '提示',
          content: '请填写收货地址',
          showCancel:false,
          success(res) {
            this.setData({
              btnDisabled: false,
            })
          }
        })

        return;
      }
    }







    var userInfo = app.get_user_info();


    console.log(that.data.pay_price);
    console.log(that.data.all_price);


    var data_orderAdd = {

      buyer_memo: that.data.buyer_memo,
      all_price: that.data.all_price,
      userid: userInfo.userid,
      checkstr: userInfo.checkstr,
      traffic_price: that.data.traffic_price,
      pay_price: that.data.pay_price,
      sellerid: app.get_sellerid(),
      payment: 3
    };

    if (wx.getStorageSync('from_chouheji')==1){
      data_orderAdd.buyer_memo = that.data.buyer_memo;
    }

    if (that.data.all_price == 'undefined'){
      wx.showModal({
        title: '提示',
        content: '参数错误，请重新下单！',
        showCancel: 'false'
      })
      return;
    }

    if(that.data.from_o2o==1){
      data_orderAdd.address = that.data.address_info.level03 + that.data.address_info.level04.floor_num + '层' + that.data.address_info.level04.name  + that.data.address_info.level04.room_no ;
      data_orderAdd.realname = that.data.shouHuoInfo.shouHuoName;
      data_orderAdd.mobile = that.data.shouHuoInfo.mobileNo;
    }

    if (that.data.all_product_take_score){
      data_orderAdd.all_product_take_score = that.data.all_product_take_score
    }

    if(that.data.ucid){
      data_orderAdd.ucid = that.data.user_coupon_item.ucid;
      data_orderAdd.coupon_price = that.data.user_coupon_item.price;
    }

    if (that.data.cuxiao_type == 'duorenpintuan') {
      data_orderAdd.cuxiao_type = 'duorenpintuan';
      data_orderAdd.jiantuanid = that.data.jiantuanid;
      data_orderAdd.price_type = that.data.price_type;
      data_orderAdd.price2 = that.data.all_price;
      }
    else if (that.data.cuxiao_type == 'sharekanjia') {
      data_orderAdd.cuxiao_type = that.data.cuxiao_type
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

          //o2o订单
          if (that.data.order_option_key_and_value_str){

            that.order_add_new_option_by_key_value();
            
          }


          if (that.data.cuxiao_type == 'sharekanjia'){
            //var share_kanjia_page = 'https://yanyubao.tseo.cn/'
            var share_kanjia_page = app.globalData.http_server + '?g=Home&m=ShareKanjia&a=share_detail&orderid=' + that.data.orderid +'&productid=' + that.data.productid + '&userid=' + userInfo.userid + '&click_type=Wxa';

            console.log('准备启动h5browser==', share_kanjia_page)

            wx.redirectTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(share_kanjia_page) + '&share_title=' + that.data.productData[0].name + '&share_image=' + that.data.productData[0].picture,
            });
          }
          else{

            wx.redirectTo({
              url: '../order/zhifu?orderId=' + that.data.orderid + '&balance_zengsong_dikou=' + that.data.balance_zengsong_dikou + '&balance_dikou=' + that.data.balance_dikou + '&traffic_price=' + that.data.traffic_price,
            })
          }
          

        } else if (data.code == 2) {

          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          that.setData({
            btnDisabled: false,
          });

          
        } else {
          wx.showToast({
            title: "下单失败!",
            duration: 2500
          });
          that.setData({
            btnDisabled: false,
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
        that.setData({
          btnDisabled: false,
        });
      }
    });
  },
  
  //调起微信支付
  wxpay_after_option_key_value: function (e) {  
    var that=this;
    var userInfo = app.get_user_info();
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_buy',
      data: {
        // productid: that.data.productid,
        orderid: that.data.orderid,
        payment_type: 3,
        trade_type: 'JSAPI_WXA',
        appid: app.globalData.xiaochengxu_appid,
        openid: userInfo.user_openid,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        client: 'wxa',
        sellerid: app.get_sellerid(),    
        yue_amount: that.data.balance_dikou,
        zengkuan_amount: that.data.balance_zengsong_dikou,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        console.log('order_buy order_buy order_buy', res);

        if (res.data.code == 1) {

          if(res.data.str == 'yue'){
            wx.showToast({
              title: "支付成功!",
              duration: 2000,
            });

            setTimeout(function () {
              wx.navigateTo({
                url: '../user/dingdan?currentTab=2&otype=2',
              });
            }, 2500);
            return;
          }
          if (res.data.wxpay_params.errcode == 1) {
            // wx.showToast({
            //   title: "网络错误!",
            //   duration: 2000,
            //   icon: 'none',
            // });

            wx.showModal({
              title: '提示',
              content: '启动微信钱包失败！',
            })
            that.setData({
              btnDisabled: false,
            });
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
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=2&otype=2',
                });
              }, 2500);

            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
                duration: 3000
              })
              that.setData({
                btnDisabled: false,
              });
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
          that.setData({
            btnDisabled: false,
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
        that.setData({
          btnDisabled: false,
        });
      }
    })
  },





  toCouponList:function(){
    wx.navigateTo({
      url: '/pages/order/coupon_list?productid=' + this.data.productid + '&pay_price=' + this.data.pay_price_origin,
    })
  },

  
  //钱包抵扣
  switch1Change: function (e, type = null, value = null, that = null) {
    console.log('eeeeee', e, type, value)

    if (type == null && value == null) {
      var type = e.currentTarget.dataset.type
      var value = e.detail.value
      var that = this;
    }

    var pay_price = that.data.pay_price;
    var pay_price_origin = that.data.pay_price_origin;   
    var balance_zengsong = that.data.balance_zengsong;
    var balance = that.data.balance;
    var balance_zengsong_dikou = that.data.balance_zengsong_dikou;
    var balance_dikou = that.data.balance_dikou;



    if (type == 1) {
      if (value) {
        if (parseFloat(balance_zengsong) < parseFloat(pay_price_origin)) {

          if (that.data.balance_dikou) {

            that.switch1Change(null, 2, false, that)
            pay_price = that.data.pay_price;
            balance_zengsong = that.data.balance_zengsong;
            balance = that.data.balance;
            balance_zengsong_dikou = that.data.balance_zengsong_dikou;
            balance_dikou = that.data.balance_dikou;


            that.setData({
              balance_zengsong: util.sprintf("%6.2f", 0),
              pay_price: util.sprintf("%6.2f", parseFloat(pay_price) - parseFloat(balance_zengsong)),
              balance_zengsong_dikou: util.sprintf("%6.2f", parseFloat(balance_zengsong)),
              isSwitch2: false,
            })
          } else {
            that.setData({
              balance_zengsong: util.sprintf("%6.2f", 0),
              pay_price: util.sprintf("%6.2f", parseFloat(pay_price) - parseFloat(balance_zengsong)),
              balance_zengsong_dikou: util.sprintf("%6.2f", parseFloat(balance_zengsong))
            })
          }



        } else {

          if (that.data.balance_dikou) {

            that.switch1Change(null, 2, false, that)
            pay_price = that.data.pay_price;
            balance_zengsong = that.data.balance_zengsong;
            balance = that.data.balance;
            balance_zengsong_dikou = that.data.balance_zengsong_dikou;
            balance_dikou = that.data.balance_dikou;
          }

          that.setData({
            balance_zengsong: util.sprintf("%6.2f", parseFloat(balance_zengsong) - parseFloat(pay_price)),
            pay_price: util.sprintf("%6.2f", 0),
            balance_zengsong_dikou: util.sprintf("%6.2f", parseFloat(pay_price)),
            isSwitch2: false,
          })

        }
      } else {

        that.setData({
          balance_zengsong: util.sprintf("%6.2f", parseFloat(balance_zengsong) + parseFloat(balance_zengsong_dikou)),
          pay_price: util.sprintf("%6.2f", parseFloat(pay_price) + parseFloat(balance_zengsong_dikou)),
          balance_dikou: util.sprintf("%6.2f", 0),
          balance_zengsong_dikou: util.sprintf("%6.2f", 0),
        })
      }

    } else if (type == 2) {
      if (value) {
        if (parseFloat(balance) < parseFloat(pay_price_origin)) {
     
          if (that.data.balance_zengsong_dikou) {

            that.switch1Change(null, 1, false, that)
            pay_price = that.data.pay_price;
            balance_zengsong = that.data.balance_zengsong;
            balance = that.data.balance;
            balance_zengsong_dikou = that.data.balance_zengsong_dikou;
            balance_dikou = that.data.balance_dikou;


            that.setData({
              balance: util.sprintf("%6.2f", 0),
              pay_price: util.sprintf("%6.2f", parseFloat(pay_price) - parseFloat(balance)),
              balance_dikou: util.sprintf("%6.2f", parseFloat(balance)),
              isSwitch1: false,
            })
          } else {
            that.setData({
              balance: util.sprintf("%6.2f", 0),
              pay_price: util.sprintf("%6.2f", parseFloat(pay_price) - parseFloat(balance)),
              balance_dikou: util.sprintf("%6.2f", parseFloat(balance))
            })
          }



        } else {

          if (that.data.balance_zengsong_dikou) {

            that.switch1Change(null, 1, false, that)
            pay_price = that.data.pay_price;
            balance_zengsong = that.data.balance_zengsong;
            balance = that.data.balance;
            balance_zengsong_dikou = that.data.balance_zengsong_dikou;
            balance_dikou = that.data.balance_dikou;
          }
          that.setData({
            balance: util.sprintf("%6.2f", parseFloat(balance) - parseFloat(pay_price)),
            pay_price: util.sprintf("%6.2f", 0),
            balance_dikou: util.sprintf("%6.2f", parseFloat(pay_price)),
            isSwitch1: false,
          })

        }
      } else {

        that.setData({
          balance: util.sprintf("%6.2f", parseFloat(balance) + parseFloat(balance_dikou)),
          pay_price: util.sprintf("%6.2f", parseFloat(pay_price) + parseFloat(balance_dikou)),
          balance_zengsong_dikou: util.sprintf("%6.2f", 0),
          balance_dikou: util.sprintf("%6.2f", 0),
        })
      }

    }
  },


  //添加order_option
  order_add_new_option_by_key_value:function(e){
    var that = this;

    var userInfo = app.get_user_info();
    
    api.abotRequest({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_add_new_option_by_key_value',
      data: {
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
        orderid: that.data.orderid,
        order_option_key_and_value_str: that.data.order_option_key_and_value_str
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        
        
      },
      fail: function (res) {
        
      }
    })

    
  },

});