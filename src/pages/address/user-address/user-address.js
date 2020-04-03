// pages/address/user-address/user-address.js

var app = getApp();
var userInfo = app.get_user_info();
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id:0,
    num:0,
    cartId:0,
    buynum:'',
    productid:'',
    action:'',
    is_from_order_page:false
  },
  onShow: function () {

  },
  onLoad: function (options) {
<<<<<<< HEAD
    app.set_option_list_str(null, app.getColor());
    
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    var userInfo = app.get_user_info();
    if ((!userInfo) || (!userInfo.userid)) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    };
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var cartId = options.cartId;
    var buynum = options.buynum;
    
    console.log(options);
    console.log(654987)

    if(options.cartId){
      that.setData({
        is_from_order_page:true
      })
    }

    var userInfo = app.get_user_info();
    console.log(userInfo);
    console.log(333333)

    that.setData({
      productid: options.productid,
      amount: options.amount,
      action: options.action,
    });
    
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_list',
      data: {
        checkstr: userInfo.checkstr,
        userid:userInfo.userid,
        sellerid: app.get_sellerid()
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        wx.hideLoading();
        // success
        var code = res.data.code
        
        var address = [];

        if (code == 1) {
          var address = res.data.addressList;
        }

        that.setData({
          address: address          
        })

        if (cartId) {
          that.setData({
            cartId: cartId
          })
        }

        if (buynum) {
          that.setData({
            buynum: buynum
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
    })
    
  },

  onReady: function () {
    // 页面渲染完成
  },
  select_address_to_order:function(e){
    console.log('aaaaaaaaaaaaaaaaaaaaa', this.data.is_from_order_page);
    
    if (!this.data.is_from_order_page){
      return;
    }

    this.setDefault(e);
  },
  setDefault: function(e) {
    var that = this;

    var addrId = e.currentTarget.dataset.id;
    var userInfo = app.get_user_info();
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_save',
      data: {
        action:	'edit',
        addressid: addrId,
        moren:1,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid()
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var code = res.data.code;
        var cartId = that.data.cartId;
        var amount = that.data.amount;
        var productid = that.data.productid;
        var action = that.data.action;

        if(cartId == 321){
          if (code == 1) {
            if (action == 'direct_buy') {
              wx.redirectTo({
                //url: '../../order/pay?productid=' + productid + "&buynum=" + buynum,
                url: '../../order/pay?amount=' + amount + "&productid=" + that.data.productid + "&action=direct_buy",
              });
              //    return false;
            } else {
              wx.redirectTo({
                url: '../../order/pay?amount=' + amount + "&productid=" + that.data.productid,
              });
            }
            wx.showToast({
              title: '操作成功！',
              duration: 2000
            });
            that.DataonLoad();
          } else {
            wx.showToast({
              title: res.data.msg,
              duration: 2000
            });
          }
        }else{
          wx.showToast({
            title: '设置成功！',
          });
          wx.redirectTo({
            url: '../user-address/user-address',
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
  saveAddress:function (e) {
    var addressId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../address?action=edit&addressId=' + addressId,
    });
  },
  delAddress: function (e) {
    var that = this;
    console.log(e)
    var addrId = e.currentTarget.dataset.id;
    var userInfo = app.get_user_info();
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_save',
          data: {
            action: 'del',
            addressid: addrId,
            userid: userInfo.userid,
            checkstr: userInfo.checkstr,
            sellerid: app.get_sellerid()
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            // success
            var code = res.data.code;
            if(code==1){
              that.DataonLoad();
            }else{
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
    });

  },
  DataonLoad: function () {
    var that = this;
    var userInfo = app.get_user_info();
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_list',
      data: {
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid()
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var address = res.data.addressList;
        if (!address) {
          address = []
        }

        that.setData({
          address: address,
        })

        
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