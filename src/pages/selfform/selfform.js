// pages/selfform/selfform.js
var app = getApp();

var api = require('../../utils/api');
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //2021.3.9. 当前的sellerid
    current_sellerid:'',

    current_params_str:'',

    //网络请求的表单数据
    callback_data:'',
    //是否显示表单数据
    show_selfform_tag:0,

    //分享转发相关
    current_title:'',
    wxa_share_img:'',

  },

  /**
   * 生命周期函数--监听页面加载
   * 
   * 2021.4.10. 调用插件，与标准的不同的参数：token，插件中的参数名为 form_token，需要转换，其他不变。
   * 
   */
  onLoad: function (options) {
    
    console.log('selfformselfform=====>>>>>', options);   

    app.set_option_list_str(this, this.__handle_option_list);

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
    


    var form_type = 0;
    var current_token = '';
    var current_formid = 0;

    

    //=======处理 scene 参数======
    if (options.scene) {

      var url_value = decodeURIComponent(options.scene);
      var url_data = url_value.split('#');

      console.log(url_data);
      console.log(url_data[1]);

      if (url_data.length >= 3) {
        form_type = url_data[0];
        current_token = url_data[1];
        current_formid = url_data[2];

        options['form_type'] = form_type;
        options['token'] = current_token;
        options['formid'] = current_formid;
      }
    }    
    //========= End =========

    if (form_type == 0){
      form_type = options.form_type;
    }
    
    this.setData({
      form_type: form_type
    })

    //===========================================

    //如果 type == 1，读取会员属性，需要强制登陆
    //（标准的插件里面没有这个判断，所以必须在这里做）
    if (form_type == 1) {

      var last_url = '/pages/selfform/selfform?' + this.data.current_params_str;

      if(app.goto_user_login(last_url)){
        return;
      }
    }
    //===========================================


    //this.setData({ current_option: options });


    options['sellerid'] = app.get_sellerid();

    var selfform_data_params = {
          data:{
            sellerid:options.sellerid, 
            form_token: options.token,
            formid : options.formid,
            form_type : options.form_type,

          }, 
          callback:this.__selfform_data_callback
    };

    //是否带submit_url参数
    if(options.submit_url){
      selfform_data_params.data.submit_url = decodeURIComponent(options.submit_url);
    }


    /* 这三项应该从项目内部读取！！！！！

    if(options.openid){
      selfform_data_params.data.openid = options.openid;
    }

    if(options.userid){
      selfform_data_params.data.userid = options.userid;
    }
    if(options.checkstr){
      selfform_data_params.data.checkstr = options.checkstr;
    }*/
    
    selfform_data_params.data.openid = app.get_current_openid();

    //检查是否有隐藏域
    //var hidden_list = [];
    for(var key in options){
      if((key == 'form_type')||(key == 'submit_url')||(key == 'formid')
        || (key == 'cataid') || (key == 'sellerid') || (key == 'token')){
          continue;
      }

      if(!options[key]){
        continue;
      }

      console.log('key==>>>', key);
      console.log('value==>>>', options[key]);

      //hidden_list[key] = options[key];
      selfform_data_params.data[key] = options[key];
    }

    //console.log('11111111111111111111====>>隐藏域：',hidden_list);

    //console.log('11111111111111111111====>> length ：',hidden_list.length);

    console.log('11111111111111111111====>>完整的提交数据01：', selfform_data_params.data);




    var user_info = app.get_user_info();
   
    if(user_info){
      selfform_data_params.data.userid = user_info.userid;
      selfform_data_params.data.checkstr = user_info.checkstr;
    }

    console.log('调用yyb_selfform_plugin函数的参数：===>>>', selfform_data_params);


    wx.showLoading({
			title: '数据加载中...',
		});


    //引用第三方插件的函数
    var my_plugin = requirePlugin('yyb_selfform_plugin');
    my_plugin.get_selfform_data(selfform_data_params);




    
  },
  //=================onLoad结束==================

  __handle_option_list: function (that, option_list) {
    var wxa_shop_nav_bg_color = app.getColor();

    console.log('================>>>>', option_list);

    that.setData({
      current_option_list : option_list
    });

    if (!option_list.wxa_shop_nav_font_color){
      option_list.wxa_shop_nav_font_color = '#000';
    }

    if (wxa_shop_nav_bg_color){
      this.setData({
        btn_background_color: wxa_shop_nav_bg_color,
        btn_text_color: option_list.wxa_shop_nav_font_color
      })
    }
    else{
      this.setData({
        btn_background_color: '#00BFFF',
        btn_text_color:'#000'
      })

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
      title: this.data.current_title,
      path: 'pages/selfform/selfform?'+this.data.current_params_str, 
      imageUrl:this.data.wxa_share_img,
    }

  },
  /*朋友圈分享*/
  onShareTimeline: function () {
    
    return {
      title: this.data.current_title,
      query: this.data.current_params_str, 
      imageUrl:this.data.wxa_share_img
    }
  },
  /**加入收藏夹 */
  onAddToFavorites: function () {
    return this.onShareTimeline();
  },


  __selfform_data_callback:function(callback_data){

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
      show_selfform_tag : 1
    });


    //渲染其他数据：
    //渲染其他数据：标题 & 分享的图片
    if(callback_data.request_params_data.form_type == 1){
      //会员扩展属性
      this.setData({
        current_title: callback_data.shop_option_list.wxa_share_title,
        wxa_share_img: callback_data.shop_option_list.wxa_share_img
      });
    }
    else if(callback_data.request_params_data.form_type == 2){
      //万能表单
      this.setData({
        current_title: callback_data.title,
        wxa_share_img: callback_data.data.logourl
      });

    }
    else if(callback_data.request_params_data.form_type == 3){
      //CMS的文章分类
      this.setData({
        current_title: callback_data.title,
        wxa_share_img: callback_data.shop_option_list.wxa_share_img
      });

    }

    console.log('准备修改标题 setNavigationBarTitle ：===>>>'+this.data.current_title);

    wx.setNavigationBarTitle({
      title: this.data.current_title,
    })


    
  },
  link_item_click : function(e) {
    console.log('bottom_icon_click===>>>', e);
		//console.log('bottom_icon_click===>>>', url);


		var url = e.detail.url;

		console.log('被点击的网址：' + url);

		//====== 在这里重写链接或路径被点击的事件，
		//====== 例如跳转到其他界面，或者拨打电话，或者打开webview

    //xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    
    app.call_h5browser_or_other_goto_url(url);


		//============== End ================
  }



})