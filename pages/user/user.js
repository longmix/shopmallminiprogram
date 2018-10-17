// pages/user/user.js
var app = getApp();
var userInfo = app.get_user_info();
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
  onShow: function () {
    this.loadOrderStatus();
    this.onLoad();
    app.getColor();

    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '333333333');

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    console.log('背景颜色：' + option_list.wxa_shop_nav_bg_color);

    this.setData({
      wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color
    });



  },
  
  onLoad: function () {
      //  app.check_user_login()
      var that = this
      //调用应用实例的方法获取全局数据
      var userInfo = app.get_user_info();
      console.log(userInfo +'userInfo,userInfo,userInfo');
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
      if (userInfo==null){
        that.setData({
          data: { status_count1: 0, status_count2: 0, status_count3: 0, status_count4: 0, },
          nick_name: 0,
          headimgurl: "../../images/cry80.jpg",
          nickname: null
        });
        return;
      }
      if(userInfo){
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
        data: {
          sellerid: app.get_sellerid(),
          checkstr: userInfo.checkstr,
          userid: userInfo.userid
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          var data = res.data
          var data2 = data.data
          var headimgurl = data.data.headimgurl
          var nickname = data.data.nickname
          console.log(headimgurl);
          that.setData({
            headimgurl: headimgurl,
            nickname: nickname,
            nick_name:1,
            data:data2
          });
        }
      }) 
      }



      

  },
  myChat: function (e) {
    var userInfo = app.get_user_info();
    if ((!userInfo) || (!userInfo.userid)) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    };
    var that = this;
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
          that.setData({
            oneclicklogin: res.data.oneclicklogin
          });
          console.log(that.data.oneclicklogin);
          var id = e.currentTarget.dataset.id;
          if (id == 18) {
            var url = 'https://yanyubao.tseo.cn/Home/OnlineChat/chat.html?ensellerid=' + app.get_sellerid() + '&oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 1) {
            console.log(that.data.oneclicklogin);
            var url = 'https://yanyubao.tseo.cn/User/agent_income.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 2) {
            var url = 'https://yanyubao.tseo.cn/User/my_balance_zengsong.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 3) {
            var url = 'https://yanyubao.tseo.cn/User/score.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 4) {
            var url = 'https://yanyubao.tseo.cn/Distributor/fenxiao.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 5) {
            var url = 'https://yanyubao.tseo.cn/Distributor/yaoqing_xiangqing.html?oneclicklogin=' +that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 6) {
            var url = 'https://yanyubao.tseo.cn/Distributor/agent_product.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 7) {
            var url = 'https://yanyubao.tseo.cn/User/ticket_index.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          }
          else if (id == 7) {
            var url = 'https://yanyubao.tseo.cn/User/ticket_index.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 8) {
            var url = 'https://yanyubao.tseo.cn/User/wanshan_alipayinfo.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 9) {
            var url = 'https://yanyubao.tseo.cn/User/wanshan_bankinfo.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 10) {
            var url = 'https://yanyubao.tseo.cn/User/fapiao_list.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          } else if (id == 11) {
            var url = 'https://yanyubao.tseo.cn/Youhui/youhui_list.html?oneclicklogin=' + that.data.oneclicklogin;
            wx.navigateTo({
              url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
            });
            return;
          }
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
})