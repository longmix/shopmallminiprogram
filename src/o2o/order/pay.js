var app = getApp();
// pages/order/downline.js
var userInfo = app.get_user_info();
var util = require('../../utils/util.js');
var api = require('../../utils/api');

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
     userInfo = app.get_user_info();
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

    console.log('order/pay 参数：', options);

    
    app.set_option_list_str(null, app.getColor());

    
    
  


    if (options.ucid) {
      this.setData({
        ucid: options.ucid,
        user_coupon_item: wx.getStorageSync("cache_coupon")
      })
      options = JSON.parse(wx.getStorageSync("cache_options"));


    } else {
      wx.setStorageSync("cache_options", JSON.stringify(options));
    }


    var last_url = null;    
    if (options.productid) {
      last_url = '/pages/product/detail?productid=' + options.productid;
      this.setData({
        last_url: last_url
      })
    }
    this.setData({
      last_url: last_url
    })
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


    this.setData({
      productid: options.productid,

      

      //如果cuxiao_type == duorenpintuan 
     

      //如果cuxiao_type == sharekanjia
      
      
      action: options.action,
      
      amount: options.amount
    });

    if (option_list_str){
      if (!option_list_str.wxa_order_queren_hide_address){
        option_list_str.wxa_order_queren_hide_address = 0;
      }

      this.setData({
        wxa_order_queren_hide_address: option_list_str.wxa_order_queren_hide_address,
      });
    }




    
    app.set_option_list_str(this, this.loadProductDetail);






    // return;

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
        var all_price = options.all_price;
        if(this.data.ucid){
          all_price = all_price - this.data.user_coupon_item.price;
          all_price < 0 ? 0 : all_price;
          all_price = util.sprintf("%6.2f", parseFloat(all_price))
        }

        this.setData({
          all_price: all_price ,
          pay_price: all_price,
          pay_price_origin: all_price,
        })
      }

      if(options.flag){
        this.setData({
          flag: options.flag
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



    var cart_list = wx.getStorageSync('cart_list');

    this.setData({
      cartlist: cart_list
    })


    console.log('cartlist=========', cart_list)

    if (userInfo) {
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
        data: {
          sellerid: app.get_sellerid(),
          checkstr: userInfo.checkstr,
          userid: userInfo.userid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          console.log('ddd', res);
          // console.log('ddd', res.data.code);
          if (res.data.code == "-1") {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            var data = res.data
            var data2 = data.data

            that.setData({
              balance: data2.balance,
              balance_zengsong: data2.balance_zengsong
            });
          }

        }
      })
    }
      

     
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

      app.goto_user_login(this.data.last_url, 'normal');
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

    var cart_list = that.data.cartlist

    console.log('cart_list==', cart_list)

    var order_product_list = [];
    var weeklist = wx.getStorageSync('weeklist');
       
      for(var i = 0; i< weeklist.length; i++){
        var obj = {
          "o2o_room_tuan_yuding": weeklist[i].str,
           "product_list": [],
        }
        var price_total = 0;
        for (var j = 0; j < cart_list.length; j++) {    
            if (cart_list[j].weekItem.str == weeklist[i].str){            
              price_total += parseFloat(cart_list[j].price_total);
              obj.product_list.push({ "productid": cart_list[j].productid, "amount": cart_list[j].count});
            }                   
        }
        obj.price_total = price_total
        if (obj.product_list.length > 0) {
          order_product_list.push(obj);
        }
      }

    // console.log('order_product_list', order_product_list);
    // return;


    var data_orderAdd = {
      order_product_list: encodeURIComponent(JSON.stringify(order_product_list)),
      buyer_memo: that.data.remark,
      all_price: that.data.all_price,
      userid: userInfo.userid,
      checkstr: userInfo.checkstr,
      traffic_price: that.data.traffic_price,
      pay_price: that.data.pay_price,
      sellerid: app.get_sellerid(),
      payment: 3,
      o2o_room_tuan_roomid: that.data.address_info.level04.roomid,
      o2o_room_tuan_bid: that.data.address_info.level04.bid,      
    };

    if(that.data.flag==1){
      data_orderAdd.buynow_direct = 1
    }

    if (that.data.flag == 2) {
      data_orderAdd.o2o_room_tuan_001 = 1
    }

    if (that.data.flag == 3) {
      var tuanzhang_orderid = wx.getStorageSync('tzorderid_cache');//团长orderid
      data_orderAdd.o2o_room_tuan_002 = tuanzhang_orderid
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
      url: app.globalData.http_server + 'openapi/O2OAddressData/o2o_order_add',
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
            that.wxpay_after_option_key_value();
            
            return;
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


            wx.removeStorage({
              key: 'cart_list'
            })

            
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/user/dingdan?currentTab=2&otype=2',
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

              wx.removeStorage({
                key: 'cart_list'
              })

              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/user/dingdan?currentTab=2&otype=2',
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
      url: '/pages/order/coupon_list?productid=' + this.data.productid + '&pay_price=' + this.data.pay_price_origin + '&from_o2o=' + this.data.from_o2o,
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


  
  

});