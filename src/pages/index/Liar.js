var dsq, dsq1, a = getApp();
var app = getApp();

Page({
    data: {
        imgUrls: [ "http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg", "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg", "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg" ],
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
      wxa_shop_toutiao_flash_line:0,

      //所有图片的高度  
      imgheights: [],
      //图片宽度 
      imgwidth: 750,
      //默认  
      current: 0
    },
    tggg: function() {
        clearInterval(dsq), clearTimeout(dsq1), wx.reLaunch({
            url: "index"
        });
    },

  onLoad: function (options) {
    var that = this;

    var sellerid = null;

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

    app.globalData.sellerid = sellerid
    app.set_sellerid(sellerid);

    if(app.globalData.is_ziliaoku_app == 1){

      wx.reLaunch({
        url: "/cms/index/index"
      });


      return;
    }
<<<<<<< HEAD
    else if (app.globalData.is_o2o_app == 1) {

  
      wx.reLaunch({
        url: "/o2o/index/index"
      });


      return;
    }
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e



    //请求服务器，并根据服务器返回，做不同的页面显示
    app.set_option_list_str(this, this.callback_function);
<<<<<<< HEAD
    
    app.set_option_list_str(null, app.getColor());
=======
      
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
      
    },

  // callback_function callback_function callback_function
  callback_function: function (that, cb_params){
    var option_list = app.globalData.option_list;


    console.log('callback_function+++++:::' + cb_params)

    if (!option_list){
      return;
    }



    if (option_list.wxa_shop_toutiao_icon) {
      that.setData({
        wxa_shop_toutiao_icon: option_list.wxa_shop_toutiao_icon
      })

    }


<<<<<<< HEAD
=======

    app.getColor();

>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    if (option_list.wxa_shop_operation_status == 0) {
      wx.reLaunch({
        url: "index_off"
      });
    } else if (!option_list.wxa_hidden_shop || (option_list.wxa_hidden_shop != 1)) {
      wx.reLaunch({
        url: "index"
      });
      return
    } else {

      if (!option_list) {
        return;
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


      that.loadImg()
      that.initArticleList()
      
      //=====更新商户头条=================
      var url2 = app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=get_yingxiao_latest_img&sellerid=' + app.get_sellerid();
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

          app.set_current_weiduke_token(res.data.data[0].token);
        }
      };
      var cbError2 = function (res) {

      };
      app.httpPost(url2, data2, cbSuccess2, cbError2);
      //========End====================

      //首页滚动广告
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
    }

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
      
      if (_this.data.wxa_shop_toutiao_flash_line==2){
        var data = res.data.data;
        var articlelist2 = [];
        for (var i = 0, length = data.length - 1; i < (length / 2); i++) {
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
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.onLoad(), wx.stopPullDownRefresh();
    },
    bindchange: function (e) {
      // console.log(e.detail.current)
      this.setData({ current: e.detail.current })
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
    touTiaoList: function (e) {
      console.log('点击商户头条进入列表');
      wx.navigateTo({
        url: '../help/help?sellerid=' + app.get_sellerid()
      })
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
  touTiaoItem: function (e) {
    console.log('点击商户头条进入该详情' + e.currentTarget.dataset.id);

    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../help_detail/help_detail?id=' + id + '&sellerid=' + app.get_sellerid()

    })
  },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});