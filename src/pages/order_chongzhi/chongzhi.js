// pages/order_chongzhi/chongzhi.js
var app = getApp();
var userInfo = app.get_user_info();
var api = require('../../utils/api');
var util = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioCheckVal: 0,
    comment: !1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('lalalalalalal22', options)
    var that = this
    
    app.getColor();

    app.set_option_list_str(this, this.callback_function);

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/OrderChongZhiData/get_chongzhi_rule_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if(data.code == 1){
          that.setData({
            taocan: data.data
          })
        }
        
       
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常',
          duration: 2000
        });

      }
    });


  },


  // callback_function callback_function callback_function
  callback_function: function (that, cb_params) {
    var option_list = app.globalData.option_list;


    console.log('callback_function+++++:::' + cb_params)

    if (!option_list) {
      return;
    }

    if (option_list.wxa_shop_nav_bg_color) {
      that.setData({
        wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color
      });
    }

    if (option_list.wxa_shop_nav_bg_color) {
      that.setData({
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color
      });
    }

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    userInfo = app.get_user_info();

    this.setData({
      topbackground: app.globalData.backgroundColor
    })

    console.log('ssssssssss', app.globalData.backgroundColor);

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.backgroundColor,
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 点击选中变色
  radioCheckedChange: function (e) {
    var currentid = e.currentTarget.dataset.currentid
    var sum_price = e.currentTarget.dataset.sum_price
    var all_price = e.currentTarget.dataset.all_price
    console.log('e=====', e)
    this.setData({
      currentid: currentid,

      all_price: all_price,
    })
  },



  toRecharge: function (e) {
    var that = this;
    if (!that.data.all_price) {
      wx.showToast({
        title: '请选择充值套餐',
        icon: 'none',
        duration: 2000
      })
      return;
    }


    var data_orderAdd = {

      all_price: that.data.all_price,
      userid: userInfo.userid,
      checkstr: userInfo.checkstr,
      pay_price: that.data.all_price,
      sellerid: app.get_sellerid(),
      payment: 3,
      order_type: 1,
    };

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
            orderid: res.data.orderid,
            orderno: res.data.orderno,
          });
          wx.navigateTo({
            url: '../order/zhifu?orderId=' + that.data.orderid + '&recharge=1',
          })


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

  comment: function () {
    this.setData({
      comment: !0,
    })
  },

  formid_one: function (t) {
    this.setData({
      comment: !1
    });
  },


})