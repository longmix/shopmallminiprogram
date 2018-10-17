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

  wx.request({
      url: app.globalData.http_server+ 'g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: { 
        sellerid: app.get_sellerid(), 
        page: next_page
        },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var prolist = res.data.product_list;
        /*
            wx.setStorage({  
             key: "student",  
             data: res.data  
           }) 
           */
        if(prolist==''){
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        console.log(that.data.product_list);
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
    var sellerid = app.get_sellerid();
    console.log(sellerid+'yiyayiyayi');
    if (!sellerid||sellerid == null){
      this.onLoad();
    }
 //   this.onLoad();
    this.loadInfo();
    this.getColor();
    
  },
  getColor: function () {
    var that = this;

    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '333333333');

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);


    that.setData({
      icon_count: option_list.wxa_show_icon_index_count,
      wxa_show_index_icon: option_list.wxa_show_index_icon,
      wxa_show_index_swiper: option_list.wxa_show_index_swiper,
      wxa_show_pic_pinpu: option_list.wxa_show_pic_pinpu,
      wxa_show_search_input: option_list.wxa_show_search_input,
      wxa_show_toutiao: option_list.wxa_show_toutiao,
    });
    wx.setNavigationBarColor({
      frontColor: option_list.wxa_shop_nav_font_color,
      backgroundColor: option_list.wxa_shop_nav_bg_color,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });


/*
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_option',
      method: 'post',
      data: {
        sellerid: app.globalData.sellerid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code){
        var option_list = res.data.option_list;
        console.log(option_list);
        
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

*/



  },
  
  onPullDownRefresh: function () {
    this.onLoad();
  },
  onLoad: function (options) {
    this.loadImg();
    this.loadIcon();
    var that = this;

    //console.log(encodeURIComponent('https://yanyubao.tseo.cn/wxa/?sellerid=pQNNmSkaq'));
    //console.log(decodeURIComponent(encodeURIComponent('https://yanyubao.tseo.cn/wxa/?sellerid=pQNNmSkaq')));return;

    //请求服务器,刷新卡券信息
    console.log('网页参数如下:');
    console.log(options); //console.log(options.sellerid);

    var sellerid = null;
   // var q = options.q;
/*
    
    
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
    var options = options
    if (options || options!=null){
      if (!sellerid) {
        sellerid = options.sellerid;
        console.log('sellerid 02：' + sellerid);
      }

      if (!sellerid) {
        sellerid = options.scene;
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

    app.globalData.sellerid = sellerid
    app.set_sellerid(sellerid);
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

    console.log(userInfo);
    console.log(83838383)
    console.log(app.get_sellerid());
    //更新数据
    that.setData({
      userInfo: userInfo,
    });

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: {
        page: 1,
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code==1){
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
    };
    var cbError2 = function (res) {

    };
    app.httpPost(url2, data2, cbSuccess2, cbError2);
    //========End====================



    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_option',
      method: 'post',
      data: {
        sellerid: app.globalData.sellerid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var option_list = res.data.option_list;
        console.log(option_list);

        //保存到本地
        var option_list_str = JSON.stringify(option_list);

        //缓存返回数据
        wx.setStorageSync("option_list_str", option_list_str);

        console.log('保存商城选项：' + option_list_str);

        //刷新界面
        //this.getColor();




      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });



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



        var shop_icon = that.data.shop_icon
        wx.setStorage({
          key: 'shop_list',
          data: shop_list,
          success: function (res) {
            console.log('异步保存成功')
          }
        })
        wx.setNavigationBarTitle({
          title: that.data.shop_name
        })
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
    var userInfo = app.get_user_info();
    if ((!userInfo) || (!userInfo.userid)) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    var index = e.currentTarget.dataset.index;
    var url = that.data.icon_list[index].url;
    console.log(url);
    if (url == '../index/index' || url == '../category/index' || url == '../cart/cart' || url == '../user/user' ){
      wx.switchTab({
        url: url,
      })
    } else if (url=='duorenpintuan'){
      var url1 = 'https://yanyubao.tseo.cn/Home/DuorenPintuan/pintuan_list/ensellerid/' + app.get_sellerid() + '.html?click_type=Wxa';
    wx.navigateTo({
      url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1),
    })
    } else if (url == 'fenxiangkanjia') {
      var url1 = 'https://yanyubao.tseo.cn/Home/ShareKanjia/share_list/productid/' + that.data.productid + '.html?click_type=Wxa';
      wx.navigateTo({
        url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1),
      })
    } else {
      wx.navigateTo({
        url:url
      })
    }
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

    return {
      title: '' + app.globalData.shop_name,
      path: '/pages/index/index?sellerid='+app.globalData.default_sellerid,
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
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

console.log('qqqqqqqqqqqqqqqqqqqqqq');
    console.log(imgheights);

    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },



});