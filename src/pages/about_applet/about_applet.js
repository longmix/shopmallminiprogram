// pages/about_applet/about_applet.js
var app = getApp();

Page({
  data:{
    telephone: '021-31128716',
    button_bg_color:'#179b16',
    button_font_color:'rgba(255,255,255, 0.6)',

    show_restYanyubaoData:0
  },
  onShow: function () {

  },
  onLoad:function(options){
    var _self = this;

    _self.setData({
      shop_name: app.globalData.shop_name,
      version_number: app.globalData.version_number,
      kefu_telephone: app.globalData.kefu_telephone,
      kefu_qq: app.globalData.kefu_qq,
      kefu_website: app.globalData.kefu_website,
      kefu_gongzhonghao: app.globalData.kefu_gongzhonghao
    });

    console.log("444444", _self.data.shop_name)
    console.log("444444", app.globalData.force_sellerid_flag);


    if(app.globalData.force_sellerid == 0){
      _self.setData({
        show_restYanyubaoData:1
      });
    }





    app.set_option_list_str(this, function(that, option_list){
      app.getColor();

      console.log('option_list=======>>>>', option_list);

      that.setData({
        button_bg_color:option_list.wxa_shop_nav_bg_color,
        button_font_color:option_list.wxa_shop_nav_font_color,
      });

      if(option_list.kefu_telephone){
        that.setData({
          kefu_telephone: option_list.kefu_telephone
        });
      }
      if(option_list.kefu_qq){
        that.setData({
          kefu_qq: option_list.kefu_qq
        });
      }
      if(option_list.kefu_website){
        that.setData({
          kefu_website: option_list.kefu_website
        });
      }
      if(option_list.kefu_gongzhonghao){
        that.setData({
          kefu_gongzhonghao: option_list.kefu_gongzhonghao
        });

      }

      
    });
    
    // 页面初始化 options为页面跳转所带来的参数

    app.get_shop_info_from_server(function (shop_list) {
      console.log('o2o/index get_shop_info_from_server 回调：');
      console.log(shop_list);

      _self.setData({
        shop_info_from_server: shop_list,
      });

    })

    

  },

  
  callTel: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.kefu_telephone
    })
  },
  callKefuQQ:function(){
    var that = this;

    wx.setClipboardData({
      data: that.data.kefu_qq,
    })

    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel:false,
      title:'客服QQ已复制',
      content:'打开QQ，搜索“'+ that.data.kefu_qq +'”添加好友即可'
    })
  },
  callKefuWebsite:function(){
    var that = this;

    wx.setClipboardData({
      data: that.data.kefu_website,
    })

    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel:false,
      title:'官方网址已经复制',
      content:'打开浏览器，输入“'+ that.data.kefu_website +'”访问'
    })
  },
  callKefuGongzhonghao:function(){
    var that = this;

    wx.setClipboardData({
      data: that.data.kefu_gongzhonghao,
    })

    wx.showModal({
      cancelColor: 'cancelColor',
      showCancel:false,
      title:'公众号名称已经复制',
      content:'打开手机微信，点击右上角选择“添加朋友”，类型“公众号”，输入“'+ that.data.kefu_gongzhonghao +'”。'
    })
  },




  useHelp: function () {
    wx.navigateTo({
      url: '../help/detail?action=detail&id=xiaochengxuhelp'
    });
  },
  shenMing:function(){
    wx.navigateTo({
      url: '../help/detail?action=detail&id=yinsishengming'
    });
  },
  clearStorage:function(){
    wx.removeStorage({
      key: 'shop_option_list_str_' + app.get_sellerid(),
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
  restYanyubaoData:function(){

    var _self = this;

    wx.removeStorage({
      key: 'current_sellerid',
      success(res) {
        wx.showToast({
          icon: 'none',
          title: '重置延誉宝数据成功',
        });

        app.globalData.default_sellerid = 'pQNNmSkaq';

        wx.reLaunch({
          url: '/pages/index/index',
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