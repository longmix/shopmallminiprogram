// pages/check_login/check_login.js
var app = getApp();
var userInfo = app.get_user_info();
function countdown(that) {
  var timer001 = that.data.timer001;
  if (timer001 == 0) {
    //倒计时结束,恢复按钮可点击状态,同时内容设置为为 发送短信
    that.setData({
      second: '发送短信',
      timer001:60,
      disabled:false
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: '重新发送('+timer001+')',
      timer001:timer001 -1,
    });

    countdown(that);
  }
    , 1000)
}

Page({
  data: {
    second: '发送短信',
    mobile:"",
    disabled:false,
    timer001:60
  },
  onShow: function () {
    app.getColor();
  },
  onLoad: function (options) {
    var that = this

    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=Xiaochengxu&a=get_tokenstr',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        //console.log(res.data);
        app.globalData.tokenstr = res.data.tokenstr;

        that.setData({
          img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + res.data.tokenstr
        });

      }
    })

    wx.getStorage({
      key: 'userListInfo',
      success: function (res) {
        console.log(res.data);
        that.setData({
          mobile: res.data.mobile,

        });
      }
    })

  },

  click_check: function (e) {

    var that = this


    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=Xiaochengxu&a=get_tokenstr',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        // console.log(res.data);

        app.globalData.tokenstr = res.data.tokenstr;

        that.setData({
          img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + res.data.tokenstr
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





  check_button: function () {
    var that = this

    //console.log('手机号为:',this.data.mobile);
    //发起网络请求update_mobile
    //console.log(app.globalData.http_server);
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=user_info_save',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        new_mobile: this.data.mobile,
        verifycode_sms: this.data.tel,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
        userid: userInfo.userid
      },
      success: function (request_res) {
        //console.log('更新缓存的用户信息');
        if (request_res.data.code == 1) {              
          wx.showModal({
            title: '提示',
            content:request_res.data.msg,
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                wx.redirectTo({
                  //url: '../userinfo/userinfo'
                  url: '../index/index'

                })
                return;
              }
            }
          })
          
        }
        else {
          wx.redirectTo({
            url: '../userinfo/userinfo'
          })
          wx.showToast({
            title: request_res.data.msg,
            icon: 'fail',
            duration: 2000
          })
        }
      }
    });

  },

  send_btn: function (e) {
    var that = this

    console.log(1111);
    //检查手机号码是否正确
    if(!this.data.mobile){
      wx.showToast({
            title: '请输入手机号码！',
            icon: 'fail',
            duration: 2000
          })
          return;
    }

    if(!this.data.img){
      wx.showToast({
            title: '请输入图片验证码！',
            icon: 'fail',
            duration: 2000
          })
          return;
    }

    

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=Xiaochengxu&a=sendsms',
      data: {
        mobile: this.data.mobile,
        verifycode: this.data.img,
        tokenstr: app.globalData.tokenstr
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (request_data) {
        console.log(request_data.data)
        if (request_data.data.code == 1) {
          //console.log(1111);
          
          //将按钮设置为不可点击状态,同时显示倒计时
          //this.data.second = 60;
          //disabled="{{disabled}}"
          countdown(that);
          //that = !that;
          that.setData({
            disabled:true
          });
          //=====end======
          

          wx.showToast({
            title: request_data.data.msg,
            icon: 'success',
            duration: 5000
          })
          
        }
        else {
          wx.showToast({
            title: request_data.data.msg,
            icon: 'fail',
            duration: 5000
          });

          app.globalData.tokenstr = request_data.data.tokenstr;
          that.setData({
            img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=Xiaochengxu&a=getverifycodeimg' + '&tokenstr=' + request_data.data.tokenstr
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
  }
})