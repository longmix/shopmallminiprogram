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

    platform:'cms',

		//分享转发使用
		current_title : '',	
		current_params_str:'',
		wxa_share_img:'',

		//网络请求的表单数据
		callback_data:'',
		//是否显示表单数据
    show_welcome_page_tag:0,
    

    //插件之外的参数，用于标志这个页面是否显示最新的商品列表
    wxa_show_latest_product_in_welcome_page:0,

    current_option:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('welcome welcome welcome ====>>', options);

    


    //=====分析参数，用于分享转发=====
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



    if(!options.platform){
			options.platform = this.data.platform;
    }


    options.sellerid = app.get_sellerid();

    //options.sellerid = 'pQNNmSkaq';

    this.setData({
      current_option : options

    });

    app.set_option_list_str(this, this.__handle_option_list);
    

    

  },

  __call_plugin_welcome_page:function(options){
    var welcome_data_params = {
          data:{
            sellerid:options.sellerid,
            platform : options.platform,
            imgid: options.imgid,
          }, 
          callback:this.welcome_page_callback
    };

    if(options.scene){
      welcome_data_params.data.scene = options.scene;
    }

    if(options.data_url){
      welcome_data_params.data.data_url = options.data_url;
    }

    //==== 以下四个参数，在组件外调用的时候，可以在小程序章具体定义 ====
    if(options.parentid){
      welcome_data_params.data.parentid = options.parentid;
    }

    //这三个参数，shopapp项目具体自定义
    welcome_data_params.data.openid = app.get_current_openid();
    var user_info = app.get_user_info();

    if(user_info){
      welcome_data_params.data.userid = user_info.userid;
      welcome_data_params.data.checkstr = user_info.checkstr;
    }
    //=================== End ============================

    wx.showLoading({
      title: '数据加载中...',
    });

    //通过插件中的函数调用
    var my_plugin = requirePlugin('yyb_selfform_plugin');
    my_plugin.get_welcome_page_data(welcome_data_params);


  },

  __handle_option_list:function(that, option_list){
    app.getColor();

    var options = that.data.current_option;



    //是否有默认的页面ID
    var default_imgid = 0;
    if(option_list && option_list.wxa_default_imgid_in_welcome_page){
      default_imgid = option_list.wxa_default_imgid_in_welcome_page;
    }

    if(!options.scene && !options.data_url && !options.imgid){
      options.imgid = default_imgid;
      options.platform = 'cms';
    }

    //调用插件
    that.__call_plugin_welcome_page(options);




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

    
    return {
      title: '' + this.data.current_title,
			//path: share_url,
			imageUrl: this.data.wxa_share_img,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }

  },
  onShareTimeline: function () {

    return {
      title: this.data.current_title,
      query: this.data.current_params_str,
      imageUrl:this.data.wxa_share_img
    }
  },
  onAddToFavorites: function () {
    return this.onShareTimeline();
	},

	welcome_page_callback:function(callback_data){

    console.log('页面收到data中的回调数据 welcome_page_callback====>>>>', callback_data);
    
    wx.hideLoading({
			success: (res) => {},
		});
  
		if(callback_data.code != 1){
			console.log('数据状态码不对');
			return;
		}

		var callback_data_str = JSON.stringify(callback_data);


		//头部导航的颜色
		if(callback_data.wxa_shop_nav_font_color && callback_data.wxa_shop_nav_bg_color){
			wx.setNavigationBarColor({
				frontColor: callback_data.wxa_shop_nav_font_color,
				backgroundColor: callback_data.wxa_shop_nav_bg_color,

				// animation: {
				//   duration: 40,
				//   timingFunc: 'easeIn'
				// }
			});
		}

		//显示组件到界面
		this.setData({
		  callback_data:callback_data_str,
		  show_welcome_page_tag : 1
		});

		//渲染其他数据：标题
		if(callback_data.data.title){
			this.setData({
				current_title: callback_data.data.title
			});

			wx.setNavigationBarTitle({
				title: this.data.current_title,
			})

		}

		//渲染其他数据：分享的图片
		if(this.data.platform == 'cms'){
			this.setData({
				wxa_share_img: callback_data.data.pic
			});
		}
		else if(this.data.platform == 'pic'){
			this.setData({
				wxa_share_img: callback_data.data.image
			});
		}

		console.log('current_title ===>>>', this.data.current_title);
		console.log('wxa_share_img ===>>>', this.data.wxa_share_img);
		console.log('current_params_str ===>>>', this.data.current_params_str);

	},
	
	link_item_click: function(e){
		console.log('bottom_icon_click===>>>', e);
		//console.log('bottom_icon_click===>>>', url);


		var url = e.detail.url;

		console.log('被点击的网址：' + url);

		//====== 在这里重写链接或路径被点击的事件，
		//====== 例如跳转到其他界面，或者拨打电话，或者打开webview

    //xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    
    app.call_h5browser_or_other_goto_url(url);


		//============== End ================



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


	



})