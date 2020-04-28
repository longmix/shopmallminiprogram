// pages/user/user.js
var app = getApp();
//var userInfo = app.get_user_info();

Page( {
  data: {
    data: { status_count1: 0, status_count2: 0, status_count3: 0, status_count4: 0,},
    wxa_shop_nav_bg_color:'#008842',
    nick_name:0,
    headimgurl: "../../images/cry80.jpg",
    userInfo: {},
    orderInfo:{},
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo: [ {
        icon: '../../images/iconfont-dingdan.png',
        text: '我的订单',
        isunread: true,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-card.png',
        text: '我的代金券',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-icontuan.png',
        text: '我的拼团',
        isunread: true,
        unreadNum: 1
      }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址管理'
      }, {
        icon: '../../images/iconfont-kefu.png',
        text: '联系客服'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '常见问题'
      }],
       loadingText: '加载中...',
       loadingHidden: false,
  },

  onLoad: function () {
    //  app.check_user_login()
    var that = this

    app.set_option_list_str(null, app.getColor());
    
    //调用应用实例的方法获取全局数据
    var userInfo = app.get_user_info();


    var option_list = app.globalData.option_list;

    if (option_list.wxa_login_only_weixin && option_list.wxa_login_only_weixin == 1) {
      that.setData({
        show_mobile_login: 1
      })
    }

    if (option_list.wxa_show_return_to_index_in_usercenter){
      that.setData({
        wxa_show_return_to_index_in_usercenter: option_list.wxa_show_return_to_index_in_usercenter
      })
    }

    if (option_list.wxa_show_recharge_button_in_usercenter) {
      that.setData({
        wxa_show_recharge_button_in_usercenter: option_list.wxa_show_recharge_button_in_usercenter
      })
    }
   

    if (option_list.wxa_shop_nav_bg_color) {
      that.setData({
        icon_jump_bg_color: option_list.wxa_shop_nav_bg_color,
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color,

      });
    }

    if(app.globalData.is_o2o_app == 1){
       wx.hideTabBar({
        success: function (e) {
          console.log('removeTabBarBadgesuccess',e)
        },
        fail: function (e) {
          console.log('removeTabBarBadgefail', e)
        }
      })
    }
    /*
    wx.getStorage({
      key: 'key5',
      success: function (res) {
        that.setData({
          headimgurl: res.data
        })
      }
    }) 
    */
    

    if (userInfo == null) {
      that.setData({
        data: { status_count1: 0, status_count2: 0, status_count3: 0, status_count4: 0, },
        nick_name: 0,
        headimgurl: "../../images/cry80.jpg",
        nickname: null
      });
      return;
    }
    

    wx.removeStorage({
      key: 'icon_list_usercenter_' + app.get_sellerid(),
      success(res) {
        
      }
    })


  },

  onShow: function () {
    var userInfo = app.get_user_info();

    this.get_user_info_from_server();

    this.loadOrderStatus();

    //this.onLoad();


    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '333333333');

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    console.log('背景颜色：' + option_list.wxa_shop_nav_bg_color);

    if (option_list.wxa_shop_nav_bg_color){
      this.setData({
        wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color,
      });
    }

    if (option_list.wxa_shop_nav_font_color) {
      this.setData({
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color,
      });
    }
    if (option_list.wxa_usercenter_function_list) {
      this.setData({
        wxa_usercenter_function_list: option_list.wxa_usercenter_function_list,
      });
    }
    if (option_list.wxa_show_zengkuan_in_usercenter) {
      this.setData({
        wxa_show_zengkuan_in_usercenter: option_list.wxa_show_zengkuan_in_usercenter,
      });
    }

    if (option_list.wxa_show_levelname_in_usercenter) {
      this.setData({      
        wxa_show_levelname_in_usercenter: option_list.wxa_show_levelname_in_usercenter,
      });
    }
    
    if (option_list.wxa_hidden_order_index_in_usercenter) {
      this.setData({
        wxa_hidden_order_index_in_usercenter: option_list.wxa_hidden_order_index_in_usercenter,
      });
    }

    //加载用户中心图标
    var that = this;

    var icon_list_usercenter = wx.getStorageSync("icon_list_usercenter_" + app.get_sellerid());

    if (icon_list_usercenter){

      that.setData({
        icon_list_usercenter: icon_list_usercenter
      });

      return;
    }

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_icon_usercenter',
      method: 'post',
      data: {
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var icon_list_usercenter = res.data;
        console.log('icon_list_usercenter====', icon_list_usercenter);
        if (res.data.code == 1) {
          for (var i = 0; i < icon_list_usercenter.data.length; i++) {
            if (icon_list_usercenter.data[i].url.slice(0, 4) == 'http') {
              icon_list_usercenter.data[i]['toPage'] = 1
            } else {
              icon_list_usercenter.data[i]['toPage'] = 0
            }
          }

          console.log('icon_list_usercenter2====', icon_list_usercenter);

          that.setData({
            icon_list_usercenter: icon_list_usercenter.data
          });


          wx.setStorage({
            key: "icon_list_usercenter_" + app.get_sellerid(),
            data: icon_list_usercenter.data,
            success: function (res) {
              console.log('icon_list_usercenter 异步保存成功')
            }});
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

  },
  
  get_user_info_from_server:function(){
    var that = this;
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    var userInfo = app.get_user_info();
    if(!userInfo){
      // var last_url = '/pages/user/user';
      // app.goto_user_login(last_url, 'switchTab');
      // app.goto_get_userinfo(last_url, 'switchTab');
      that.setData({
        nick_name: ''
      })
      return;
    }

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
      data: {
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        appid: app.globalData.xiaochengxu_appid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log('ddd', res);
        // console.log('ddd', res.data.code);

        if (res.data.code == "-1") {
          var last_url = '/pages/user/user';
          app.goto_user_login(last_url, 'switchTab');
          
        } else {
          var data = res.data
          var data2 = data.data
          var headimgurl = data.data.headimgurl
          var nickname = data.data.fenxiao_info.nickname
          console.log(headimgurl);
          that.setData({
            headimgurl: headimgurl,
            nickname: nickname,
            nick_name: 1,
            data: data2
          });
        }

      }
    })

  },

  myDingdan: function (e) {
    var last_url = '/pages/user/user';
    app.goto_user_login(last_url, 'switchTab');
    app.goto_get_userinfo(last_url, 'switchTab');
    
    var currenttab = e.currentTarget.dataset.currenttab;
    var otype = e.currentTarget.dataset.otype;
    var url = "../user/dingdan?currentTab=" + currenttab + "&otype=" + otype;
    wx.navigateTo({
      url: url,
    })

  },


 
 
 
  mytiaozhuan: function (e) {

    var last_url = '/pages/user/user';
    app.goto_user_login(last_url, 'switchTab');
    //app.goto_get_userinfo(last_url, 'switchTab');

    var that = this;


    var var_list = Object();
    if (that.data.productid) {
      var_list.productid = that.data.productid;
    }

    var url = e.currentTarget.dataset.url;
    console.log('user myChat准备跳转：' + url);


    if (url.indexOf("%oneclicklogin%") != -1) {

      var userInfo = app.get_user_info();

      if (!userInfo) {
        var last_url = '/pages/user/user';
        app.goto_user_login(last_url, 'switchTab');

        return;
      }

      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=one_click_login_str',
        method: 'post',
        data: {
          sellerid: app.get_sellerid(),
          checkstr: userInfo.checkstr,
          userid: userInfo.userid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data        
          var code = res.data.code;
          if (code == 1) {
            var oneclicklogin = res.data.oneclicklogin;

            console.log('ddddd+++++', oneclicklogin);

            that.setData({
              oneclicklogin: oneclicklogin
            })
            url = url.replace('%oneclicklogin%', that.data.oneclicklogin);

            if (url.indexOf("%ensellerid%") != -1) {
              url = url.replace('%ensellerid%', app.get_sellerid());
            }

            app.call_h5browser_or_other_goto_url(url, var_list, 'user_index');

            return;

          } else {
            wx.showToast({
              title: '非法操作.',
              duration: 2000
            });
          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });

      return;

    };

    app.call_h5browser_or_other_goto_url(url, var_list, 'user_index');


  },

  loadOrderStatus:function(){
    //获取用户订单数据
    var that = this;
    var userInfo = app.get_user_info();
    if(userInfo){
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_index',
      method:'post',
      data: {
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var code = res.data.code;
        if(code==1){
          var orderInfo = res.data.orderList;
          console.log(orderInfo);
          that.setData({
            orderInfo: orderInfo
          });
        }else{
          wx.showToast({
            title: '非法操作.',
            duration: 2000
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
    }
  },


    //跳转首页
  toPageIndex:function(e){
    if (app.globalData.is_o2o_app==1){

      wx.redirectTo({
        url:'/pages/index/Liar'
      })
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },

  //跳转个人资料
  toUserInfo:function(e){
    wx.navigateTo({
      url: '/pages/userinfo/userinfo',
    })
  }

})