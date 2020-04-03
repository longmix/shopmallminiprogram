var app = getApp();
// pages/order/downline.js
var userInfo = app.get_user_info();
var util = require('../../utils/util.js');
<<<<<<< HEAD
var api = require('../../utils/api');
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

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
    cartId:'321',
    balance_zengsong_dikou: 0,
    balance_dikou: 0,
    wxa_order_queren_hide_address:0
  },
  onShow: function () {
<<<<<<< HEAD
=======
    app.getColor();


    
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

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
    //console.log(options)


<<<<<<< HEAD
    app.set_option_list_str(null, app.getColor());


    wx.showLoading({
      title: '加载中...',
    })

  

=======
    
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

    if (options.ucid) {
      this.setData({
        ucid: options.ucid
      })
    }

    if (options.productid) {
      wx.setStorageSync("cache_options", JSON.stringify(options));
    } else {
      options = JSON.parse(wx.getStorageSync("cache_options"));
    }

    var last_url = null;    
    if (options.productid) {
      last_url = '/pages/product/detail?productid=' + options.productid;
    }
    app.goto_user_login(last_url, 'normal');

    


    var option_list_str = JSON.parse(wx.getStorageSync("option_list_str"));

    if (options.cuxiao_type){
      this.setData({
        cuxiao_type: options.cuxiao_type,
      });
    }
    if (options.price_type){
      this.setData({
        price_type: options.price_type,
      });
    }
    if (options.jiantuanid){
      this.setData({
        jiantuanid: options.jiantuanid,
      });
    }
    
    console.log('options==',options);
<<<<<<< HEAD
    console.log('options.productid==', option_list_str);
=======
    console.log('options.productid==', options.proudctid);
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

    this.setData({
      productid: options.productid,

      

      //如果cuxiao_type == duorenpintuan 
     

      //如果cuxiao_type == sharekanjia
      
      
      action: options.action,
      
      amount: options.amount
    });

<<<<<<< HEAD
    if (option_list_str){
      if (!option_list_str.wxa_order_queren_hide_address){
        option_list_str.wxa_order_queren_hide_address = 0;
      }

=======
    if (option_list_str && option_list_str.wxa_order_queren_hide_address){
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
      this.setData({
        wxa_order_queren_hide_address: option_list_str.wxa_order_queren_hide_address,
      });
    }

<<<<<<< HEAD
    app.set_option_list_str(this, this.loadProductDetail);

    

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

      if(options.all_price){
        this.setData({
          o2o_all_price: options.all_price 
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
=======
    this.loadProductDetail();
    wxa_order_queren_hide_addressuserList   
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e


  },
  loadProductDetail:function(){
    var that = this;
    var userInfo = app.get_user_info();

    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");
    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    if (!option_list) {
      return;
    }

    this.setData({
      wxa_order_hide_coupon: option_list.wxa_order_hide_coupon,
      wxa_order_hide_balance_zengsong: option_list.wxa_order_hide_balance_zengsong,
      wxa_order_hide_balance: option_list.wxa_order_hide_balance,
    })





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

      if (that.data.cuxiao_type){
        data_params.cuxiao_type = that.data.cuxiao_type;
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
          if (code == 1) {
            console.log('ceshiceshi',res.data.llll)
<<<<<<< HEAD
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
              that.setData({
                all_price: that.data.o2o_all_price,
                pay_price: that.data.o2o_all_price
              })
            } else {
              that.setData({
                all_price: res.data.all_price,
                pay_price: res.data.pay_price
              })
            }

=======
            var order_detail = res.data.address;
            console.log(order_detail);
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
            that.setData({
              order_address_detail: order_address_detail,

              productData: res.data.orderlist,
            
              traffic_price: res.data.traffic_price,
              all_product_take_score: res.data.all_product_take_score,
<<<<<<< HEAD
              pay_price_origin: res.data.pay_price,
              balance: res.data.balance,
              balance_zengsong: res.data.balance_zengsong,
=======
              pay_price: res.data.pay_price,
              pay_price_origin: res.data.pay_price,
              balance: res.data.balance,
              balance_zengsong: res.data.balance_zengsong,
              addemt: 0
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
            });

            if (res.data.user_coupon_item){
              that.setData({
                user_coupon_item: res.data.user_coupon_item
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
    }else{
<<<<<<< HEAD

=======
      console.log(22222222);
      console.log(22222222);
      console.log(that.data.productid+'ssssssss');
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

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
<<<<<<< HEAD
                }




                if (that.data.from_o2o == 1) {
                  that.setData({
                    all_price: that.data.o2o_all_price,
                    pay_price: that.data.o2o_all_price
                  })
                } else {
                  that.setData({
                    all_price: res.data.all_price,
                    pay_price: res.data.pay_price
                  })
                }


                that.setData({
                  order_address_detail: order_address_detail,

                  productData: res.data.orderlist,

                  traffic_price: res.data.traffic_price,
                  all_product_take_score: res.data.all_product_take_score,
                  pay_price_origin: res.data.pay_price,
                  balance: res.data.balance,
                  balance_zengsong: res.data.balance_zengsong,                            
                });

=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
                if (res.data.user_coupon_item) {
                  that.setData({
                    user_coupon_item: res.data.user_coupon_item
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

      buyer_memo: that.data.remark,
      all_price: that.data.all_price,
      userid: userInfo.userid,
      checkstr: userInfo.checkstr,
      traffic_price: that.data.traffic_price,
      pay_price: that.data.pay_price,
      sellerid: app.get_sellerid(),
      all_product_take_score: that.data.all_product_take_score,
      payment: 3
    };

<<<<<<< HEAD
    if(that.data.from_o2o==1){
      data_orderAdd.address = that.data.address_info.level03 + that.data.address_info.level04.floor_num + '层' + that.data.address_info.level04.name  + that.data.address_info.level04.room_no ;
      data_orderAdd.realname = that.data.shouHuoInfo.shouHuoName;
      data_orderAdd.mobile = that.data.shouHuoInfo.mobileNo;
    }

    if (that.data.all_product_take_score){
      data_orderAdd.all_product_take_score = that.data.all_product_take_score
    }
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

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
          if(that.data.from_o2o == 1){
            that.add_order_option_by_key_value();
            
            return;
          }


          if (that.data.cuxiao_type == 'sharekanjia'){
            //var share_kanjia_page = 'https://yanyubao.tseo.cn/'
            var share_kanjia_page = app.globalData.http_server + '?g=Home&m=ShareKanjia&a=share_detail&productid=' + that.data.productid + '&userid=' + userInfo.userid;

            wx.redirectTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(share_kanjia_page),
            });
          }
          else{

            wx.redirectTo({
<<<<<<< HEAD
              url: '../order/zhifu?orderId=' + that.data.orderid + '&balance_zengsong_dikou=' + that.data.balance_zengsong_dikou + '&balance_dikou=' + that.data.balance_dikou + '&traffic_price=' + that.data.traffic_price,
=======
              url: '../order/zhifu?orderId=' + that.data.orderid + '&balance_zengsong_dikou=' + that.data.balance_zengsong_dikou + '&balance_dikou=' + that.data.balance_dikou,
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
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
<<<<<<< HEAD
          that.setData({
            btnDisabled: false,
          });

          
=======

          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none',
          //   duration: 2500
          // });
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
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
  wxpay: function (e) {  
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

<<<<<<< HEAD
          if(res.data.str == 'yue'){
            wx.showToast({
              title: "支付成功!",
              duration: 2000,
            });
=======
                setTimeout(function(){
                  wx.redirectTo({
                    url: '../user/dingdan?currentTab=1&otype=deliver',
                  });
                },2500);
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

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
    wx.redirectTo({
      url: '/pages/order/coupon_list?productid=' + this.data.productid,
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


  //o2o
  add_order_option_by_key_value:function(e){
    var that = this;
    var order_option_key_and_value = wx.getStorageSync('order_option_key_and_value');


    var order_option_key_and_value_str = encodeURIComponent(JSON.stringify(order_option_key_and_value));

    api.abotRequest({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=add_order_option_by_key_value',
      data: {
        sellerid: app.get_sellerid(),
        orderid: that.data.orderid,
        order_option_key_and_value_str: order_option_key_and_value_str
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        that.wxpay();
      },
      fail: function (res) {
        that.setData({
          btnDisabled: false,
        });
      }
    })

    
  },



  toCouponList:function(){
    wx.redirectTo({
      url: '/pages/order/coupon_list?productid=' + this.data.productid,
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
              balance_zengsong:  0,
              pay_price: util.sprintf("%6.2f", parseFloat(pay_price) - parseFloat(balance_zengsong)),
              balance_zengsong_dikou: util.sprintf("%6.2f", parseFloat(balance_zengsong)),
              isSwitch2: false,
            })
          } else {
            that.setData({
              balance_zengsong: 0,
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
            pay_price: 0,
            balance_zengsong_dikou: util.sprintf("%6.2f", parseFloat(pay_price)),
            isSwitch2: false,
          })

        }
      } else {

        that.setData({
          balance_zengsong: util.sprintf("%6.2f", parseFloat(balance_zengsong) + parseFloat(balance_zengsong_dikou)),
          pay_price: util.sprintf("%6.2f", parseFloat(pay_price) + parseFloat(balance_zengsong_dikou)),
          balance_dikou: 0,
          balance_zengsong_dikou: 0,
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
              balance: 0,
              pay_price: util.sprintf("%6.2f", parseFloat(pay_price) - parseFloat(balance)),
              balance_dikou: util.sprintf("%6.2f", parseFloat(balance)),
              isSwitch1: false,
            })
          } else {
            that.setData({
              balance: 0,
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
            pay_price: 0,
            balance_dikou: util.sprintf("%6.2f", parseFloat(pay_price)),
            isSwitch1: false,
          })

        }
      } else {

        that.setData({
          balance: util.sprintf("%6.2f", parseFloat(balance) + parseFloat(balance_dikou)),
          pay_price: util.sprintf("%6.2f", parseFloat(pay_price) + parseFloat(balance_dikou)),
          balance_zengsong_dikou: 0,
          balance_dikou: 0,
        })
      }

    }
  },



  // switch2Change:function(){
  //   var pay_price = that.data.pay_price;
  //   var pay_price_origin = that.data.pay_price_origin;
  //   var balance_zengsong = that.data.balance_zengsong;
  //   var balance = that.data.balance;
  //   var balance_zengsong_dikou = that.data.balance_zengsong_dikou;
  //   var balance_dikou = that.data.balance_dikou;

  //   if(type == 1){
  //     if()
  //     if (parseFloat(balance_zengsong) < parseFloat(pay_price_origin)) {

  //     }
  //   }
    
  // }

});