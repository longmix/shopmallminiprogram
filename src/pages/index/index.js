var app = getApp();
var next_page = 1;

Page({ 
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    proCat:[],
    page: 1,
    index: 2,
    brand:[],
    // 滑动
    imgUrl: [],
    kbs:[],
    lastcat:[],
    course:[],

    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0
  },
//跳转商品列表页   
listdetail:function(e){
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title='+e.currentTarget.dataset.title,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
//跳转商品搜索页  
suo:function(e){
    wx.navigateTo({
      url: '/pages/order/pay?action=direct_buy&productid=3969&amount=1&jiantuanid=0&buynow_direct_amount=1&cuxiao_type=duorenpintuan&price_type=1',
    })
  },

//点击加载更多
getMore:function(e){
  var that = this;
  var page = that.data.page;
  next_page++;

  var userInfo = app.get_user_info();

  wx.request({
      url: app.globalData.http_server+ '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: { 
        sellerid: app.get_sellerid(), 
        page: next_page,
        userid: userInfo ? userInfo.userid : 0,
        },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
<<<<<<< HEAD
        console.log("aaafff",res);
=======
        console.log("111222",res);
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
        var prolist = res.data.product_list;
        /*
            wx.setStorage({  
             key: "student",  
             data: res.data  
           }) 
           */
        if(prolist==''){
          wx.showToast({
            title: '我也是有底线的！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        console.log("555666",that.data.product_list);
        that.setData({
          page: page+1,
          product_list: that.data.product_list.concat(prolist)
        });
        //endInitData
      },
      fail:function(e){
        console.log("22222");
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
},
  initArticleList: function () {

    var that = this


    //=====更新商户头条=================
    var url = app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=yingxiao';//+ app.globalData.sellerid;
    var data = {
      id: 'seller',
      action: 'list',
      sellerid: app.get_sellerid(),
      currentpage: 1
    };

    var cbError = function (res) {

    };
    app.httpPost(url, data, this.articleBack, cbError);
    //========End====================

  },
  articleBack: function (res) {
    console.log(res);

    let _this = this
    if (res.data.code == '1') {
      app.set_current_weiduke_token(res.data.token);
      
      //为显示加载动画添加3秒延时
      setTimeout(function () {
        _this.setData({
          articlelist: res.data.data,
          loading: !_this.data.loading,
        })
      }, 500)

      if (_this.data.wxa_shop_toutiao_flash_line == 2) {
        var data = res.data.data;
        var articlelist2 = [];
        for (var i = 0, length = data.length -1; i < (length / 2); i++) {
          var arr = [data[0], data[1]];
          articlelist2.push(arr);
          data.shift()
          data.shift()
        }
        _this.setData({
          articlelist2: articlelist2,

        })
      }
    }
    else {
      //没有获取数据

    }
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  onShow:function(){
    
<<<<<<< HEAD
    
=======
    this.loadInfo();
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    // this.getShopOptionAndRefresh(this, 0);
    
  },
  getShopOptionAndRefresh: function (that, cb_params) {
    //var that = this;

    console.log('getShopOptionAndRefresh+++++:::'+cb_params)

    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '333333333');

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    if (!option_list){
      return;
    }

    if (option_list.wxa_shop_toutiao_icon) {
        that.setData({
          wxa_shop_toutiao_icon: option_list.wxa_shop_toutiao_icon
        })
      }
<<<<<<< HEAD
    if (option_list.wxa_show_kucun_in_list) {
      that.setData({
        wxa_show_kucun_in_list: option_list.wxa_show_kucun_in_list
      })
    }
    if (option_list.wxa_show_icon_index_count){
      that.setData({
        icon_count: option_list.wxa_show_icon_index_count
      });
    }
    if (option_list.wxa_show_index_icon) {
      that.setData({
        wxa_show_index_icon: option_list.wxa_show_index_icon
      });
    }
    if (option_list.wxa_show_index_swiper) {
      that.setData({
        wxa_show_index_swiper: option_list.wxa_show_index_swiper
      });
    }
    if (option_list.wxa_show_pic_pinpu) {
      that.setData({
        wxa_show_pic_pinpu: option_list.wxa_show_pic_pinpu
      });
    }
    if (option_list.wxa_show_search_input) {
      that.setData({
        wxa_show_search_input: option_list.wxa_show_search_input
      });
    }
    if (option_list.wxa_show_toutiao) {
      that.setData({
        wxa_show_toutiao: option_list.wxa_show_toutiao
      });
    }
    if (option_list.wxa_show_video_player) {
      that.setData({
        wxa_show_video_player: option_list.wxa_show_video_player
      });
    }
    if (option_list.wxa_video_player_url) {
      that.setData({
        wxa_video_player_url: option_list.wxa_video_player_url
      });
    }
    if (option_list.wxa_video_screen_url) {
      that.setData({
        wxa_video_screen_url: option_list.wxa_video_screen_url
      });
    }
    if (option_list.wxa_shop_toutiao_flash_line) {
      that.setData({
        wxa_shop_toutiao_flash_line: option_list.wxa_shop_toutiao_flash_line
      });
    }

    if (option_list.wxa_hidden_product_list) {
      that.setData({
        wxa_hidden_product_list: option_list.wxa_hidden_product_list
=======

    if (option_list.wxa_show_icon_index_count){
      that.setData({
        icon_count: option_list.wxa_show_icon_index_count
      });
    }
    if (option_list.wxa_show_index_icon) {
      that.setData({
        wxa_show_index_icon: option_list.wxa_show_index_icon
      });
    }
    if (option_list.wxa_show_index_swiper) {
      that.setData({
        wxa_show_index_swiper: option_list.wxa_show_index_swiper
      });
    }
    if (option_list.wxa_show_pic_pinpu) {
      that.setData({
        wxa_show_pic_pinpu: option_list.wxa_show_pic_pinpu
      });
    }
    if (option_list.wxa_show_search_input) {
      that.setData({
        wxa_show_search_input: option_list.wxa_show_search_input
      });
    }
    if (option_list.wxa_show_toutiao) {
      that.setData({
        wxa_show_toutiao: option_list.wxa_show_toutiao
      });
    }
    if (option_list.wxa_shop_toutiao_flash_line) {
      that.setData({
        wxa_shop_toutiao_flash_line: option_list.wxa_shop_toutiao_flash_line
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
      });
    }

    if (option_list.wxa_kefu_button_type) {
      that.setData({
        wxa_kefu_button_type: option_list.wxa_kefu_button_type
      });
    }

    if (option_list.wxa_kefu_button_icon) {
      that.setData({
        wxa_kefu_button_icon: option_list.wxa_kefu_button_icon
      });
    }

<<<<<<< HEAD
    if (option_list.wxa_kefu_mobile_num) {
=======
    if (option_list.wxa_kefu_button_icon) {
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
      that.setData({
        wxa_kefu_mobile_num: option_list.wxa_kefu_mobile_num
      });
    }

    if (option_list.wxa_kefu_form_url) {
      that.setData({
        wxa_kefu_form_url: option_list.wxa_kefu_form_url
      });
    }

    if (option_list.wxa_show_kefu_button) {
      that.setData({
        wxa_show_kefu_button: option_list.wxa_show_kefu_button
      });
    }

    if (option_list.wxa_kefu_bg_color) {
      that.setData({
        wxa_kefu_bg_color: option_list.wxa_kefu_bg_color
      });
    }
<<<<<<< HEAD


    // that.setData({
    //   wxa_kefu_button_type: option_list.wxa_kefu_button_type,
    //   wxa_kefu_button_icon: option_list.wxa_kefu_button_icon,
    //   wxa_kefu_mobile_num: option_list.wxa_kefu_mobile_num,
    //   wxa_kefu_form_url: option_list.wxa_kefu_form_url,
    //   wxa_show_kefu_button: option_list.wxa_show_kefu_button,
    //   wxa_kefu_bg_color: option_list.wxa_kefu_bg_color
    // })
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e


    // that.setData({
    //   wxa_kefu_button_type: option_list.wxa_kefu_button_type,
    //   wxa_kefu_button_icon: option_list.wxa_kefu_button_icon,
    //   wxa_kefu_mobile_num: option_list.wxa_kefu_mobile_num,
    //   wxa_kefu_form_url: option_list.wxa_kefu_form_url,
    //   wxa_show_kefu_button: option_list.wxa_show_kefu_button,
    //   wxa_kefu_bg_color: option_list.wxa_kefu_bg_color
    // })



    
    // if (option_list.wxa_shop_nav_font_color && option_list.wxa_shop_nav_bg_color) {
    //   wx.setNavigationBarColor({
    //     frontColor: option_list.wxa_shop_nav_font_color,
    //     backgroundColor: option_list.wxa_shop_nav_bg_color,
    //     animation: {
    //       duration: 0,
    //       timingFunc: 'easeIn'
    //     }
    //   });
    // }
    
    app.getColor();

    
    // if (option_list.wxa_shop_nav_font_color && option_list.wxa_shop_nav_bg_color) {
    //   wx.setNavigationBarColor({
    //     frontColor: option_list.wxa_shop_nav_font_color,
    //     backgroundColor: option_list.wxa_shop_nav_bg_color,
    //     animation: {
    //       duration: 0,
    //       timingFunc: 'easeIn'
    //     }
    //   });
    // }
    
    

  },
  
<<<<<<< HEAD
  onPullDownRefresh: function () {   
    console.log('下拉刷新==============')

    var that = this;

    try {
      wx.removeStorageSync('option_list_str')
    } catch (e) {
      // Do something when catch error
    }

    try {
      wx.removeStorageSync('shop_info_from_server_str_' + app.get_sellerid())
    } catch (e) {
      // Do something when catch error
    }

    
    that.onLoad();

    that.onShow();

    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();
    
  },
  onLoad: function (options) {
=======
  onPullDownRefresh: function () {
    this.onLoad();
    this.onShow();
    console.log('下拉刷新==============')
    // app.set_option_list_str(this, this.getShopOptionAndRefresh);
    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();
  },
  onLoad: function (options) {
    this.loadImg();
    this.loadIcon();

    this.initArticleList();

    //this.getShopOptionAndRefresh();

>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

    var that = this;

    //console.log(encodeURIComponent('https://yanyubao.tseo.cn/wxa/?sellerid=pQNNmSkaq'));
    //console.log(decodeURIComponent(encodeURIComponent('https://yanyubao.tseo.cn/wxa/?sellerid=pQNNmSkaq')));return;

    //请求服务器,刷新卡券信息
    console.log('网页参数如下:');
    console.log(options); //console.log(options.sellerid);

    var sellerid = null;
   // var q = options.q;
/* 来自二维码的扫描，在延誉宝会员卡小程序中用到，通版商城不需要
    
    
    //q = 'https%3A%2F%2Fyanyubao.tseo.cn%2Fwxa%2F%3Fsellerid%3DpXzizSkVa';

    //console.log(typeof(q));
    if (typeof (q) != 'undefined') {
      console.log('获取到带参二维码参数q：' + q);
      q = decodeURIComponent(q);
      console.log('decodeURI转码后的q：' + q);

      sellerid = q.replace('https://yanyubao.tseo.cn/wxa/?sellerid=', '');
      if (sellerid.length > 20) {
        sellerid = sellerid.replace('https%3A%2F%2Fyanyubao.tseo.cn%2Fwxa%2F%3Fsellerid%3D', '');
      }

      console.log('从q参数得到的sellerid：' + sellerid);

    }
*/
    console.log('sellerid 01：' + sellerid);
    //if (!sellerid && typeof (sellerid) != "undefined" && sellerid != 0){
    
    if (options && options.parentid){
      app.set_current_parentid(options.parentid);
    }
    else if (options && options.scene){
      var parentid_value = decodeURIComponent(options.scene);

      console.log('来自小程序码的推荐者ID：'+parentid_value);
      if (parentid_value && (parentid_value.indexOf('parentid_') != -1)){
        parentid_value = parentid_value.replace('parentid_', '');

        app.set_current_parentid(parentid_value);
      }
      else{
        console.log('推荐者ID：' + parentid_value+'不是 parentid_开头的，默认为sellerid的值');

        sellerid = options.scene;

        console.log('sellerid 0101：' + sellerid);

      }
      
    }

    if (options || options!=null){
      if (!sellerid) {
        sellerid = options.sellerid;
        console.log('sellerid 02：' + sellerid);
      }

      
    }

<<<<<<< HEAD
    if (!sellerid && options) {
      
=======
    if (!sellerid) {
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
      var sellerid_scene = decodeURIComponent(options.scene);
      if (sellerid_scene && sellerid_scene.indexOf('sellerid_') != -1) {
        sellerid = sellerid_scene.replace('sellerid_', '');
      }

      console.log('sellerid 03：' + sellerid);
    }

    if (!sellerid) {
      sellerid = app.get_sellerid();
      console.log('sellerid 04：' + sellerid);
    }
    
    console.log('sellerid 05：' + sellerid);

    if (!sellerid) {
      console.log('!!!!!!缺少商户ID，使用默认的' + app.globalData.default_sellerid);
      sellerid = app.globalData.default_sellerid;

    }

    if (app.globalData.force_sellerid == 1) {
      sellerid = app.globalData.default_sellerid;
    }

    console.log('sellerid 06：' + sellerid);

    app.globalData.sellerid = sellerid
    app.set_sellerid(sellerid);

<<<<<<< HEAD
    //======以上获取sellerid的逻辑必须被优先执行，以下可以执行后续的刷新界面的操作===

    app.get_shop_info_from_server(that.loadInfo);

    app.set_option_list_str(null, app.getColor());

    wx.setNavigationBarTitle({
      title: app.globalData.shop_name
    })

    this.loadImg();
    this.loadIcon();

    this.initArticleList();

=======
    console.log('set_option_list_str:::::==>>>getShopOptionAndRefresh');
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    app.set_option_list_str(this, this.getShopOptionAndRefresh);

    //console.log('当前sellerid:' + sellerid + "，来自请求" + q);

    /*
        var sellerid = options.sellerid;
        if (typeof(sellerid) == 'undefined') {
          wx.navigateTo({
            url: '../index/index?sellerid=pQNNmSkaq'
          })      
        }*/

    //调用应用实例的方法获取全局数据
    console.log("index:onLoad:app.getUserInfo:");

    var userInfo = app.get_user_info();

    //console.log(userInfo);
    //console.log(83838383)
    //console.log(app.get_sellerid());

    //更新数据
    that.setData({
      userInfo: userInfo,
    });


    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: {
        page: 1,
        is_hot:1,
        userid: userInfo ? userInfo.userid: 0,
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res && res.data && res.data.code == 1) {
          var product_list = res.data.product_list;
          console.log(product_list);
          //that.initProductData(data);
          that.setData({
            product_list: product_list,
          });
        }  
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_flash_ad_list',
      method: 'post',
      data: {
        sellerid :app.get_sellerid(),
        'type':4
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var banner = res.data.data;
        console.log(res);
        console.log(banner);

        //that.initProductData(data);
        that.setData({
          imgUrls: banner,
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

    //=====更新商户头条=================
  
      var url2 = app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=get_yingxiao_latest_img&sellerid=' +         app.globalData.sellerid;
      var data2 = {};
      var cbSuccess2 = function (res) {
        var shanghu_img_list = res.data.showpic
        if (res.data.code == 1) {
          //更新首页的商户头条
          console.log('成功返回商户头条信息:' + res.data.data[0].title);
          that.setData({
            headlineItem: res.data.data[0].title,
            toutiao_item_id: res.data.data[0].id,
          });
        }

        app.set_current_weiduke_token(res.data.data[0].token);
        
      };
      var cbError2 = function (res) {
<<<<<<< HEAD

      };
      app.httpPost(url2, data2, cbSuccess2, cbError2);
   
    //========End====================

    
  }, 

  loadInfo:function(res){
    var that = this;

    console.log('pages/index get_shop_info_from_server 回调：');
    console.log(res);

    var shop_info_from_server = res;

    console.log('shop_info_from_server====', shop_info_from_server);

    that.setData({
      shop_name: shop_info_from_server.shop_name,
      shop_icon: shop_info_from_server.shop_icon,
      shop_list: shop_info_from_server
    });

    app.globalData.shop_name = shop_info_from_server.shop_name;

    wx.setNavigationBarTitle({
      title: that.data.shop_name
    })
=======

      };
      app.httpPost(url2, data2, cbSuccess2, cbError2);
   
    //========End====================

    
  }, 

  loadInfo:function(){
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_info',
      method: 'post',
      data: {
        sellerid: app.globalData.sellerid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code==1){
        var shop_list = res.data.data;




        console.log(shop_list);
        that.setData({
          shop_name: shop_list.name,
          shop_icon: shop_list.icon,
          shop_list: shop_list
        });

          app.globalData.shop_name = shop_list.name;

>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e


    
  },
  loadImg: function () {
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_flash_img_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        'type': 5
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var img_list = res.data;
        console.log(img_list);
        if(res.data.code==1){
        that.setData({
          img_list: img_list.data
        });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  loadIcon: function () {
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_icon_index',
      method: 'post',
      data: {
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var icon_list = res.data;
        console.log(icon_list);
        if (res.data.code == 1) {
          that.setData({
            icon_list: icon_list.data
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
  icon_url:function(e){
    console.log(e);
    var that =this;
<<<<<<< HEAD

    var var_list = Object();
    if (that.data.productid) {
      var_list.productid = that.data.productid;
    }

    
=======
    var userInfo = app.get_user_info();
    // if ((!userInfo) || (!userInfo.userid)) {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    //   return;
    // }

    // wx.request({
    //   url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=one_click_login_str',
    //   method: 'post',
    //   data: {
    //     sellerid: app.get_sellerid(),
    //     checkstr: userInfo.checkstr,
    //     userid: userInfo.userid
    //   },
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     //--init data        
    //     var code = res.data.code;
    //     if (code == 1) {
    //       var oneclicklogin = res.data.oneclicklogin;
    //       that.setData({
    //         oneclicklogin: res.data.oneclicklogin
    //       });
    //     }
    //   },
    //   fail: function(res){

    //   }
    //   })
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e


    var index = e.currentTarget.dataset.index;
    var url = that.data.icon_list[index].url;
    if (url.indexOf("%oneclicklogin%") != -1) {
<<<<<<< HEAD

      var last_url = '/pages/index/index';
      app.goto_user_login(last_url, 'switchTab');

      var userInfo = app.get_user_info();


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
            
            url = url.replace('%oneclicklogin%', that.data.oneclicklogin);

            app.call_h5browser_or_other_goto_url(url, var_list);
          }
        },
        fail: function (res) {

        }
      });

      return;
=======
      url = url.replace('%oneclicklogin%', that.data.oneclicklogin);
    }

    if (url.indexOf("%ensellerid%") != -1) {
      url = url.replace('%ensellerid%', app.get_sellerid());
    }
    
    if (url.indexOf("%wxa_appid%") != -1) {
      url = url.replace('%wxa_appid%', app.globalData.xiaochengxu_appid);
    }

    console.log('url',url);
    if (url == '/pages/index/index' || url == '/pages/category/index' || url == '/pages/cart/cart' || url == '/pages/user/user' ){
      wx.switchTab({
        url: url,
      })
    } else if (url == '/pages/help_detail/help_detail'){
      var browser_cache_id = wx.getStorageSync('browser_cache_id');
      if (browser_cache_id){
        wx.navigateTo({
          url: url + '?id=' + browser_cache_id,
        })
      } else {
        wx.showToast({
          title: '无浏览记录',
        })
      } 
    }
     else if (url=='duorenpintuan'){
      var url1 = 'https://yanyubao.tseo.cn/Home/DuorenPintuan/pintuan_list/ensellerid/' + app.get_sellerid() + '.html?click_type=Wxa';
    wx.navigateTo({
      url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1),
    })
    } else if (url == 'fenxiangkanjia') {
      var url1 = 'https://yanyubao.tseo.cn/Home/ShareKanjia/share_list/productid/' + that.data.productid + '.html?click_type=Wxa';
      wx.navigateTo({
        url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1),
      })
    }
    else if (url.indexOf('https://') == 0) {
      wx.navigateTo({
        url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url),
      })
    }
    else if (url.indexOf('miniprogram') == 0){
      var arr = url.split(" ");
      if(arr.length >= 3){
        var appid = arr[2];
        var pagepath = arr[3];
        var extraData = null;
        if(arr[4]){
          extraData = arr[4];
        }

        var extraData_obj = null;
        if (extraData){
          extraData_obj = JSON.parse(extraData);
        }

        //console.log('1111111111111', extraData)

        wx.navigateToMiniProgram({
          appId: appid,
          envVersion: 'release',
          path: pagepath,
          extraData: extraData_obj,
          success(res) {
            // 打开成功
          },
          fail: function (res) {
            wx.showModal({
              title: '跳转小程序失败',
              content: res.errMsg,
              showCancel: false
            })

            console.log('跳转小程序失败：', res);
          }
        })
      }
    }
     else {
      wx.navigateTo({
        url:url
      })
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    }

    app.call_h5browser_or_other_goto_url(url, var_list);
  },
  touTiaoList: function (e) {
    console.log('点击商户头条进入列表');
    wx.navigateTo({
      url: '../help/help?sellerid=' + app.get_sellerid()
    })
  },

  touTiaoItem: function (e) {
    console.log('点击商户头条进入该详情' + e.currentTarget.dataset.id);

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../help_detail/help_detail?id=' + id + '&sellerid=' + app.get_sellerid()

    })
  },
  onShareAppMessage: function () {
    console.log('app.globalData.shop_name : '+app.globalData.shop_name);

    var share_url = '/pages/index/index?sellerid=' + app.globalData.sellerid;

    var userInfo = app.get_user_info();
    if (userInfo){
      share_url += "&parentid=" + userInfo.userid;
    }

    return {
      title: '' + app.globalData.shop_name,
      path: share_url, 
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },

  //跳转到商品详情
  toProductDetail:function(e){
    var url = e.currentTarget.dataset.url;

    console.log('toProductDetail准备跳转至：'+url);

    if(url.indexOf('https://') == 0){      
      wx.navigateTo({
        url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url),
      })
    }
    else if (url.indexOf('miniprogram') == 0) {
      var arr = url.split(" ");
      if (arr.length >= 3) {
        var appid = arr[2];
        var pagepath = arr[3];
        var extraData = null;
        if (arr[4]) {
          extraData = arr[4];
        }

        //console.log('1111111111111', extraData)

        var extraData_obj = null;
        if (extraData) {
          extraData_obj = JSON.parse(extraData);
        }

        wx.navigateToMiniProgram({
          appId: appid,
          envVersion: 'release',
          path: pagepath,
          extraData: extraData_obj,
          success(res) {
            // 打开成功
          },
          fail: function (res) {
            wx.showModal({
              title: '跳转小程序失败',
              content: res.errMsg,
              showCancel:false
            })

            console.log('跳转小程序失败：', res);
          }
        })
      }
    }
    else{
      wx.navigateTo({
        url: url,
      })
    }

  },
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;

    console.log(imgheights);

    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },


//搜索
  search: function (view) {
    var welfareId = view.currentTarget.dataset.value;
    var url = "../listdetail/listdetail?name=" + welfareId;
    wx.navigateTo({
      url: url
    });
  },

//拨打客服电话
  call_seller: function () {
    console.log('wxa_kefu_mobile_num', this.data.wxa_kefu_mobile_num)
    wx.makePhoneCall({
      phoneNumber: this.data.wxa_kefu_mobile_num,
    })
  },
//跳转h5
goToOtherPage:function(){
  var url = this.data.wxa_kefu_form_url
  wx.navigateTo({
    url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
  });
  return;
}  

});