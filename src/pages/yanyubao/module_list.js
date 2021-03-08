// pages/user/user.js
var app = getApp();

Page( {
  data: {
    data: { status_count1: 0, status_count2: 0, status_count3: 0, status_count4: 0,},
    wxa_shop_nav_bg_color:'#008842',
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

       current_share_data:null
  },

  onLoad: function () {
    //  app.check_user_login()
    var that = this

    app.set_option_list_str(that, that.callback_function);

  },
  callback_function:function(that, option_list){
    
    if (!option_list){
      return;
    }

    app.getColor();

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

    console.log('背景颜色：' + option_list.wxa_shop_nav_bg_color);


    if (option_list.wxa_shop_nav_bg_color) {
      that.setData({
        wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color,
        icon_jump_bg_color: option_list.wxa_shop_nav_bg_color,
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



  },

  onShow: function () {

    

    

    //加载用户中心图标
    var that = this;

    var icon_list_usercenter = wx.getStorageSync("shop_icon_yanyubao_module_list" + app.get_sellerid());

    if (icon_list_usercenter){

      that.setData({
        icon_list_usercenter: icon_list_usercenter
      });

      return;
    }

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_icon_yanyubao_module_list',
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
            icon_list_usercenter: icon_list_usercenter.data,
            current_share_data : icon_list_usercenter.share_data
          });


          wx.setStorage({
            key: "shop_icon_yanyubao_module_list" + app.get_sellerid(),
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
  


 
 
 
  mytiaozhuan: function (e) {


    var url = e.currentTarget.dataset.url;
    console.log('user myChat准备跳转：' + url);

    var that = this;


    var var_list = Object();
    if (that.data.productid) {
      var_list.productid = that.data.productid;
    }

    app.call_h5browser_or_other_goto_url(url, var_list, 'user_index');



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
      key: 'shop_icon_yanyubao_module_list' + app.get_sellerid(),
      success(res) {
        that.onShow();

        //停止当前页面的下拉刷新
        wx.stopPullDownRefresh();


      }
    })
    
  },
  onShareAppMessage: function () {


    return {
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  onShareTimeline: function () {
    if(!this.data.current_share_data){
      return;
    }

    var that = this;
    
    return {
      title: '' + that.data.current_share_data.title,
      query: '', 
      imageUrl:that.data.current_share_data.image
    }
  },
  onAddToFavorites: function () {
    return this.onShareTimeline();
  },

})