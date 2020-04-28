var app = getApp();
var next_page = 1;
var userInfo = app.get_user_info();
var api = require('../../utils/api');
var util = require('../../utils/util');


// 引用百度地图微信小程序JSAPI模块
var bmap = require('../../utils/bmap-wx.js');
var wxMarkerData = [];

Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    proCat: [],
    page: 1,
    index: 2,
    brand: [],
    // 滑动
    imgUrl: [],
    kbs: [],
    lastcat: [],
    course: [],

    ak: "OTsGerqQhowGSFOWG8c6p86R",	//填写申请到的ak
    markers: [],
    longitude: '', 	//经度
    latitude: '',	//纬度
    address: '',		//地址
    cityInfo: {},		//城市信息



    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0,
    isShowBottomLine: 0,



// 1111111111111111
   
    cartlist: [],
    localList: [],
    showCartDetail: false,
    defaultImg: 'http://global.zuzuche.com/assets/images/common/zzc-logo.png',
    hide_good_box: true,
    total:'0.00',
    total_pintuan: '0.00',
    original_total: '0.00',
    o2o_set_pei_song_price: '0.00',
    is_pintuan: false,
    is_show_choose_time: false,
    cart_count:0,
    currentTabWeek: 0,
    is_menu_list_scroll:false,
    is_showall_pintuan_list: false,
    selectTop:'',
  },
  //跳转商品列表页   
  listdetail: function (e) {
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title=' + e.currentTarget.dataset.title,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //跳转商品搜索页  
  suo: function (e) {
    wx.navigateTo({
      url: '/pages/order/pay?action=direct_buy&productid=3969&amount=1&jiantuanid=0&buynow_direct_amount=1&cuxiao_type=duorenpintuan&price_type=1',
    })
  },

  //点击加载更多
  getMore: function (e) {
    var that = this;
    var page = that.data.page;
    next_page++;

    // wx.request({
    //     url: app.globalData.http_server+ '?g=Yanyubao&m=ShopAppWxa&a=product_list',
    //     method:'post',
    //     data: { 
    //       sellerid: app.get_sellerid(), 
    //       page: next_page,
    //       userid: userInfo ? userInfo.userid : 0,
    //       },
    //     header: {
    //       'Content-Type':  'application/x-www-form-urlencoded'
    //     },
    //     success: function (res) {  
    //       console.log("111222",res);
    //       var prolist = res.data.product_list;
    //       /*
    //           wx.setStorage({  
    //            key: "student",  
    //            data: res.data  
    //          }) 
    //          */
    //       if(prolist==''){

    //         that.setData({
    //           isShowBottomLine: 1,
    //         })

    //         return false;
    //       }
    //       //that.initProductData(data);
    //       console.log("555666",that.data.product_list);
    //       that.setData({
    //         page: page+1,
    //         product_list: that.data.product_list.concat(prolist)
    //       });
    //       //endInitData
    //     },
    //     fail:function(e){
    //       console.log("22222");
    //       wx.showToast({
    //         title: '网络异常！',
    //         duration: 2000
    //       });
    //     }
    //   })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMore()

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

        for (var i = 0, length = data.length - 1; i <= (length / 2); i++) {
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

  onShow: function () {
    var that = this;
    
    userInfo = app.get_user_info();

    app.get_shop_info_from_server(that.loadInfo);
    
    // this.getShopOptionAndRefresh(this, 0);

    var address_info_str = wx.getStorageSync('address_info_str')

    if (!address_info_str) {
      wx.navigateTo({
        url: '/o2o/address/address_list',
      })
      return;
    } else {
      var address_info = JSON.parse(address_info_str);
      this.setData({
        level03: address_info.level03,
        address_info: address_info,
        is_show_choose_time: false,
      })

      
    }



    that.get_cart_list();

    //http://192.168.0.205/yanyubao_server/index.php/openapi/O2OAddressData/get_product_list_all_data
    wx.request({
      url: app.globalData.http_server + '/openapi/O2OAddressData/get_product_list_all_data',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        bid: that.data.address_info.level04.bid

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var banner = res.data.data;


        //that.initProductData(data);


        // for(var i=0; banner.menu.length; i++){
          var selectOrder = banner.menu[0].id
        //   break;
        // }

        console.log('res===', res)

        that.setData({
          shanglist: banner.menu,
          selectOrder: selectOrder
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

    api.abotRequest({
      url: app.globalData.http_server + '/openapi/O2OAddressData/get_level03_tuan_order_list',
      data: {
        sellerid: app.get_sellerid(),
        // checkstr: userInfo.checkstr,
        // userid: userInfo.userid,
        appid: app.globalData.xiaochengxu_appid,
        bid: that.data.address_info.level04.bid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        var data = res.data;
        if(data.code == 1){
          that.setData({
            tuan_order_list: data.data
          })
          that.setCountDown();
        }
      },
      fail:function(res) {

      }
    })


    setTimeout(function () {
      var query = wx.createSelectorQuery()//创建节点查询器 query
      query.select('#menu-list').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
      query.exec(function (res) {
        //  console.log('44444444444',res[0].top); // #menu-list节点的上边界坐
        that.setData({
          menuTop: res[0].top
        })
      });
    }, 700)
    


  },
  getShopOptionAndRefresh: function (that, cb_params) {
    //var that = this;

    console.log('getShopOptionAndRefresh+++++:::' + cb_params)

    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '333333333');

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    if (!option_list) {
      return;
    }

    if (option_list.wxa_shop_toutiao_icon) {
      that.setData({
        wxa_shop_toutiao_icon: option_list.wxa_shop_toutiao_icon
      })
    }

    if (option_list.wxa_show_icon_index_count) {
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

    if (option_list.wxa_kefu_button_icon) {
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


    // that.setData({
    //   wxa_kefu_button_type: option_list.wxa_kefu_button_type,
    //   wxa_kefu_button_icon: option_list.wxa_kefu_button_icon,
    //   wxa_kefu_mobile_num: option_list.wxa_kefu_mobile_num,
    //   wxa_kefu_form_url: option_list.wxa_kefu_form_url,
    //   wxa_show_kefu_button: option_list.wxa_show_kefu_button,
    //   wxa_kefu_bg_color: option_list.wxa_kefu_bg_color
    // })




    if (option_list.wxa_shop_nav_font_color && option_list.wxa_shop_nav_bg_color) {
      wx.setNavigationBarColor({
        frontColor: option_list.wxa_shop_nav_font_color,
        backgroundColor: option_list.wxa_shop_nav_bg_color,
        animation: {
          duration: 0,
          timingFunc: 'easeIn'
        }
      });
    }





  },

  onPullDownRefresh: function () {
    var that = this
    console.log('下拉刷新==============')

    wx.removeStorage({
      key: 'option_list_str',
      success(res) {
        // app.set_option_list_str(this, this.getShopOptionAndRefresh);
        //停止当前页面的下拉刷新   
      }
    })
    

    wx.removeStorage({
      key: 'o2o_basic_data_option_str',
      success(res) {
        app.set_option_list_str(that, that.getShopOptionAndRefresh);
        app.set_o2o_basic_data_option_str(that, that.callback_o2o_basic_data_option);
      }
    })

    this.onLoad();
    this.onShow();
    wx.stopPullDownRefresh();
    
  },
  onLoad: function (options) {
    
    wx.showLoading({
      title: '正在加载',
    })


    setTimeout(function () {
      wx.hideLoading()
    }, 2000)

    wx.setStorageSync('from_o2o', 1);
   
    this.loadImg();
    this.loadIcon();

    this.initArticleList();

    //this.getShopOptionAndRefresh();


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



    if (options && options.parentid) {
      app.set_current_parentid(options.parentid);
    }
    else if (options && options.scene) {
      var parentid_value = decodeURIComponent(options.scene);

      console.log('来自小程序码的推荐者ID：' + parentid_value);
      if (parentid_value && (parentid_value.indexOf('parentid_') != -1)) {
        parentid_value = parentid_value.replace('parentid_', '');

        app.set_current_parentid(parentid_value);
      }
      else {
        console.log('推荐者ID：' + parentid_value + '不是 parentid_开头的，默认为sellerid的值');

        sellerid = options.scene;

        console.log('sellerid 0101：' + sellerid);

      }

    }

    if (options || options != null) {
      if (!sellerid) {
        sellerid = options.sellerid;
        console.log('sellerid 02：' + sellerid);
      }

      if (!sellerid) {
        var sellerid_scene = decodeURIComponent(options.scene);
        if (sellerid_scene && sellerid_scene.indexOf('sellerid_') != -1) {
          sellerid = sellerid_scene.replace('sellerid_', '');
        }

        console.log('sellerid 03：' + sellerid);

      }
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


    //强制设置为o2o模板
    app.globalData.is_o2o_app = 1;


    app.globalData.sellerid = sellerid
    app.set_sellerid(sellerid);

    app.get_shop_info_from_server(function(res){
      console.log('o2o/index get_shop_info_from_server 回调：');
      console.log(res);

      that.setData({
        shop_list: res,
      });

      app.globalData.shop_name = res.shop_name;

      wx.setNavigationBarTitle({
        title: app.globalData.shop_name
      })
    })

    console.log('set_option_list_str:::::==>>>getShopOptionAndRefresh');
    app.set_option_list_str(this, this.getShopOptionAndRefresh);
    app.set_o2o_basic_data_option_str(this, this.callback_o2o_basic_data_option);

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



    //console.log(userInfo);
    //console.log(83838383)
    //console.log(app.get_sellerid());


    // 獲取當前地理位置
    this.setData({
      pingmuWidth: wx.getSystemInfoSync().windowWidth
    })


    /* 获取定位地理位置 */
    // 新建bmap对象
    var BMap = new bmap.BMapWX({
      ak: 'OTsGerqQhowGSFOWG8c6p86R'
    });

    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       name: "花园桥肯德基",
    //       scale: 28
    //     })
    //   }
    // })


    var fail = function (data) {
      console.log('333333', data);
      console.log('44444', that.data.ak);
    };
    var success = function (data) {
      console.log('00000', data);
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        address: wxMarkerData[0].address,
        cityInfo: data.originalData.result.addressComponent,

      });
      console.log('with', that.data.imageWidth)
      wx.setStorageSync("latitude", wxMarkerData[0].latitude)
      console.log('location', wxMarkerData[0].latitude)
      wx.setStorageSync("longitude", wxMarkerData[0].longitude)
      wx.setStorageSync("markers", wxMarkerData)
      // getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }

    BMap.regeocoding({
      fail: fail,
      success: success
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });



    //更新数据
    that.setData({
      userInfo: userInfo,
    });


   



    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_flash_ad_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        'type': 4
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

    var url2 = app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=get_yingxiao_latest_img&sellerid=' + app.globalData.sellerid;
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

    };
    app.httpPost(url2, data2, cbSuccess2, cbError2);

    //========End====================
// 1111111111111111111
    var that = this;
    wx.getSystemInfo({// 获取页面的有关信息
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;

        that.setData({
          ww: ww,
          hh: hh,
          menuHeight: hh - 140
        })

      }
    });


    // var busPos = {};
    // busPos['x'] = 180;//购物车的位置
    // busPos['y'] = this.data.hh - 56;

    // this.setData({
    //   busPos: busPos
    // })
    this.busPos = {};
    this.busPos['x'] = 77;//购物车的位置
    this.busPos['y'] = this.data.hh - 60;

    console.log('busPos', that.busPos)
    


    

    
    wx.request({
      url: app.globalData.http_server + '/openapi/O2OAddressData/get_week_data_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var weeklist = res.data.data;
        console.log('10101010', res);

        that.setData({
          weeklist: weeklist,
        });

        var date_str = weeklist[0].str;
        var weekItem = weeklist[0];

        

        wx.setStorageSync('date_str', date_str)
        that.setData({
          weekItem: weekItem
        })
 
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })


  },


//o2o配置
  callback_o2o_basic_data_option: function (that, o2o_basic_data_option){
    console.log('o2o_basic_data_option====', o2o_basic_data_option)
    if (!o2o_basic_data_option){
      return;
    }

    var manjian = o2o_basic_data_option.manjian
    var pintuan = o2o_basic_data_option.pintuan
    var o2o_set_pei_song_time = o2o_basic_data_option.basic_set.o2o_set_pei_song_time;
    var basic_set = o2o_basic_data_option.basic_set;
    var shouHuoInfo = wx.getStorageSync('shouHuoInfo');


    if(manjian){
      var manjian_str = ''
      for (var i = 0; i < manjian.length; i++) {
        manjian_str += ';满' + manjian[i].man + '减' + manjian[i].jian;      
      }
      manjian_str = manjian_str.substr(1);
    } else {
      manjian_str = '无满减优惠';
    }

    this.setData({
      manjian: manjian,
      manjian_str: manjian_str,
      pintuan: pintuan,
      o2o_set_pei_song_time: o2o_set_pei_song_time,
      basic_set: basic_set,   
    })

    if (shouHuoInfo){
      this.setData({
        shouHuoInfo: shouHuoInfo,
        shouHuoName: shouHuoInfo.shouHuoName,
        mobileNo: shouHuoInfo.mobileNo
      })
    }




  },

  loadInfo: function (res) {

    var shop_info_from_server = res;

    console.log('shop_info_from_server====', shop_info_from_server);



    var shop_list = shop_info_from_server;

    this.setData({
      shop_name: shop_list.shop_name,
      shop_icon: shop_list.shop_icon,
      shop_list: shop_list
    });

    app.globalData.shop_name = shop_list.shop_name;

    var shop_icon = this.data.shop_icon

    wx.setNavigationBarTitle({
      title: app.globalData.shop_name
    })

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
        if (res.data.code == 1) {
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
  icon_url: function (e) {
    console.log(e);
    var that = this;

    var var_list = Object();
    if (that.data.productid) {
      var_list.productid = that.data.productid;
    }

    var index = e.currentTarget.dataset.index;
    var url = that.data.icon_list[index].url;

    if (url.indexOf("%oneclicklogin%") != -1) {

      var last_url = '/pages/index/index';
      app.goto_user_login(last_url, 'normal');
      //app.goto_get_userinfo(last_url, 'normal');

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

            url = url.replace('%oneclicklogin%', oneclicklogin);

            app.call_h5browser_or_other_goto_url(url, var_list, 'o2o_index');
          }
        },
        fail: function (res) {

        }
      });

      return;

    }


    app.call_h5browser_or_other_goto_url(url, var_list, 'o2o_index');






  },
  touTiaoList: function (e) {
    console.log('点击商户头条进入列表');
    wx.navigateTo({
      url: '/pages/help/help?sellerid=' + app.get_sellerid()
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
    console.log('app.globalData.shop_name : ' + app.globalData.shop_name);

    var share_url = '/o2o/index/index?sellerid=' + app.globalData.sellerid;


    if (userInfo) {
      share_url += "&parentid=" + userInfo.userid;
    }

    return {
      title: '' + app.globalData.shop_name,
      path: share_url,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

  //跳转到商品详情
  toProductDetail: function (e) {
    var url = e.currentTarget.dataset.url;

    console.log('toProductDetail准备跳转至：' + url);

    if (url.indexOf('https://') == 0) {
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
              showCancel: false
            })

            console.log('跳转小程序失败：', res);
          }
        })
      }
    }
    else {
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
  goToOtherPage: function () {
    var url = this.data.wxa_kefu_form_url
    wx.navigateTo({
      url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
    });
    return;
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



  //点击加入购物车
  tapAddCart: function(e){
    var last_url = '/o2o/index/index';   
    app.goto_user_login(last_url, 'normal');

    app.goto_get_userinfo(last_url,'normal');


    var that = this
    var productid = e.currentTarget.dataset.productid
    api.abotRequest({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopApp&a=cart_add',
      data: {
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        productid: productid,
        amount: 1,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        if(res.data.code == 1){        
          that.get_cart_list();
        }
        that.touchOnGoods(that, e);
      },
      fail: function(res){

      }
    })
  },


  sum: function () {
    var cartlist = this.data.cartlist;
    var that = this;
    console.log(cartlist);
    if (cartlist || cartlist != null) {
      // 计算总金额
      var total = 0;
      for (var i = 0; i < cartlist.length; i++) {        
          total += cartlist[i].amount * cartlist[i].price;
          cartlist[i].price_total = util.sprintf("%6.2f", cartlist[i].amount * cartlist[i].price);       
      }

      console.log('that.data.manjian', that.data.manjian)
      var original_total = total
      var manjian = that.data.manjian
      if(manjian){   
        var aa = new Array();
        var bb = new Array();

        // aa.push(that.data.manjian)
        for(var i=0; i<manjian.length; i++){
          aa.push(manjian[i])
        }
        //aa.push({ "man": "10", "jian": "1" }, { "man": "20", "jian": "2" })
        bb['now_jian'] = 0;
        bb['has_next'] = 1;
        bb['first_zai'] = 0;

        for (var i = 0; i < aa.length; i++) {
          if (total < aa[i]['man']) {

            if (i >= 1) {
              bb['now_jian'] = aa[i - 1]['jian'];
            } else {
              bb['first_zai'] = 1;
            }

            bb['zaimai'] = (aa[i]['man'] - total).toFixed(2);
            bb['next_jian'] = aa[i]['jian'];

            
            break;
          }

          if (i == aa.length - 1) {
            bb['has_next'] = 0;
          }
          
          if (total >= aa[aa.length - 1]['man']) {
            bb['now_jian'] = aa[aa.length - 1]['jian'];
            bb['has_next'] = 0;
            bb['zaimai'] = 0;
            bb['next_jian'] = 0;
          }
        }


        var manjian_str = ''
        if (bb['has_next'] == 1){
          if (bb['first_zai'] == 0){
            manjian_str += '下单减' + bb['now_jian'] + '元，再买' + bb['zaimai'] + '元可减' + bb['next_jian'] + '元';
          } else {
            manjian_str += '再买' + bb['zaimai'] + '元可减' + bb['next_jian'] + '元';
          }
          
        } else {
          manjian_str += '已满' + aa[aa.length - 1]['man'] + '元，可减' + bb['now_jian'] + '元';
        } 

        total = total - bb['now_jian']   

      }


      if(total==0){
        if (manjian) {
          var manjian_str = ''
          for (var i = 0; i < manjian.length; i++) {
            manjian_str += ';满' + manjian[i].man + '减' + manjian[i].jian;
          }
          manjian_str = manjian_str.substr(1);
        } else {
          manjian_str = '无满减优惠';
        }
      }

      var total_pintuan = total;

      if(that.data.pintuan.o2o_pintuan_zhekou){
        total_pintuan = total * that.data.pintuan.o2o_pintuan_zhekou * 0.01
      }
      

      total = total.toFixed(2);
      total_pintuan = total_pintuan.toFixed(2);


      var cart_count = 0;
      for (var i = 0; i < cartlist.length; i++){
        cart_count += cartlist[i].amount;
      }


      var o2o_set_pei_song_price = that.data.basic_set.o2o_set_pei_song_price
      // 写回经点击修改后的数组
      this.setData({
        cartlist: cartlist,
        original_total: original_total.toFixed(2),
        total: total,
        total_pintuan: total_pintuan,
        o2o_set_pei_song_price: total ? util.sprintf("%6.2f", parseFloat(o2o_set_pei_song_price)) : '0.00',
        manjian_str: manjian_str,
        cart_count: cart_count,
      });


      console.log('this.data.cart_count',this.data.cart_count)
    }
  },

  cartAddCart: function (e) {
    var last_url = '/o2o/index/index';
    app.goto_user_login(last_url, 'normal');
    app.goto_get_userinfo(last_url, 'normal');
    var that = this;
    var bindex = parseInt(e.currentTarget.dataset.bindex);
    var num = that.data.cartlist[bindex].amount;
    var productid = e.currentTarget.dataset.productid;
    // 自增
    num++;
    console.log(num);
    //调用添加购物车接口 
    api.abotRequest({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopApp&a=cart_num_change',
      data: {
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        productid: productid,
        amount: num,
        action: 'inc'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        var code = res.data.code;
        if (code == 1) {
          // 购物车数据
          var cartlist = that.data.cartlist;
          cartlist[bindex].amount = num;
          that.setData({
            cartlist: cartlist
          });
          that.sum();
        } else {
          wx.showToast({
            title: '操作失败！',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function (e) {

      },
    })
    this.touchOnGoods(this, e);
  },



  //点击购物车加号将饭菜加入购物车
  tapReduceCart: function (e) {
    var last_url = '/o2o/index/index';
    app.goto_user_login(last_url, 'normal');
    app.goto_get_userinfo(last_url, 'normal');
    var that = this;
    var bindex = parseInt(e.currentTarget.dataset.bindex);
    var num = that.data.cartlist[bindex].amount;
    var productid = e.currentTarget.dataset.productid;
    console.log('eeeeeee',e,productid)
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
      console.log(num);
      //调用减少购物车接口 
      api.abotRequest({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopApp&a=cart_num_change',
        data: {
          productid: productid,
          userid: userInfo.userid,
          checkstr: userInfo.checkstr,
          'action': 'dec',
          amount: num,
          sellerid: app.get_sellerid()
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          var code = res.data.code;
          if (code == 1) {
            
            var cartlist = that.data.cartlist;
            cartlist[bindex].amount = num;            
            that.setData({
              cartlist: cartlist
            });
            that.sum();
          } else {
            wx.showToast({
              title: '操作失败！',
              duration: 2000
            });
          }


        },
        fail: function (e) {

        },
      })
    } else {
      console.log(num);
      //调用减少购物车接口 
      api.abotRequest({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=cart_del',
        data: {
          productid: productid,
          userid: userInfo.userid,
          checkstr: userInfo.checkstr,
          sellerid: app.get_sellerid()
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          //--init data
          var data = res.data;
          if (data.code == 1) {
            //that.data.productData.length =0;
            // that.loadProductData();

            // 购物车数据
            var cartlist = that.data.cartlist;
            cartlist.splice(bindex, 1);
            that.setData({
              cartlist: cartlist
            });
            that.sum();
          } else {
            wx.showToast({
              title: '操作失败！',
              duration: 2000
            });
          }


        },
        fail: function (e) {

        },
      })
    }
   


  },


  removeShopCard: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].amount;
    var productid = e.currentTarget.dataset.cartid;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {
        res.confirm && wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=cart_del',
          method: 'post',
          data: {
            productid: productid,
            userid: userInfo.userid,
            checkstr: userInfo.checkstr,
            sellerid: app.get_sellerid()
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            if (data.code == 1) {
              //that.data.productData.length =0;
              // that.loadProductData();

              // 购物车数据
              var carts = that.data.carts;
              carts.splice(index, 1);
              that.sum();
            } else {
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },





  showCartDetailf: function (e) {
    // this.setData({

    //   showCartDetail: true
    // })

    if (!this.data.showCartDetail) {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showCartDetail: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    } else {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      animation.translateY(200).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          // animationData: animation.export(),
          showCartDetail: false
        })
      }.bind(this), 200)
    }

    this.get_cart_list();

    
  },

  hiddenCartDetailf: function () {
    this.setData({
      showCartDetail: false
    });
    console.log(this.data.showCartDetail);
  },

  bindCheckout: function (e) {
    var that = this;
    var last_url = '/o2o/index/index';

    app.goto_user_login(last_url, 'normal');
    app.goto_get_userinfo(last_url, 'normal');


    var o2o_pintuan_begin_time = that.data.pintuan.o2o_pintuan_begin_time;
    var o2o_pintuan_end_time = that.data.pintuan.o2o_pintuan_end_time;

    var currentTime = (new Date()).getTime();//获取当前时间   
    currentTime = currentTime/1000;
    if (currentTime < o2o_pintuan_begin_time || currentTime > o2o_pintuan_end_time){
      wx.showModal({
        title: '提示',
        content: that.data.pintuan.o2o_pintuan_timeout_msg,
        showCancel: false,
        success(res) {

        }
      })
      return;
    }

  


    
    // 初始化toastStr字符串
    var toastStr = '';
    // 遍历取出已勾选的cid
    console.log('cartlist=======', this.data.cartlist)
    for (var i = 0; i < this.data.cartlist.length; i++) {
 
        toastStr += this.data.cartlist[i].productid + ',';
      
    }

    var product_list = toastStr.substring(0, toastStr.length - 1);

    var proId = product_list.split(",")
    console.log(product_list);
    console.log(proId);
    if (toastStr.length == 0) {
      wx.showModal({
        title: '提示',
        content: '购物车空空如也~',
        showCancel: false,
        success(res) {
          
        }
      })
      return false;
    }


    var flag = e.currentTarget.dataset.flag;  
    var all_price
    var order_option_key_and_value = []

    var tuanzhang_orderid = wx.getStorageSync('tzorderid_cache');//团长orderid
    var date_str = wx.getStorageSync('date_str');//预定日期

    order_option_key_and_value.push({ "key": "o2o_room_tuan_bid", "value": that.data.address_info.level04.bid }, { "key": "o2o_room_tuan_yuding", "value": date_str }, { "key": "o2o_room_tuan_roomid", "value": that.data.address_info.level04.roomid })


    if(flag == 1){
      all_price = this.data.total;   

    } else if (flag == 2){
      all_price = this.data.total_pintuan;

      order_option_key_and_value.push({ "key": "o2o_room_tuan_001", "value": "" })

    } else if (flag == 3){
      all_price = this.data.total_pintuan;
      order_option_key_and_value.push({ "key": "o2o_room_tuan_002", "value": tuanzhang_orderid })
    } 

    wx.setStorageSync('order_option_key_and_value', order_option_key_and_value);

    that.setData({
      is_show_choose_time: true,
      all_price: all_price
    })

    
  },


  get_cart_list:function(e){
    var that = this;
    console.log('userInfo===', userInfo)
    if (userInfo) {
      api.abotRequest({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=cart_list',
        data: {
          userid: userInfo.userid,
          sellerid: app.get_sellerid(),
          checkstr: userInfo.checkstr,
          page: 1
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          if(res.data.code == 1){
            that.setData({
              cartlist: res.data.data
            })
          }else{
            that.setData({
              cartlist: []
            })
          }
          
          that.sum();


        },
        fail: function (res) {

        }
      })
    }
  },
  toMenuList: function (e) {
    var that = this;
    var tzorderid = e.currentTarget.dataset.tzorderid
    wx.setStorageSync('tzorderid_cache', tzorderid)
    
    that.setData({
      is_pintuan: true,
    })
    
    wx.pageScrollTo({
      scrollTop: that.data.menuTop,
      duration: 300
    })
  },

  // 2.监听页面滚动距离scrollTop
  onPageScroll: function (e) {
    var that = this;
    // console.log(e.scrollTop);
    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位

    var query = wx.createSelectorQuery()//创建节点查询器 query
    query.select('#menu-list').boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
    query.exec(function (res) {
      var menuTopNow = res[0].top
      // console.log('menuTopNow', menuTopNow)

    
      if (menuTopNow <= 20) {

        that.setData({
          menuFixed: true,
          is_menu_list_scroll: true,
        })
      } else {
        that.setData({
          menuFixed: false,
          // is_menu_list_scroll: false,
        })
      }

      that.setData({
        menuTopNow: menuTopNow
      })

    }); 


    // if (e.scrollTop > that.data.menuTop) {
    //   that.setData({
    //     menuFixed: true,
    //     is_menu_list_scroll: true,
    //   })
    // } else {
    //   that.setData({
    //     menuFixed: false,
    //     is_menu_list_scroll: false,
    //   })
    // }

    
  },

  /**
 * 商品展示滚动
 */
  onGoodsScroll: function (e) {
    var that = this
    var scrollTop = e.detail.scrollTop
    var menuTopNow = that.data.menuTopNow

    if (scrollTop >= 0 && menuTopNow <= 20) {

      that.setData({
        is_menu_list_scroll: true,
      })
    } else {
      that.setData({
        is_menu_list_scroll: false,
      })
    }
    

    // for(var i=0; i<that.data.shanglist.length; i++){
    //   // console.log('ssssssssssaaaaaa', '#z' + that.data.shanglist[i].id)
    //   var query = wx.createSelectorQuery()//创建节点查询器 query
    //   query.select('#z' + that.data.shanglist[i].id).boundingClientRect()//这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
      
    //   query.exec(function (res) {
    //     //console.log('ssssssssssssssssss', res)
    //    console.log('!that.data.selectTop', res[0].top)
    //     console.log('!that.data.selectTop_now', that.data.selectTop)

    //     if(that.data.selectOrder == res[0].dataset.id){
    //       if ((res[0].top >= 50)){
    //         that.setData({
    //           selectOrder: that.data.lastselectOrder
    //         })
         
    //       }
    //     }

    //     if ((res[0].top <= 60) && (res[0].top >= that.data.selectTop-10) && that.data.selectTop) {
    //       console.log('aaaaaaaaaaaaa')
    //       // console.log('ssssssssssss' + i, res[0].id)
    //       that.setData({
    //         lastselectOrder: that.data.selectOrder,
    //         selectOrder: res[0].dataset.id,
    //         selectTop: res[0].top
    //       })
    //       console.log('55555555', that.data.selectTop)
    //     } else if ((res[0].top <= 50) && !that.data.selectTop){
    //       that.setData({
    //         selectOrder: res[0].dataset.id,
    //         selectTop: res[0].top
    //       })
    //       console.log('66666666', that.data.selectTop)
    //     }

    //   })
    // }
    
    // console.log('that.data.selectTop', that.data.selectTop)



       

    var scare = e.detail.scrollWidth / 250,
      scrollTop = e.detail.scrollTop,
      h = 0,
      selectOrder,
      len = this.data.shanglist.length;


    this.data.shanglist.forEach(function (classify, i) {
      var _h = 35;
      for (var i = 0; i < classify.menu.length; i++){
         _h +=  60 + classify.menu[i].imgheight;
      }
      // var _h = 35 + 176 * classify.menu.length;
      //console.log("srcollTop:" + scrollTop);
      //console.log(h - 100 / scare);
      if (scrollTop >= h) {
        selectOrder = classify.id; 
      }
     
      h += _h;
    });
    if(this.data.clickleft==1){
      this.setData({
        clickleft: 0,
      });
    }else{
      this.setData({
        selectOrder: selectOrder
      });
    }
    
  },




  menuImgLoad:function(e){
    var that = this;
    var productid = e.currentTarget.dataset.productid;
    var imgheight = e.detail.height;
    var imgwidth = e.detail.width;

   var ratio = 750 / that.data.screenWidth;

    //计算的高度值  
    var viewHeight = imgheight / ratio;

    
    var shanglist = that.data.shanglist;
    for (var i = 0; i < shanglist.length; i++){
      for (var j = 0; j < shanglist[i].menu.length; j++){
        if (shanglist[i].menu[j].productid == productid){
          shanglist[i].menu[j].imgheight = viewHeight
        }
      }
    }

    that.setData({
      shanglist: shanglist,
    })

  },



  //点击菜单左侧分类
  clickMenu:function(e){
    var that = this;
    var cate = e.currentTarget.dataset.cate
    var selectOrder = e.currentTarget.dataset.selectorder

    that.setData({
      is_menu_list_scroll:true,
      toView: cate,
      selectOrder: selectOrder,
      clickleft:1,
    })
  },

  // 选择配送时间
  selectTime:function(e){
    var idx = e.currentTarget.dataset.idx
    this.setData({
      currentTimeidx:idx
    })
  },


  shouHuoName: function (e) {
    var shouHuoName = e.detail.value;
    this.setData({
      shouHuoName: shouHuoName,
    })
  },
  mobileNo: function (e) {
    var mobileNo = e.detail.value;
    this.setData({
      mobileNo: mobileNo,
    })
  },

  //确定配送时间
  selectAgree:function(e){
    var that = this;
    if (!that.data.shouHuoName) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      })
      return;
    }

    if (!that.data.mobileNo) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return;
    }

    if (!(/^1[345789]\d{9}$/.test(that.data.mobileNo)) || that.data.mobileNo.length > 11) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'success',
        duration: 2000
      })
      return;
    }



    var weekItem = this.data.weekItem;


    weekItem.time = this.data.o2o_set_pei_song_time[this.data.currentTimeidx]

    wx.setStorageSync('weekItem', weekItem);


    var shouHuoInfo = {
      shouHuoName: that.data.shouHuoName,
      mobileNo: that.data.mobileNo,
    }



    wx.setStorageSync('weekItem', weekItem);

    wx.setStorageSync('shouHuoInfo', shouHuoInfo);
   

    var order_option_key_and_value = wx.getStorageSync('order_option_key_and_value');
    
    order_option_key_and_value.push({ "key": "o2o_room_tuan_yuding_hour", "value": this.data.o2o_set_pei_song_time[this.data.currentTimeidx]})

    wx.setStorageSync('order_option_key_and_value', order_option_key_and_value);


    // 初始化toastStr字符串
    var toastStr = '';
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.cartlist.length; i++) {

      toastStr += this.data.cartlist[i].productid + ',';

    }

    var product_list = toastStr.substring(0, toastStr.length - 1);

    var proId = product_list.split(",")
    console.log(product_list);
    console.log(proId);


    //存回data
    wx.navigateTo({
      url: '/pages/order/pay?productid=' + encodeURIComponent(JSON.stringify(proId)) + '&all_price=' + this.data.all_price,
    })
  },

  //关闭选择配送时间
  closeChooseTime:function(e){
    this.setData({
      is_show_choose_time: false,
    })
  },
  //拨打客服电话
  call_seller: function () {
    console.log('wxa_kefu_mobile_num', this.data.wxa_kefu_mobile_num)
    wx.makePhoneCall({
      phoneNumber: this.data.wxa_kefu_mobile_num,
    })
  },

  //选择星期
  chooseWeek:function(e){
    var index = e.currentTarget.dataset.idx

    var date_str = this.data.weeklist[index].str;
    var weekItem = this.data.weeklist[index];

    wx.setStorageSync('date_str', date_str)

    this.setData({
      currentTabWeek: index,
      weekItem: weekItem
    })
  },
  showPinTuan:function(e){
    var that = this;
    var is_showall_pintuan_list = that.data.is_showall_pintuan_list
    that.setData({
      is_showall_pintuan_list: !that.data.is_showall_pintuan_list
    })

    var len = that.data.tuan_order_list.length-3

    if(that.data.is_showall_pintuan_list){
      that.setData({
        menuTop: that.data.menuTop + len * 60
      })
    } else {
      that.setData({
        menuTop: that.data.menuTop - len * 60
      })
    }
    


    // if (!is_showall_pintuan_list) {
    //   var animation = wx.createAnimation({
    //     duration: 200,
    //     timingFunction: "linear",
    //     delay: 0
    //   })
    //   animation.translateY(100).step()
    //   this.setData({
    //     animationData: animation.export(),
    //     is_showall_pintuan_list: true
    //   })
    //   setTimeout(function () {
    //     animation.translateY(0).step()
    //     this.setData({
    //       animationData: animation.export()
    //     })
    //   }.bind(this), 200)
    // } else {
    //   var animation = wx.createAnimation({
    //     duration: 200,
    //     timingFunction: "linear",
    //     delay: 0
    //   })
    //   animation.translateY(100).step()
    //   this.setData({
    //     animationData: animation.export(),
    //   })
    //   setTimeout(function () {
    //     animation.translateY(0).step()
    //     this.setData({
    //       // animationData: animation.export(),
    //       is_showall_pintuan_list: false
    //     })
    //   }.bind(this), 200)
    // }

  },

  /**
     * 倒计时
     */
  setCountDown: function () {
    let time = 1000;
    let tuan_order_list  = this.data.tuan_order_list;
    let list = tuan_order_list.map((v, i) => {
      if (v.tuanzhang_timeout <= 0) {
        v.tuanzhang_timeout = 0;
      }
      let formatTime = this.getFormat(v.tuanzhang_timeout);
      v.tuanzhang_timeout -= 1;
      v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
      return v;
    })
    this.setData({
      tuan_order_list: list
    });
    setTimeout(this.setCountDown, time);
  },

  /**
   * 格式化时间
   */
  getFormat: function (msec) {
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

  
  


});