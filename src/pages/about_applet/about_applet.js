// pages/about_applet/about_applet.js
var app = getApp();
Page({
  data:{
    telephone: '021-31128716'
  },
  onShow: function () {

  },
  onLoad:function(options){
    app.set_option_list_str(null, app.getColor());
    
    // 页面初始化 options为页面跳转所带来的参数
    var that = this

    app.get_shop_info_from_server(function (shop_list) {
      console.log('o2o/index get_shop_info_from_server 回调：');
      console.log(shop_list);

      that.setData({
        shop_info_from_server: shop_list,
      });

    })

    that.setData({
      shop_name: app.globalData.shop_name,
      version_number: app.globalData.version_number,
      kefu_telephone: app.globalData.kefu_telephone,
      kefu_qq: app.globalData.kefu_qq,
      kefu_website: app.globalData.kefu_website,
      kefu_gongzhonghao: app.globalData.kefu_gongzhonghao
    });

    console.log("444444", that.data.shop_name)

  },

  
  callTel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.kefu_telephone
    })
  },
  useHelp: function () {
    wx.navigateTo({
      url: '../help_detail/help_detail?action=detail&id=xiaochengxuhelp'
    });
  },
  shenMing:function(){
    wx.navigateTo({
      url: '../help_detail/help_detail?action=detail&id=yinsishengming'
    });
  },
  clearStorage:function(){
    wx.removeStorage({
      key: 'option_list_str',
      success(res) {
        wx.showToast({
          icon: 'none',
          title: '清除成功',
        })
      }
    })

    wx.removeStorage({
      key: 'shop_info_from_server_str_' + app.get_sellerid(),
      success(res) {
        wx.showToast({
          icon: 'none',
          title: '清除成功',
        })
      }
    })

    wx.removeStorage({
      key: 'icon_list_usercenter_' + app.get_sellerid(),
      success(res) {
        wx.showToast({
          icon: 'none',
          title: '清除成功',
        })
      }
    })
    
       
    
  },
  onReady:function(){
    // 页面渲染完成
  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})