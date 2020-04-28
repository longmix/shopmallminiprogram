// pages/recharge/recharge_ways.js
var app = getApp();
var userInfo = app.get_user_info();
var api = require('../../utils/api');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if(!userInfo){
      userInfo = app.get_user_info();
    }
    if (options.all_price){
      that.setData({
        pay_price: options.all_price,
        all_price: options.all_price,
        flag: options.flag,
        id: options.id
      })
    }

    if (options.id) {
      that.setData({
        id: options.id
      })
    }

    app.get_shop_info_from_server(function (shop_info_from_server) {

      console.log('shop_info_from_server====', shop_info_from_server);

      var shop_list = shop_info_from_server;
      that.setData({
        shop_name: shop_list.shop_name,
        shop_icon: shop_list.icon
      })

    })


    app.getColor();

    app.set_option_list_str(this, this.callback_function);

  },




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

    if (option_list.wxa_shop_nav_font_color) {
      that.setData({
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color
      });
    }

  },



  moneyInput:function(e){
    this.setData({
      pay_price: e.detail.value
    })
  },


  checkNumber: function (num) {
    let that = this
    if (!(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(num))) {

      wx.showToast({
        title: '请输入正确金额',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },

  formSubmit:function(e){
    var that = this;
    if (!that.data.pay_price) {

      wx.showToast({
        title: '请输入金额',
        duration: 2000,
        icon: 'none'
      });
      return;
    }

    if(!that.checkNumber(that.data.pay_price)){
      return;
    }


    var data_orderAdd = {
      buyer_memo: that.data.remark,
      all_price: that.data.pay_price,
      userid: userInfo.userid,
      checkstr: userInfo.checkstr,
      traffic_price: that.data.traffic_price,
      pay_price: that.data.pay_price,
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

  //备注
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value,
    })
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

  }
})