// pages/order/coupon_list.js
var app = getApp();

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
    var that = this;

    app.set_option_list_str(null, app.getColor());

    console.log('dddd', options)


    if(options.productid){
      that.setData({
        productid: options.productid
      })
    }

    if (options.pay_price) {
      that.setData({
        all_price: options.pay_price
      })
    }


    if (options.from_o2o) {
      that.setData({
        from_o2o: options.from_o2o
      })
    }

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var userInfo = app.get_user_info();

    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/MarketCouponData/get_coupon_list',
      method: 'post',
      data: {
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
        productid: that.data.productid,
        all_price: that.data.all_price
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('res======', res);
        var code = res.data.code;
        if (code == 1) {
          that.setData({
            coupon_list: res.data.data,
          })
        } else {
          /*wx.showToast({
            title: res.data.msg,
            duration: 2000
          });*/
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


  toOrderQueren:function(e){
    console.log('e=====',e)
    var ucid = e.currentTarget.dataset.ucid;
    var index = e.currentTarget.dataset.index;

    if (this.data.from_o2o == 1){
      wx.setStorageSync('cache_coupon', this.data.coupon_list[index])
      wx.redirectTo({
        url: '/o2o/order/pay?ucid=' + ucid,
      })
    } else {
      wx.redirectTo({
        url: '/pages/order/pay?ucid=' + ucid,
      })
    }
    
  },

  doNotUse:function(e){

    if (this.data.from_o2o == 1) {
      wx.removeStorageSync('cache_coupon');
      wx.redirectTo({
        url: '/o2o/order/pay',
      })
    }else{
      wx.redirectTo({
        url: '/pages/order/pay',
      })
    }
    
  }


})