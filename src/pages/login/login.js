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
      shop_icon:''
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
    tokenstr :'',
    show_mobile_login:0
  },





  btn_user_login: function (userinfo) {
    console.log('getUserInfo button click, and get following msg');
    console.log(userinfo);
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
    //wx.login({}) // 现在，调用 wx.login 是一个可选项了。只有当你需要使用微信登录鉴别用户，才需要用到它，用来获取用户的匿名识别符
    if (userinfo.detail.errMsg == 'getUserInfo:ok') {

      //wx.request({}) // 将用户信息、匿名识别符发送给服务器，调用成功时执行 callback(null, res)
      var that = this;

      console.log('wx.login <<<==== btn_user_login');

      wx.login({
        success: function (res) {
          console.log('btn_user_login wx.login return message');
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
    app.set_option_list_str(null, app.getColor());
    
    var that = this;
    console.log('app.globalData.option_list', app.globalData.option_list)
    var option_list = app.globalData.option_list;

    if (option_list.wxa_login_only_weixin && option_list.wxa_login_only_weixin == 1){
      that.setData({
        show_mobile_login: 1
      })
    }

    if (option_list.wxa_shop_nav_bg_color){
      that.setData({
        icon_jump_bg_color: option_list.wxa_shop_nav_bg_color,
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color,
        
      });
    }

 

    //countdown(that);

    if(options.fromPage){
      that.setData({
        fromPage: options.fromPage
      })
    }

    app.get_shop_info_from_server(function (shop_list) {
      console.log('o2o/index get_shop_info_from_server 回调：');
      console.log(shop_list);

      that.setData({
        shop_list: shop_list,
      });

    })

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

    // wx.getStorage({
    //   key: 'userListInfo',
    //   success: function (res) {
    //     if (res.data) {
    //       console.log(res.data[2].content);
    //       that.setData({
    //         mobile: res.data[2].content,

    //       });
    //     }

    //   }
    // })

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
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=login',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { 
        appid: app.globalData.xiaochengxu_appid,      
        mobile: that.data.mobile,
        verifycode_sms: that.data.tel,
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
        if (request_res.data && (request_res.data.code == 1)){
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

                //=======检查登录成功之后的跳转=======
                var last_url = wx.getStorageSync('last_url');

                console.log('last_url-----', last_url)

                var page_type = wx.getStorageSync('page_type');
                if (last_url) {
                  if (page_type && (page_type == 'switchTab')) {

                    wx.switchTab({
                      url: last_url,
                    })
                  }
                  else {
                    wx.redirectTo({
                      url: last_url,
                    })
                  }

                  wx.removeStorageSync('last_url');
                  wx.removeStorageSync('page_type');

                  return;
                }
                //===========End================

                if (app.globalData.is_ziliaoku_app == 1) {

                  wx.reLaunch({
                    url: "/cms/index/index"
                  });

                  return;
                }
                
                if(that.data.fromPage == 'share-detail'){
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
            title: '登录失败',
            icon: 'fail',
            duration: 2000
          });
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
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=sendsms',
      data: {
        mobile: that.data.mobile,
        verifycode: that.data.img,
        sellerid: app.get_sellerid(),
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

        }else {
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

  btn_one_click_login: function (e) {
    var that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)

    console.log('wx.login <<<==== btn_one_click_login');

    wx.login({
      success: function (res) {
        console.log("btn_one_click_login 获取到的jscode是:" + res.code);

        //如果拒绝授权， e.detail.errMsg
        //console.log(e.detail.errMsg);return;

        wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=wxa_one_click_login',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          dataType: 'json',
          data: {
            js_code: res.code,
            xiaochengxu_appid: app.globalData.xiaochengxu_appid,
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            sellerid: app.get_sellerid(),
            parentid: app.get_current_parentid(),

            //uwid: app.globalData.userInfo.uwid,
            //checkstr: app.globalData.userInfo.checkstr,
            // userid: app.globalData.userInfo.userid
          },
          success: function (res) {
            console.log(res);

            if (res.data && (res.data.code == 1)) {
              //更新checkstr和uwid，
              app.globalData.userInfo.userid = res.data.userid;
              //app.globalData.userInfo.checkstr = res.data.checkstr;

              console.log('一键登录成功，userid:' + res.data.userid);

              app.globalData.sellerid = app.get_sellerid();
              app.globalData.userInfo.user_openid = res.data.openid;
              app.globalData.userInfo.userid = res.data.userid;
              app.globalData.userInfo.checkstr = res.data.checkstr;
              app.globalData.userInfo.is_get_userinfo = res.data.is_get_userinfo;

              //保存openid
              app.set_current_openid(res.data.openid);

              console.log(app.globalData.userInfo);

              app.set_user_info(app.globalData.userInfo);

              //跳转到指定页面
              //var last_url = app.get_last_url();
              //console.log(last_url);


              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })

              //=======检查登录成功之后的跳转=======
              var last_url = wx.getStorageSync('last_url');

              console.log('last_url-----', last_url)
              var page_type = wx.getStorageSync('page_type');
              if (last_url) {
                if (page_type && (page_type == 'switchTab')) {
                  wx.switchTab({
                    url: last_url,
                  })
                }
                else{
                  wx.redirectTo({
                    url: last_url,
                  })
                }

                wx.removeStorageSync('last_url');
                wx.removeStorageSync('page_type');

                return;

              }

              if (app.globalData.is_ziliaoku_app == 1) {

                wx.reLaunch({
                  url: "/cms/index/index"
                });

                return;
              }
              //===================End===========


              if (that.data.fromPage == 'share-detail') {
                wx.navigateBack({
                  delta: 1
                })
              }

              wx.switchTab({
                url: '/pages/user/user'
              })

              
            }
            else {
              //一键登录返回错误代码
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel:false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })


            }
          }
        });

      },
      fail: function (login_res) {
        console.log('login.js  wx.login失败。');
      }

    });
  },

//跳转到账号密码登录页面
  toLoginByPassword: function () {
    var that = this
    var url = 'login_by_password'
    if (that.data.fromPage) {
      url += '?fromPage=' + that.data.fromPage
    }
    wx.navigateTo({
      url: url,
    })
  },


  //跳转首页
  toPageIndex:function(e){
    wx.redirectTo({
      url: '/pages/index/Liar',
    })
  }


})