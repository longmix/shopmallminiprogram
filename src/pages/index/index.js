var util = require('../../utils/util.js');
var api = require('../../utils/api');

var app = getApp();


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
    current: 0,

    wxa_hidden_product_list:0,
    wxa_product_list_show_type:'',




    hide_good_box: true,
    zhengdianmaoshao_currentTabTime: 0,
    wxa_show_video_autoplay:false,

    current_params_str:''
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
  if (this.data.wxa_hidden_product_list == 1){
    return;
  }
  
  var that = this;

  var userInfo = app.get_user_info();

  var post_data = {
    page: that.data.page,
    userid: userInfo ? userInfo.userid: 0,
    sellerid: app.get_sellerid()
  };

  if(this.data.wxa_product_list_show_type == 'is_recommend'){
    post_data.is_recommend = 1;
  }
  else if(this.data.wxa_product_list_show_type == 'is_hot'){
    post_data.is_hot = 1;
  }

  api.abotRequest({
      url: app.globalData.http_server+ '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: post_data,
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        console.log("aaafff",res);
        var prolist = res.data.product_list;
        /*
            wx.setStorage({  
             key: "student",  
             data: res.data  
           }) 
           */
        if(prolist==''){
          wx.showToast({
            title: '我也有底线~',
            duration: 2000
          });

          that.setData({
            show_click_to_get_more: 'none'
          });

          return false;
        }else{
          //that.initProductData(data);
          console.log("555666", that.data.product_list);
          that.setData({
            page: that.data.page + 1,
            product_list: that.data.product_list.concat(prolist)
          });
        //endInitData
        }
        
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
    // userInfo = app.get_user_info();
    // this.getShopOptionAndRefresh(this, 0);
    
  },
  getShopOptionAndRefresh: function (that, cb_params) {
    //var that = this;

    app.getColor()

    console.log('getShopOptionAndRefresh+++++:::'+cb_params)

    //从本地读取
    var option_list_str = wx.getStorageSync('shop_option_list_str_' + app.get_sellerid());

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    if (!option_list){
      return;
    }

    if (option_list.wxa_product_list_style) {
        that.setData({
          wxa_product_list_style: option_list.wxa_product_list_style
        })
      }
    if (option_list.wxa_shop_toutiao_icon) {
      that.setData({
        wxa_shop_toutiao_icon: option_list.wxa_shop_toutiao_icon
      })
    }
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
    
    //视频组件
    if (option_list.wxa_show_video_player) {
      that.setData({
        wxa_show_video_player: option_list.wxa_show_video_player
      });
    }
    option_list.wxa_show_video_autoplay = 0;
    if (option_list.wxa_show_video_autoplay) {
      that.setData({
        wxa_show_video_autoplay: true
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

    
    //商户头条
    if (option_list.wxa_shop_toutiao_flash_line) {
      that.setData({
        wxa_shop_toutiao_flash_line: option_list.wxa_shop_toutiao_flash_line
      });
    }

    if (option_list.wxa_hidden_product_list) {
      that.setData({
        wxa_hidden_product_list: option_list.wxa_hidden_product_list
      });
    }

    if (option_list.wxa_product_list_show_type) {
      that.setData({
        wxa_product_list_show_type: option_list.wxa_product_list_show_type
      });
    }

    if (option_list.wxa_kefu_button_type) {
      that.setData({
        wxa_kefu_button_type: option_list.wxa_kefu_button_type
      });
    }

    //客服按钮和背景颜色
    if (option_list.wxa_kefu_button_icon) {
      that.setData({
        wxa_kefu_button_icon: option_list.wxa_kefu_button_icon
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

    if (option_list.wxa_kefu_mobile_num) {
      that.setData({
        wxa_kefu_mobile_num: option_list.wxa_kefu_mobile_num
      });
    }

    if (option_list.wxa_kefu_form_url) {
      that.setData({
        wxa_kefu_form_url: option_list.wxa_kefu_form_url
      });
    }

    if (option_list.wxa_share_title) {
      that.setData({
        wxa_share_title: option_list.wxa_share_title
      });
    }

    if (option_list.wxa_share_img) {
      that.setData({
        wxa_share_img: option_list.wxa_share_img
      });
    }
    


    if (option_list.zhengdian_miaosha_status) {
      that.setData({
        zhengdian_miaosha_status: option_list.zhengdian_miaosha_status
      });
    }

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



    var post_data = {
      page: that.data.page,
      //userid: userInfo ? userInfo.userid: 0,
      sellerid: app.get_sellerid()
    };

    console.log('that.wxa_product_list_show_type====>>>>', that.wxa_product_list_show_type);

    if(that.data.wxa_product_list_show_type == 'is_recommend'){
			post_data.is_recommend = 1;
		}
		else if(that.data.wxa_product_list_show_type == 'is_hot'){
			post_data.is_hot = 1;
		}


    api.abotRequest({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: post_data,
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res && res.data && res.data.code == 1) {
          var product_list = res.data.product_list;
          console.log(product_list);
          //that.initProductData(data);
          that.setData({
            page: that.data.page + 1,
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
    
    
    

  },
  
  onPullDownRefresh: function () {   
    console.log('下拉刷新==============')


    wx.showLoading({
      title: '数据刷新中……',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)


    var that = this;
    that.setData({
      page: 1,
      product_list: []
    })

    try {
      wx.removeStorageSync('shop_option_list_str_' + app.get_sellerid())
    } catch (e) {
      // Do something when catch error
    }

    try {
      wx.removeStorageSync('shop_info_from_server_str_' + app.get_sellerid())
    } catch (e) {
      // Do something when catch error
    }

    wx.removeStorage({
      key: 'icon_list_usercenter_' + app.get_sellerid(),
      success(res) {
        
      }
    })

    if (that.data.zhengdian_miaosha_status == 1) {
      clearTimeout(this.data.zhengdian_miaosha_dingshi);		
    }

    
    that.onLoad();

    that.onShow();

    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();
    
  },
  onLoad: function (options) {

    var that = this;

    //console.log(encodeURIComponent('https://yanyubao.tseo.cn/wxa/?sellerid=pQNNmSkaq'));
    //console.log(decodeURIComponent(encodeURIComponent('https://yanyubao.tseo.cn/wxa/?sellerid=pQNNmSkaq')));return;

    //请求服务器,刷新卡券信息
    console.log('网页参数如下:');
    console.log(options); //console.log(options.sellerid);


    //=====分析参数=====
    if(options){
      var arr = Object.keys(options);
      var options_len = arr.length;

      if (options_len > 0){
        var params_str = '';

        for(var key in options){
          params_str += key+'='+options[key]+'&';
        }
        params_str = params_str.substr(0, params_str.length - 1);

        this.setData({
          current_params_str:params_str
        });
      }

    }
    
    //===== End ======

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

    if (!sellerid && options) {
      
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

    app.globalData.sellerid = sellerid;
    app.globalData.default_sellerid = sellerid;
    app.set_sellerid(sellerid);

    //======以上获取sellerid的逻辑必须被优先执行，以下可以执行后续的刷新界面的操作===

    

    wx.setNavigationBarTitle({
      title: app.globalData.shop_name
    })

    app.set_option_list_str(this, this.getShopOptionAndRefresh);

    app.get_shop_info_from_server(that.loadInfo);

    this.loadImg();
    this.loadIcon();

    this.initArticleList();

    

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
      show_click_to_get_more:'block'
    });

    

    api.abotRequest({
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
        //返回值：1 有文章列表， 2 没有文章列表
        var shanghu_img_list = res.data.showpic
        if (res.data.code == 1) {
          //更新首页的商户头条
          console.log('成功返回商户头条信息:' + res.data.data[0].title);
          that.setData({
            headlineItem: res.data.data[0].title,
            toutiao_item_id: res.data.data[0].id,
          });

          app.set_current_weiduke_token(res.data.data[0].token);
        }
        
      };
      var cbError2 = function (res) {

      };
      app.httpPost(url2, data2, cbSuccess2, cbError2);
   
    //========End====================

    this.busPos = {};
    this.busPos['x'] = 234.375;//购物车的位置
    this.busPos['y'] = app.globalData.hh - 32;




    //整点秒杀
    console.log('zhengdian_miaosha_status===', that.data.zhengdian_miaosha_status);
    if(that.data.zhengdian_miaosha_status == 1){

      var query = wx.createSelectorQuery()//创建节点查询器 query
      query.select('#zhengdianmiaosha').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
      query.exec(function (res) {
        //console.log(res[0].top); // #affix节点的上边界坐
        that.setData({
          menuTop: res[0].top
        })
      });



      that.zhengdian_miaosha_get();

      
    }
    
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


    
  },
  loadImg: function () {
    var that = this;
    api.abotRequest({
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
    api.abotRequest({
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

    var var_list = Object();
    if (that.data.productid) {
      var_list.productid = that.data.productid;
    }

    


    var index = e.currentTarget.dataset.index;
    var url = that.data.icon_list[index].url;

    app.call_h5browser_or_other_goto_url(url, var_list, 'pages_index');
    

    
  },
  touTiaoList: function (e) {
    console.log('点击商户头条进入列表');
    wx.navigateTo({
      url: '../help/list?sellerid=' + app.get_sellerid()
    })
  },

  touTiaoItem: function (e) {
    console.log('点击商户头条进入该详情' + e.currentTarget.dataset.id);

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../help/detail?id=' + id + '&sellerid=' + app.get_sellerid()

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
  onShareTimeline: function () {
    console.log('app.globalData.shop_name : '+app.globalData.shop_name);

    return this.share_return();
  },
  onAddToFavorites: function () {
    return this.share_return();
  },
  share_return: function () {
    return {
      title: this.data.wxa_share_title,
      query: this.data.current_params_str,
      imageUrl:this.data.wxa_share_img
    }
  },
  //跳转到商品详情
  toProductDetail:function(e){
    var url = e.currentTarget.dataset.url;

    if(!url || (url.length == 0)){
      console.log('没有设置跳转链接');
      return;
    }


    var that = this;
    var var_list = Object();
    if (that.data.productid) {
      var_list.productid = that.data.productid;
    }
    console.log('index.js toProductDetail准备跳转至：'+url);


    app.call_h5browser_or_other_goto_url(url, var_list, 'pages_index');

    

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
  goto_search: function (view) {
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
},

  addCart: function (e) {
    var that = this;

    var last_url = 'switchTab /pages/index/index';

    if(app.goto_user_login(last_url)){
      return;
    }

    var userInfo = app.get_user_info();

    var productid = e.currentTarget.dataset.productid;

    api.abotRequest({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopApp&a=cart_add',
      method: 'post',

      data: {
        amount: 1,
        checkstr: userInfo.checkstr,
        productid: productid,
        sellerid: app.get_sellerid(),
        userid: userInfo.userid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '添加成功',
        });

        api.abotRequest({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=cart_list',
          method: 'post',
          data: {
            userid: userInfo.userid,
            checkstr: userInfo.checkstr,
            page: 1,
            sellerid: app.get_sellerid()
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var carts = res.data.data;
            var total_amount = 0;
            if (res.data.code == 1) {
              for (var i = 0; i < carts.length; i++) {
                total_amount += carts[i].amount
              }
              wx.setTabBarBadge({
                index: 2,
                text: total_amount.toString()
              })

            } else if (res.data.code == 2) {

            }

            //endInitData
          },
        });

        that.touchOnGoods(that, e);
      },
      fail: function (e) {
        wx.showToast({
          title: '添加失败',
        });
      },
    });
  },

  //调用的方法
  touchOnGoods: function (that, e) {
    if (!this.data.hide_good_box) return;
    that.finger = {}; var topPoint = {};
    that.finger['x'] = e.touches["0"].clientX;//点击的位置
    that.finger['y'] = e.touches["0"].clientY;

    if (that.finger['y'] < that.busPos['y']) {
      topPoint['y'] = that.finger['y'] - 150;
    } else {
      topPoint['y'] = that.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(that.finger['x'] - that.busPos['x']) / 2;

    if (that.finger['x'] > that.busPos['x']) {
      topPoint['x'] = (that.finger['x'] - that.busPos['x']) / 2 + that.busPos['x'];
    } else {//
      topPoint['x'] = (that.busPos['x'] - that.finger['x']) / 2 + that.finger['x'];
    }
    that.linePos = util.bezier([that.busPos, topPoint, that.finger], 20);
    console.log('bezier_points', that.linePos)
    that.startAnimation(that, e);
  },

  startAnimation: function (that, e) {
    var index = 0,
      bezier_points = that.linePos['bezier_points'];
    that.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    var i = index - 1;
    that.timer = setInterval(function () {

      if (i > -1) {
        that.setData({
          bus_x: bezier_points[i]['x'],
          bus_y: bezier_points[i]['y']
        })
        i--;
      }

      if (i < 1) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true
        })
      }
    }, 15);
  },



  // 获取整点秒杀列表
  zhengdian_miaosha_get:function(e){
    console.log('zhengdian_miaosha_get====')
    var userInfo = app.get_user_info();
    var that = this;
    api.abotRequest({
      url: app.globalData.http_server + 'openapi/ZhengdianmiaoshaData/get_zhengdian_setting',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : ''

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('res====', res)
        var data = res.data;
        if (data.code == 1) {
          that.setData({
            zhengdian_miaosha_list: data.data,
            zhengdian_miaosha_title: data.title,
            zhengdian_miaosha_timestamp: data.timestamp
          })

          that.data.zhengdian_miaosha_list.map((v, i) => {
        
            v.zhengdian_timeout = v.over_time - that.data.zhengdian_miaosha_timestamp;
            if(i==0){
              that.setData({
                zhengdian_miaosha_is_begin: v.is_begin
              })
            }
       
            return v;
          })

          that.zhengdian_miaosha_countdown();
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

  //整点秒杀预约提醒
  zhengdian_miaosha_yuyue_tixing: function (e) {
    var that = this;

    if(app.goto_user_login(last_url)){
      return;
    }

    var userInfo = app.get_user_info();
    
    var productid = e.currentTarget.dataset.productid;
    var index = e.currentTarget.dataset.idx;

  

    api.abotRequest({
      url: app.globalData.http_server + 'openapi/ZhengdianmiaoshaData/add_yuyue_tixing',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        productid: productid,
        schedule_time: that.data.zhengdian_miaosha_list[that.data.zhengdianmaoshao_currentTabTime].timestamp
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('res====', res)
        var data = res.data;
        if (data.code == 1) {
          
          that.data.zhengdian_miaosha_list[that.data.zhengdianmaoshao_currentTabTime].product_list[index].is_yuyue_tixing = 1;
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
  

  //选择整点秒杀时间
  zhengdian_miaosha_choosetime: function (e) {
    clearTimeout(this.data.zhengdian_miaosha_dingshi);

    console.log('e===',e)

    var index = e.currentTarget.dataset.idx
    var is_begin = e.currentTarget.dataset.isbegin

    this.zhengdian_miaosha_countdown();


    this.setData({
      zhengdianmaoshao_currentTabTime: index,
      zhengdian_miaosha_is_begin: is_begin
    })
  },


  /**
    * 倒计时
    */
  zhengdian_miaosha_countdown: function () {
    let time = 1000;
    let zhengdian_miaosha_list = this.data.zhengdian_miaosha_list;

    // let currentTime = Date.parse(new Date()) / 1000;
    // console.log('currentTime===', currentTime);

    let list = zhengdian_miaosha_list.map((v, i) => {


      if (v.zhengdian_timeout <= 0) {
          v.zhengdian_timeout = 0;
          this.zhengdian_miaosha_get();
        }
      let formatTime = this.zhengdian_miaosha_getformat(v.zhengdian_timeout);
        v.zhengdian_timeout -= 1;
        v.zhengdian_timeout_format = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
        return v;
    })

    this.setData({
      zhengdian_miaosha_list: zhengdian_miaosha_list
    });
    this.setData({
      zhengdian_miaosha_dingshi:setTimeout(this.zhengdian_miaosha_countdown, time)
    })
  },

  /**
   * 格式化时间
   */
  zhengdian_miaosha_getformat: function (msec) {
    let ss = parseInt(msec);

    // let ms = parseInt(msec % 1000);
    let mm = 0;
    let hh = 0;
    if (ss > 60) {
      mm = parseInt(ss / 60);
      ss = parseInt(ss % 60);
      if (mm > 60) {
        hh = parseInt(mm / 60);
        mm = parseInt(mm % 60);
      }
    }

    ss = ss > 9 ? ss : `0${ss}`;
    mm = mm > 9 ? mm : `0${mm}`;
    hh = hh > 9 ? hh : `0${hh}`;
    return { ss, mm, hh };
  },


  onReachBottom: function (e) {
    var that = this;
    that.getMore();
  },

  // 2.监听页面滚动距离scrollTop
  onPageScroll: function (e) {
    var that = this;
    // console.log(e.scrollTop);
    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
    if(that.data.zhengdian_miaosha_status == 1){
      if (e.scrollTop > that.data.maioshaTop) {
        that.setData({
          miaoshaFixed: true
        })
      } else {
        that.setData({
          miaoshaFixed: false
        })
      }
    }
    
  },

  videometa: function (e) {
    console.log('videometa======>>>>>', e);

    var imgwidth = e.detail.width;
    var imgheight = e.detail.height;


    //宽高比  
    var ratio = imgwidth / imgheight;

    console.log(imgwidth, imgheight)

    var current_view_width = 750;

    current_view_width = current_view_width;

    //计算的高度值  
    var current_view_height = current_view_width / ratio;


    //赋值给前端
    var videometa_width_height = [current_view_width, current_view_height];

    console.log('videometa_width_height====>>>>', videometa_width_height);

    this.setData({
      videometa_width_height: videometa_width_height
    });

  },
  //播放点击视频并停止播放其他视频
  start_and_stop_other_videos: function (e) {
    console.log('start_and_stop_other_videos=====>>>>', e);
    var video_id = e.currentTarget.dataset.id;
  }



  
});