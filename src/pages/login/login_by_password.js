// pages/check_login/check_login.js
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
    js_code: ''
  },





  btn_user_login: function (userinfo) {
    console.log('dfsdfsdfsdfsd',userinfo);
    console.log('getUserInfo button click, and get following msg');
    console.log(userinfo);
    if (!this.data.account) {
      wx.showToast({
        title: '请输入账号！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }
    if (!this.data.verifycode) {
      wx.showToast({
        title: '请输入图片验证码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '请输入密码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }
    //wx.login({}) // 现在，调用 wx.login 是一个可选项了。只有当你需要使用微信登录鉴别用户，才需要用到它，用来获取用户的匿名识别符
    if (userinfo.detail.errMsg == 'getUserInfo:ok') {

      //wx.request({}) // 将用户信息、匿名识别符发送给服务器，调用成功时执行 callback(null, res)
      var that = this;

      console.log('wx.login <<<==== btn_user_login <<<==== login_by_password');

      wx.login({
        success: function (res) {
          console.log(' btn_user_login wx.login return message');
          console.log(res);
          console.log(res.code);
          that.data.js_code = res.code;
          console.log(that.data.js_code);
          that.get_userinfo_ok_callback(userinfo, that.data.js_code);
        }
      });


    } else if (userinfo.detail.errMsg == 'getUserInfo:fail auth deny') { // 当用户点击拒绝时
      wx.showModal({}) // 提示用户，需要授权才能登录

    }
  },
  onShow: function () {

  },
  onLoad: function (options) {
    // console.log('dddddddd888', app.get_sellerid());
    app.set_option_list_str(null, app.getColor());
    
    var that = this;

    if (options.fromPage) {
      that.setData({
        fromPage: options.fromPage
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
        app.globalData.tokenstr = res.data.tokenstr;
        console.log(res.data.tokenstr);
        that.setData({
          img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=getverifycodeimg' + '&tokenstr=' + res.data.tokenstr
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

        app.globalData.tokenstr = res.data.tokenstr;

        that.setData({
          img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=getverifycodeimg' + '&tokenstr=' + res.data.tokenstr
        });

      }
    });

  },

  phoneInput: function (e) {
    //console.log('Phone=' + e.detail.value)
    this.data.account = e.detail.value;
  },

  imgInput: function (e) {
    //console.log('img=' + e.detail.value)
    this.data.verifycode = e.detail.value;
  },

  telInput: function (e) {
    //console.log('tel=' + e.detail.value)
    this.data.password = e.detail.value;
  },


  get_userinfo_ok_callback: function (userinfo, js_code) {
    var headimgurl = userinfo.detail.userInfo.avatarUrl
    wx.setStorage({
      key: 'key5',
      data: headimgurl,
      success: function (res) {
        console.log('异步保存成功')
      }
    })
    var that = this;
    //console.log(code+'hehe');
    console.log('dddddddd', app.get_sellerid());
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=login_by_password',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        tokenstr:app.globalData.tokenstr,
        appid: app.globalData.xiaochengxu_appid,
        account: that.data.account,
        password: that.data.password,
        verifycode: that.data.verifycode,
        sellerid: app.get_sellerid(),
        parentid: app.get_current_parentid(),

        formId: that.data.formId,

        js_code: js_code,
        iv: userinfo.detail.iv,
        encryptedData: userinfo.detail.encryptedData,
      },
      success: function (request_res) {
        console.log(4444444444444444444);
        console.log(request_res);

        var data = request_res.data;
        //var res = JSON.parse(data);
        //console.log(res);
        console.log(request_res.data);
        if (request_res.data && (request_res.data.code == 1)) {
          console.log("update_mobile : check_button : ");
          console.log('登录成功返回userid:' + request_res.data.userid);

          app.globalData.sellerid = app.get_sellerid();
          app.globalData.userInfo.user_openid = request_res.data.openid;
          app.globalData.userInfo.userid = request_res.data.userid;
          app.globalData.userInfo.checkstr = request_res.data.checkstr;

          //保存openid
          app.set_current_openid(request_res.data.openid);
          
          console.log('更新缓存的用户信息:');
          console.log(app.globalData.userInfo);
          
          app.set_user_info(app.globalData.userInfo);
          
          wx.showModal({
            title: '提示',
            content: request_res.data.msg,
            showCancel: false,
            success: function (res) {
              //console.log("回调结果"+res.code);
              if (res.confirm) {
                if (that.data.fromPage == 'share-detail') {
                  wx.navigateBack({
                    delta: 1
                  })
                }
                wx.switchTab({
                  url: '/pages/user/user'
                })
              }
            }
          });
        }
        else {
          console.log(request_res);
          wx.showToast({
            title: request_res.data.msg,
            icon: 'fail',
            duration: 2000
          });

          app.globalData.tokenstr = request_res.data.tokenstr;

          that.setData({
            img_checkcode_url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=getverifycodeimg' + '&tokenstr=' + request_res.data.tokenstr
          });

          //that.click_check();
        }

        console.log("延誉宝服务器解析jscode并返回以下内容：");
        console.log(request_res);
        // app.globalData.user_openid = request_res.data.openid;
        app.globalData.tokenstr = request_res.data.tokenstr;
      }
    });
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

    if (!this.data.account) {
      wx.showToast({
        title: '请输入账号！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }
    if (!this.data.verifycode) {
      wx.showToast({
        title: '请输入图片验证码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '请输入密码！',
        icon: 'fail',
        duration: 2000
      })
      return;
    }

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopApp&a=login',
      data: {
        mobile: that.data.mobile,
        verifycode: that.data.img,
        verifycode_sms: that.data.second,
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
          countdown(that);
          that.setData({
            disabled: true
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
  },


  //跳转到短信登录页面
  toLogin: function () {
    var that = this
    var url = 'login'
    if (that.data.fromPage) {
      url += '?fromPage=' + that.data.fromPage
    }
    wx.navigateTo({
      url: url,
    })
  }

  


})