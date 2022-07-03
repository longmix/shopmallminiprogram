// pages/address/user-address/user-address.js
var api = require('../../../utils/api');
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
    is_from_order_page:false,

    wxa_shop_nav_bg_color: '#000000'
  },
  onShow: function () {

  },
  onLoad: function (options) {
    console.log('user-address----options==', options)
    app.set_option_list_str(this, function (that001, option_list){
      app.getColor();

      that001.setData({
        wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color
      });


    });

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
    
    console.log('options000===>>>',options);
    console.log(654987)

    if(options.cartId){
      that.setData({
        is_from_order_page:true
      })
    }

    var userInfo = app.get_user_info();
    console.log(userInfo);
    console.log(333333)


    if (options.productid){
      that.setData({
        productid: options.productid,
      });
    }
    
    if (options.amount) {
      that.setData({
        amount: options.amount,
      });
    }

    if (options.action) {
      that.setData({
        action: options.action,
      });
    }
    
    if (options.action_pay) {
      that.setData({
        action_pay: options.action_pay,
      });
    }
    console.log('000000000000====>>>>',options)
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
        console.log('addresss111111111====>>>>>',address)
        that.setData({
          address: address          
        })

        if (cartId) {
          that.setData({
            cartId: cartId
          })
        }
        console.log('cartId',cartId)
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

  setDefault: function(e) {
    var that = this;

    var addrId = e.currentTarget.dataset.id;
    console.log('addrId1111111111======>>>>>',addrId)
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
        var action_pay = that.data.action_pay;

        console.log('productid=================11', productid)
        console.log('amount=================11', amount)
        console.log('action_pay=================11', that.data.action_pay)
        if(cartId == 321){
          if (code == 1) {
            if (action_pay == 'direct_buy') {
              wx.redirectTo({
                //url: '../../order/pay?productid=' + productid + "&buynum=" + buynum,
                url: '../../order/pay?amount=' + amount + "&productid=" + that.data.productid + "&action=direct_buy",
              });
              //    return false;
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
          wx.showModal({
            title: '提示',
            content: '设置默认成功！',
            
          })
          that.DataonLoad();
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

  //调用微信地址
  wxaddress: function wxaddress() {
    var that = this;
    var userInfo = app.get_user_info();
    console.log('aaahush',userInfo);
    wx.chooseAddress({

      success: function success(res) {

        console.log('aaaaasss', res);
        var provinceName = res.provinceName;
        var cityName = res.cityName;
        var countyName = res.countyName;
        var Name = res.userName;
        var telNumber = res.telNumber;
        var detailInfo = res.detailInfo;
        console.log('aaaaas====ss', countyName);

        var post_data = {
          userid: userInfo.userid,
          checkstr: userInfo.checkstr,
          sellerid: app.get_sellerid(),
          provinceName: provinceName,
          cityName: cityName,
          countyName: countyName,
          Name: Name,
        };
        api.abotRequest({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_city_coding',
          method: 'post',
          data: post_data,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) { 
              console.log('aaaaaname', res);
            var province = res.data.data.provinceCode;
            var city = res.data.data.cityCode;
            var county = res.data.data.countyCode;

            api.abotRequest({
              url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_save',
              method: 'post',
              data: {
                action: 'add',
                checkstr: userInfo.checkstr,
                userid: userInfo.userid,
                sellerid: app.get_sellerid(),
                name: Name,
                mobile: telNumber,
                area_province: provinceName,
                area_city: cityName,
                area_district: countyName,
                address: detailInfo
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },

              success: function success() {
                wx.showToast({
                  title: '添加成功！'
                });
                that.DataonLoad();
              },
              fail: function fail() {

              }
            });

          },
          fail: function fail() {
            // fail
            uni.showToast({
              title: '网络异常！',
              duration: 2000
            });

          }
        });

      },
      fail: function fail() {
        console.log(456789);
      },
      complete: function complete() {
        console.log(741822);
      }
    });


  },

  saveAddress:function (e) {
    var addressId = e.currentTarget.dataset.id;

    var new_url = '../address?action=edit&addressId=' + addressId + '&amount=' + this.data.amount + '&productid=' + this.data.productid + '&action_pay=' + this.data.action_pay;

    console.log('new_url000=====>>>>>',new_url)

    wx.redirectTo({
      url: new_url,
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