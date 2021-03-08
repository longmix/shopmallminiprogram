// pages/welcome_page/welcome_page.js
/**
 * 2020.4.29. 支持视频播放，需要在data中，除了返回 title+ info，或者 image+url 之外，
 *           还需要返回 video_url + video_cover_url，如果自动播放，还需要返回 video_autoplay
 */
var app = getApp();

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    get_default_imgid:false,
    content_type:'cms',
    video_autoplay:false,
    current_title : ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('welcome welcome welcome ====>>', options);

    //options.scene = '2176@0';
    //options.data_url = 'https://yanyubao.tseo.cn/openapi/Jianghanyinhua/get_order_scan_report_page?orderno=20170123172139NJVOPW&messageid=2968';

    if (options.scene != null) {
      //1、指定渠道
      var url_value = decodeURIComponent(options.scene);

      console.log(url_value);

      var url_data = url_value.split('@');
      console.log(url_data);

      if (url_data.length < 3) {
        //跳转到首页
        wx.switchTab({
          url: '../index/Liar'
        })
        return;
      }

      var imgid = url_data[0];
      var parentid = url_data[1];
      var platform = url_data[2];

      app.set_current_parentid(parentid);

      if(platform == 'cms'){
        this.__get_img_from_weiduke(imgid, this);
      }
      else if(platform == 'pic'){
        this.__get_pic_from_yanyubao(imgid, this);

        this.setData({
          content_type:'pic'
        });
      }

      
    }
    else if(options.data_url){
      //2、 指定网址
      var parentid = options.parentid;
      if(parentid){
        app.set_current_parentid(parentid);
      }

      this.__get_img_from_data_url(decodeURIComponent(options.data_url), this);

    }
    else{
      //3、其他方式：直接传参（平台类型、推荐者、类型对应的ID）
      var imgid = options.imgid;
      var parentid = options.parentid;
      var platform = options.platform;

      if(parentid){
        app.set_current_parentid(parentid);
      }

      if(!platform){
        platform = 'cms';
      }

      if(platform == 'cms'){
        if(imgid){
          imgid = 0;
  
          this.__get_img_from_weiduke(imgid, this);
        }
        else{
          this.setData({get_default_imgid:true});
        }
      }
      else if(platform == 'pic'){
        this.__get_pic_from_yanyubao(imgid, this);
        this.setData({content_type:'pic'});
      }
      
    }

    app.set_option_list_str(this, this.__handle_option_list);



  },

  __handle_option_list:function(that, option_list){
    app.getColor();

    if(this.data.get_default_imgid && option_list && option_list.wxa_default_imgid_in_welcome_page){
      this.__get_img_from_weiduke(option_list.wxa_default_imgid_in_welcome_page, this);
    }


    if(!option_list || !option_list.wxa_show_latest_product_in_welcome_page){
      return;
    }

    //获取最新的商品信息
    var wxa_show_latest_product_in_welcome_page = option_list.wxa_show_latest_product_in_welcome_page;

    that.setData({
      wxa_show_latest_product_in_welcome_page : wxa_show_latest_product_in_welcome_page
    });

    if(wxa_show_latest_product_in_welcome_page == 1){
      console.log('66666666666', that.data.cataid)
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
        method: 'post',
        data: {
          sellerid: app.get_sellerid(),
          keyword: that.data.searchValue ? that.data.searchValue : '',
          sort: 1,
          page: that.data.page,
          cataid: that.data.cataid ? that.data.cataid : ''
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var data = res.data.product_list;
          if (data == '') {
            wx.showToast({
              title: '没有更多数据！',
              duration: 2000
            });
            that.setData({
              is_more: false,
            })
            return false;
          }
          that.setData({
            shopList: data,
            page: 1,
            is_more: true,
          });
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });

    }

  },

  __get_img_from_weiduke: function (imgid, that){

    wx.showLoading({
      title: '数据加载中……',
    });

    var url = app.globalData.http_weiduke_server + 'index.php/openapi/ArticleImgApi/article_detail.shtml';
    var data = {
      token: app.get_current_weiduke_token(),
      id: imgid,
      openid: app.get_current_openid()
    };


    var cbSuccess = function (res) {
      wx.hideLoading();

      if (res.data.code == 1) {
        //var wz_keyword = res.data.data.keyword;
        that.setData({
          //wz_content: res.data.data.content,
          //wz_title: res.data.data.title
        });

        wx.setNavigationBarTitle({
          title: res.data.data.title
        })
        that.setData({
          current_title: res.data.data.title
        });

        WxParse.wxParse('content', 'html', res.data.data.info, that, 15);

        if (res.data.data.video_url) {
          that.setData({
            video_url: res.data.data.video_url,
            video_cover_url: res.data.data.video_cover_url,
          });

          if (res.data.data.video_autoplay) {
            that.setData({
              video_autoplay: true
            });
          }
        }
      }
    };
    var cbError = function (res) {
      wx.hideLoading();

    };
    app.httpPost(url, data, cbSuccess, cbError);
      //========End====================
  },

  __get_pic_from_yanyubao:function(imgid, that){
    wx.showLoading({
      title: '数据加载中……',
    });

    var url = app.globalData.http_server + 'index.php/openapi/SupplierData/get_swiper_pic_url';
    var data = {
      sellerid: app.get_sellerid(),
      swiperid:imgid
    };

    var userInfo = app.get_user_info();
    if(userInfo){
      data.userid = userInfo.userid;
      data.checkstr = userInfo.checkstr;
    }

    var cbSuccess = function (res) {
      wx.hideLoading();

      if (res.data.code == 1) {
        that.setData({
          content_pic_image: res.data.data.image,
          content_pic_url : res.data.data.url
        });

        if (res.data.data.video_url) {
          that.setData({
            video_url: res.data.data.video_url,
            video_cover_url: res.data.data.video_cover_url,
          });

          if (res.data.data.video_autoplay) {
            that.setData({
              video_autoplay: true
            });
          }
        }

      }
    };
    var cbError = function (res) {
      wx.hideLoading();

    };
    app.httpPost(url, data, cbSuccess, cbError);





  },
  __get_img_from_data_url: function (data_url, that){

    wx.showLoading({
      title: '数据加载中……',
    });

    var data = {
      openid: app.get_current_openid()
    };



    var cbSuccess = function (res) {
      wx.hideLoading();

      if (res.data.code == 1) {
        //var wz_keyword = res.data.data.keyword;
        that.setData({
          //wz_content: res.data.data.content,
          //wz_title: res.data.data.title
        });

        wx.setNavigationBarTitle({
          title: res.data.data.title
        })
        that.setData({
          current_title: res.data.data.title
        });

        WxParse.wxParse('content', 'html', res.data.data.info, that, 15);

        console.log('__get_img_from_data_url====>>>>>', res);

        if(res.data.data.video_url){
          that.setData({
            video_url: res.data.data.video_url,
            video_cover_url: res.data.data.video_cover_url,
          });

          if(res.data.data.video_autoplay){
            that.setData({
              video_autoplay: true
            });
          }
        }
      }
    };
    var cbError = function (res) {
      wx.hideLoading();

    };
    app.httpPost(data_url, data, cbSuccess, cbError);
      //========End====================
  },

  //点击图片的跳转事件
  content_pic_click:function(e){
    var url = e.currentTarget.dataset.url;

    console.log('welcome page 准备跳转至：'+url);

    var var_list = Object();

    app.call_h5browser_or_other_goto_url(url, var_list, 'pages_index');



  },



  


  //详情页跳转
  lookdetail: function (e) {
    console.log(e)
    var lookid = e.currentTarget.dataset.procuctid;
    console.log(lookid);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    /*wx.reLaunch({
      url: '../index/index'
    })*/
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('app.globalData.shop_name : ' + app.globalData.shop_name);

    //var share_url = '/pages/index/index?sellerid=' + app.globalData.sellerid;

    
    return {
      title: '' + this.data.current_title,
      //path: share_url,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }

  },

  videometa:function(e){
    console.log('videometa======>>>>>', e);

    var imgwidth = e.detail.width;
    var imgheight = e.detail.height;


    //宽高比  
    var ratio = imgwidth / imgheight;

    console.log(imgwidth, imgheight)

    var current_view_width = 750;

    current_view_width = current_view_width ;

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

})