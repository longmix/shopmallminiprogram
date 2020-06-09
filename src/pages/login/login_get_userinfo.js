// pages/check_login/check_login.js
var app = getApp();



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


  onShow: function () {

  },
  onLoad: function (options) {
    app.set_option_list_str(null, app.getColor());
    
    var that = this;

    app.get_shop_info_from_server(function (shop_info_list) {
      that.setData({
        shop_list: shop_info_list,
      });
    });

    

    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight
        })

      }
    })

    console.log('options', options)

    if(options.retpage){
      //var url = 'http://192.168.0.87:8080/chouheji/pages/chouheji/chouheji_index?sellerid=%ensellerid%&openid=%wxa_openid%';
      that.setData({
        retpage: '/pages/h5browser/h5browser?url=' + options.retpage
      })
    }

  },




  btn_one_click_get_userinfo: function (e) {
    var that = this;
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    
    console.log('one_click_get_userinfo', e);
    console.log('wx.login <<<==== btn_one_click_login');

    wx.login({
      success: function (res) {
        console.log("btn_one_click_login 获取到的jscode是:" + res.code);


        wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=wxa_get_userinfo',
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
          },
          success: function (res) {
            console.log(res);

            if (res.data && (res.data.code == 1)) {
          

              console.log('一键获取头像和昵称成功' + res.data.userid);


              
              app.globalData.userInfo.is_get_userinfo = 1;
              app.set_user_info(app.globalData.userInfo); 


              wx.showToast({
                title: '授权成功',
                icon: 'success',
                duration: 2000
              })

              var last_url = wx.getStorageSync('last_url');

              console.log('last_url-----', last_url)
              var page_type = wx.getStorageSync('page_type');

              if(that.data.retpage){
                last_url = that.data.retpage
                console.log('last_url===================1111', last_url)
                app.call_h5browser_or_other_goto_url(last_url);
                return;

                // wx.navigateTo({
                //   url: last_url,
                // })
              }


              if (last_url) {
                if (page_type == 'switchTab') {

                  wx.switchTab({
                    url: last_url,
                  })
                  
                }else{
                
                  wx.navigateBack({
                    delta: 1
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
        console.log('一键获取用户头像和昵称失败。');
      }

    });
  },




})