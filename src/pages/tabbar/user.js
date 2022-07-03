// pages/tabbar/user.js
var app = getApp();

Page( {
  data: {
    data: { status_count1: 0, status_count2: 0, 
      status_count3: 0, 
      status_count4: 0,
      wxa_usercenter_ad_list:[]},

    wxa_shop_nav_bg_color:'red',
    wxa_shop_nav_font_color:'white',

    nick_name:0,
    headimgurl: "../../images/cry80.jpg",
    userInfo: {},
    orderInfo:{},
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

      //是否在昵称下方显示余额
      wxa_hide_balance_in_usercenter:0,
  },

  onLoad: function () {
    //  app.check_user_login()
    var that = this

    app.set_option_list_str(that, that.callback_function);
    
    //调用应用实例的方法获取全局数据
    var userInfo = app.get_user_info();



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

    

    if (userInfo == null) {
      that.setData({
        data: { status_count1: 0, status_count2: 0, status_count3: 0, status_count4: 0, },
        nick_name: 0,
        headimgurl: "../../images/cry80.jpg",
        nickname: null
      });
      return;
    }
    

    // wx.removeStorage({
    //   key: 'icon_list_usercenter_' + app.get_sellerid(),
    //   success(res) {
        
    //   }
    // })


  },
  callback_function: function (that, option_list) {

    if (!option_list) {
      return;
    }


    app.getColor();

    var option_list = app.globalData.option_list;

    if (option_list.wxa_login_only_weixin && option_list.wxa_login_only_weixin == 1) {
      that.setData({
        show_mobile_login: 1
      })
    }

    if (option_list.wxa_show_return_to_index_in_usercenter) {
      that.setData({
        wxa_show_return_to_index_in_usercenter: option_list.wxa_show_return_to_index_in_usercenter
      })
    }

    if (option_list.wxa_show_recharge_button_in_usercenter) {
      that.setData({
        wxa_show_recharge_button_in_usercenter: option_list.wxa_show_recharge_button_in_usercenter
      })
    }

    if(option_list.wxa_hide_balance_in_usercenter){
      
      

      that.setData({
        wxa_hide_balance_in_usercenter: option_list.wxa_hide_balance_in_usercenter
      });

      console.log('wxa_hide_balance_in_usercenter====>>>>'+ that.data.wxa_hide_balance_in_usercenter);
    }


    console.log('背景颜色：' + option_list.wxa_shop_nav_bg_color);

    if (option_list.wxa_shop_nav_bg_color) {
      that.setData({
        wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color,
      });
    }

    if (option_list.wxa_shop_nav_font_color) {
      that.setData({
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color,
      });
    }
    if (option_list.wxa_usercenter_function_list) {
      that.setData({
        wxa_usercenter_function_list: option_list.wxa_usercenter_function_list,
      });
    }

    if (option_list.wxa_usercenter_ad_list) {
      that.setData({
        wxa_usercenter_ad_list: option_list.wxa_usercenter_ad_list,
      });
    }

    if (option_list.wxa_show_zengkuan_in_usercenter) {
      that.setData({
        wxa_show_zengkuan_in_usercenter: option_list.wxa_show_zengkuan_in_usercenter,
      });
    }

    if (option_list.wxa_show_levelname_in_usercenter) {
      that.setData({
        wxa_show_levelname_in_usercenter: option_list.wxa_show_levelname_in_usercenter,
      });
    }

    if (option_list.wxa_hidden_order_index_in_usercenter) {
      that.setData({
        wxa_hidden_order_index_in_usercenter: option_list.wxa_hidden_order_index_in_usercenter,
      });
    }


    //===== 2021.11.13. 客服功能相关 =====
    if(option_list.usercenter_contact_status){
      that.setData({
        usercenter_contact_status : option_list.usercenter_contact_status,
      });

      if(option_list.usercenter_contact_btn_type){
        that.setData({
          usercenter_contact_btn_type : option_list.usercenter_contact_btn_type,
        });
      }
      if(option_list.usercenter_contact_btn_text){
        that.setData({
          usercenter_contact_btn_text : option_list.usercenter_contact_btn_text,
        });
      }
      if(option_list.usercenter_contact_btn_img){
        that.setData({
          usercenter_contact_btn_img : option_list.usercenter_contact_btn_img,
        });
      }

      //扩展的小程序卡片
      if(option_list.usercenter_contact_wxa_extend){
        that.setData({
          usercenter_contact_wxa_extend : option_list.usercenter_contact_wxa_extend,
        });

        if(option_list.usercenter_contact_wxa_title){
          that.setData({
            usercenter_contact_wxa_title : option_list.usercenter_contact_wxa_title,
          });
        }
        if(option_list.usercenter_contact_wxa_path){
          that.setData({
            usercenter_contact_wxa_path : option_list.usercenter_contact_wxa_path,
          });
        }
        if(option_list.usercenter_contact_wxa_img){
          that.setData({
            usercenter_contact_wxa_img : option_list.usercenter_contact_wxa_img,
          });
        }

      }
    }
    //=================== End ======================







    that.get_user_info_from_server();



  },
  onShow: function () {

    this.get_user_info_from_server();

    this.loadOrderStatus();

    //this.onLoad();


    

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

    var userInfo = app.get_user_info();
    if(!userInfo){
      that.setData({
        nick_name: ''
      })
      return;
    }


    if(userInfo.is_get_userinfo != 1){
      wx.showModal({
        title:'提示',
        content:'需要获取头像和昵称以继续',
        success: (res) => {
          if(res.confirm){
            wx.navigateTo({
              url: '/pages/login/login_get_userinfo'
            })
          }
          else{
            wx.showModal({
              title:'提示',
              content:'没有您的头像和昵称，个性化信息无法展示，是否不再提示？',
              success: (res02) => {
                if(res02.confirm){
                  app.globalData.userInfo.is_get_userinfo = 1;
                }
              }
            })
          }
        }
      })
      
    }




    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
      data: {
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        xiaochengxu_appid: app.globalData.xiaochengxu_appid,
        xiaochengxu_openid: app.get_current_openid(),
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log('ddd', res);
        // console.log('ddd', res.data.code);

        if(res.data.code == 1){
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
    var last_url = 'switchTab /pages/tabbar/user';

    if(app.goto_user_login(last_url)){
      return;
    }
    
    //如果需要用户授权头像和昵称
    if(app.goto_get_userinfo(last_url)){
      return;
    }
    
    var currenttab = e.currentTarget.dataset.currenttab;
    var otype = e.currentTarget.dataset.otype;
    var url = "../user/dingdan?currentTab=" + currenttab + "&otype=" + otype;
    wx.navigateTo({
      url: url,
    })

  },


 
 
 
  mytiaozhuan: function (e) {


    var url = e.currentTarget.dataset.url;
    console.log('user myChat准备跳转：' + url);

    
    var last_url = 'switchTab /pages/tabbar/user?retpage=' + encodeURIComponent(url);

    if(app.goto_user_login(last_url)){
      return;
    }
   

    var that = this;


    var var_list = Object();
    if (that.data.productid) {
      var_list.productid = that.data.productid;
    }

    app.call_h5browser_or_other_goto_url(url, var_list, 'user_index');

    return;



  },

  toUrl:function(url){
    if(url.length > 0){
      app.call_h5browser_or_other_goto_url(url);
      
    }
    return;
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
          /*wx.showToast({
            title: '非法操作.',
            duration: 2000
          });*/
          console.log('获取订单列表失败：', res);
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
  },

  onPullDownRefresh: function () {
    console.log('下拉刷新==============')

    var that = this;
  
    wx.removeStorage({
      key: 'icon_list_usercenter_' + app.get_sellerid(),
      success(res) {

      }
    })

    app.set_option_list_str(that, that.callback_function);

    that.onShow();

    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();

  }

})