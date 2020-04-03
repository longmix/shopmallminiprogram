// pages/order/coupon_list.js
var app = getApp();
var userInfo = app.get_user_info();
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
<<<<<<< HEAD

    app.set_option_list_str(null, app.getColor());

=======
    app.getColor();
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    console.log('dddd', options)
    if(!userInfo){
      userInfo = app.get_user_info();
    }


    if(options.productid){
      that.setData({
        productid: options.productid
      })
    }

    

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
<<<<<<< HEAD

=======
    app.getColor();
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/MarketCouponData/get_coupon_list',
      method: 'post',
      data: {
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
        productid: that.data.productid
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


  toOrderQueren:function(e){
    console.log('e=====',e)
    var ucid = e.currentTarget.dataset.ucid;
    wx.navigateTo({
      url: '/pages/order/pay?ucid=' + ucid,
    })
  }


})