// pages/scan_qrcode/scan_bind_mobile.js
var app = getApp();

function countdown(that) {
  var timer001 = that.data.timer001;
  if (timer001 == 0) {
    //倒计时结束,恢复按钮可点击状态,同时内容设置为为 发送短信
    that.setData({
      second: '发送短信',
      timer001: 60,
      disabled: false,
      js_code: '',
      shop_icon: ''
    });
    return;
  }

  var time = setTimeout(function () {
    that.setData({
      second: '重新发送(' + timer001 + ')',
      timer001: timer001 - 1,
    });
    //  console.log('aaaaaaaaaaaaa', timer001);
    countdown(that);
  }
    , 1000)
}

Page({
  data: {
    second: '发送短信',
    mobile: "",
    disabled: false,
    timer001: 60,
    js_code: '',
    tokenstr: ''
  },





  btn_user_login: function () {
    var that = this;
    
    if (!this.data.mobile) {
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }
    if (!this.data.img) {
      wx.showToast({
        title: '请输入图片验证码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }
    if (!this.data.tel) {
      wx.showToast({
        title: '请输入手机验证码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }


    wx.request({
      // url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=login',
      url: app.globalData.http_server + 'index.php/openapi/Jianghanyinhua/change_mobile_num',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        openid: app.get_current_openid(),
        appid: app.globalData.xiaochengxu_appid,
        mobile: that.data.mobile,
        sms_code: that.data.tel,
        orderno: that.data.orderno,
        sellerid: app.get_sellerid()
      },
      success: function (res) {
        console.log('change_mobile_num res', res)

        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (res2) {
            // wx.navigateBack({
            //   delta: 100
            // })
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        })

      }
    });


  },
  onShow: function () {

  },
  onLoad: function (options) {
    var that = this;

    //countdown(that);

    app.set_option_list_str(null, app.getColor());

    if (options.orderno) {
      that.setData({
        orderno: options.orderno
      })
    }

    app.get_shop_info_from_server(function (shop_info_list) {
      that.setData({
        shop_list: shop_info_list,
      });
    });
    
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_tokenstr',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        //console.log(res.data);

        that.data.tokenstr = res.data.tokenstr;

        that.setData({
          img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=getverifycodeimg' + '&tokenstr=' + that.data.tokenstr
        });
      }
    })

    wx.getStorage({
      key: 'userListInfo',
      success: function (res) {
        if (res.data) {
          console.log(res.data[2].content);
          that.setData({
            mobile: res.data[2].content,

          });
        }

      }
    })

  },

  click_check: function (e) {

    var that = this


    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_tokenstr',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        // console.log(res.data);

        that.data.tokenstr = res.data.tokenstr;

        //console.log(res.data.tokenstr);

        that.setData({
          img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=getverifycodeimg' + '&tokenstr=' + that.data.tokenstr
        });
      }
    });

  },

  phoneInput: function (e) {
    //console.log('Phone=' + e.detail.value)
    this.data.mobile = e.detail.value;
  },

  imgInput: function (e) {
    //console.log('img=' + e.detail.value)
    this.data.img = e.detail.value;
  },

  telInput: function (e) {
    //console.log('tel=' + e.detail.value)
    this.data.tel = e.detail.value;
  },


  


  formSubmit: function (event) {


    console.log('aaaaaaaaaaaaaaaaaaa');
    console.log(event.detail.formId);
    var that = this;
    that.setData({
      formId: event.detail.formId
    });


  },

  send_btn: function (e) {
    var that = this

    console.log(1111);
    //检查手机号码是否正确
    if (!that.data.mobile) {
      wx.showToast({
        title: '请输入手机号码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }

    if (!that.data.img) {
      wx.showToast({
        title: '请输入图片验证码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/Jianghanyinhua/send_verify_code_sms',
      data: {
        mobile: that.data.mobile,
        verifycode: that.data.img,
        //verifycode_sms: that.data.second,
        tokenstr: that.data.tokenstr
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (request_data) {
        console.log(request_data.data)
        if (request_data.data.code == 1) {
          //将按钮设置为不可点击状态,同时显示倒计时
          countdown(that);

          that.setData({
            disabled: true
          });
          //=====end======

          wx.showModal({
            title: '提示',
            content: request_data.data.msg,
            showCancel: false,
          })

        } else {
          wx.showModal({
            title: '提示',
            content: request_data.data.msg,
            showCancel: false,
          })

          that.data.tokenstr = request_data.data.tokenstr;

          that.setData({
            img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + that.data.tokenstr
          });
        }
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  

  


})