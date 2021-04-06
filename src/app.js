// app.js
App({

  globalData: {
    

    //通版商城，
    xiaochengxu_appid: 'wx00d1e2843c3b3f77', //，，需要这个参数的地方：get_session_key
    default_sellerid: 'pQNNmSkaq', //大卖家服务市场

    shop_name: '通版商城小程序',

    //============以下为开发过程中使用=======
    //default_sellerid: 'pmyxQxkkU',  // 13112341234


    //xiaochengxu_appid: 'wx93c05a83c11904b5',
    //default_sellerid: 'fmJyUPkWj', //  连云港顺鸿欣远 //开心拼享购

    // shopListdefault_sellerid: 'fNzJUPqgq',//韩品购
    //default_sellerid: 'fzyzUPgjP',//敦煌丝路

    // default_sellerid: 'fQSzUPggU', //乐相邻

    // default_sellerid: 'fXiNUPaWV',//说彩商城

    //default_sellerid: 'fzXJUPWqa', //慕斯兰

    //  default_sellerid:'fyXiUPUUg', //趣抽盒

    //  default_sellerid: 'fmJyUPkWj',

    //  default_sellerid: 'fxiyUPgee',


    //default_sellerid: 'pQNNmSkaq', //http://192.168.0.205/yanyubao_server/

    

    version_number: "1.2.0",

    kefu_telephone:"",
    kefu_qq:"",
    kefu_website:"",
    kefu_gongzhonghao:"",

    //sellerid: '',
    //force_sellerid: 0,


    http_weiduke_server: 'https://cms.weiduke.com/',
    //  http_server:'http://192.168.0.205/yanyubao_server/',

    http_server: 'https://yanyubao.tseo.cn/',
    //  http_server: 'http://192.168.0.87/yanyubao_server/',

    userInfo: {}

  },


  onLaunch: function () {   
    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);    
    

    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    })

    console.log('ttttttttttttt3');
    //login
   // this.getUserInfo();
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}

    this.globalData.xiaochengxu_appid = extConfig.xiaochengxu_appid;

    //强制设置当前的appid
    
    // const accountInfo = wx.getAccountInfoSync();
    
    // if (accountInfo && accountInfo.miniProgram && accountInfo.miniProgram.appId) {
    //   this.globalData.xiaochengxu_appid = accountInfo.miniProgram.appId;
    // }
    
    console.log('当前小程序为：' + this.globalData.xiaochengxu_appid);


    this.globalData.force_sellerid = 0;

    if (extConfig.force_sellerid_flag == 1) {
      this.globalData.force_sellerid = 1;
      this.globalData.default_sellerid = extConfig.force_sellerid_value;
    }

    if (extConfig.shop_name){
      console.log("444444", extConfig.shop_name)
      this.globalData.shop_name = extConfig.shop_name;

      wx.setNavigationBarTitle({
        title: this.globalData.shop_name
      })

    }
    if (extConfig.version_number) {
      this.globalData.version_number = extConfig.version_number;
    }

    if (extConfig.navigationBarBackgroundColor_fixed) {
      this.globalData.navigationBarBackgroundColor_fixed = extConfig.navigationBarBackgroundColor_fixed;
    }


    

    if (extConfig.kefu_telephone) {
      this.globalData.kefu_telephone = extConfig.kefu_telephone;
    }
    if (extConfig.kefu_qq) {
      this.globalData.kefu_qq = extConfig.kefu_qq;
    }
    if (extConfig.kefu_qq) {
      this.globalData.kefu_qq = extConfig.kefu_qq;
    }
    if (extConfig.kefu_website) {
      this.globalData.kefu_website = extConfig.kefu_website;
    }
    if (extConfig.kefu_gongzhonghao) {
      this.globalData.kefu_gongzhonghao = extConfig.kefu_gongzhonghao;
    }

    if (extConfig.is_ziliaoku_app) {
      this.globalData.is_ziliaoku_app = extConfig.is_ziliaoku_app;
    }
    if (extConfig.is_o2o_app) {
      this.globalData.is_o2o_app = extConfig.is_o2o_app;
    }

    //从服务器上获取信息
    //this.get_shop_info_from_server(null);

    //请求服务器，并根据服务器返回，做不同的页面显示
    //this.set_option_list_str(this, null);



  },

  

  get_shop_info_from_server: function (callback_function) {
    var that = this;

    console.log('111111111111111 get_shop_info_from_server')

    var shop_list = wx.getStorageSync("shop_info_from_server_str_" + that.get_sellerid());

    if (shop_list) {
      
      //刷新界面
      typeof callback_function == "function" && callback_function(shop_list);
      

      return;

    }

    wx.request({
      url: that.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_info',
      method: 'post',
      data: {
        sellerid: that.get_sellerid()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {
          var shop_list = res.data.data;

          that.globalData.shop_name = shop_list.shop_name;

          wx.setStorage({
            key: 'shop_info_from_server_str_' + that.get_sellerid(),
            data: shop_list,
            success: function (res) {
              console.log('异步保存成功');

              if (callback_function) {
                typeof callback_function == "function" && callback_function(shop_list);
              }

            }
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
  set_user_info: function (user_info) {
    console.log("准备保存用户数据：");
    console.log(user_info);

    var user_info_str = JSON.stringify(user_info);

    //缓存返回数据
    wx.setStorageSync("wxa_user_info", user_info_str);

    //console.log('111111111111111111');
    //console.log(wx.getStorageSync("wxa_user_info"));
  },
  get_user_info: function () {
    //缓存返回数据
    var user_info_str = wx.getStorageSync("wxa_user_info");

    console.log("获取小程序用户数据：" + user_info_str + '333333333');

    if (!user_info_str) {
      return null;
    }

    return JSON.parse(user_info_str);
  },
  del_user_info: function () {
    //缓存返回数据
    wx.removeStorageSync("wxa_user_info");

  },
  /**
   * page_type normal/switchTab
   */
  goto_user_login: function (last_url, var_list=null, ret_page=''){
    var userInfo = this.get_user_info();

    console.log('goto_user_login===last_url', last_url);
    console.log(userInfo);

    console.log('goto_user_login:0000000000000000');

    if ((!userInfo) || (!userInfo.userid)) {
      console.log('goto_user_login:222222222222');

      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: function (res) {

          if (last_url) {
            wx.setStorageSync('login_last_url', last_url);
            wx.setStorageSync('login_var_list', var_list);
            wx.setStorageSync('login_ret_page', ret_page);
          }

          wx.redirectTo({
            url: '/pages/login/login',
          })
          
        }
      })

      return true;

    }

    console.log('goto_user_login:333333333');

    //this.call_h5browser_or_other_goto_url(last_url, var_list, ret_page);

    return false;
    

  },

 /**
   * page_type normal/switchTab
   * 获取用户的头像和昵称
   */
  goto_get_userinfo: function (last_url, page_type){
    var userInfo = this.get_user_info();
    if (!userInfo){
      return false;
    }

    var is_get_userinfo = userInfo.is_get_userinfo;
    console.log('is_get_userinfo', is_get_userinfo)
    if (!is_get_userinfo) {
      if (last_url) {
        wx.setStorageSync('get_userinfo_last_url', last_url);
        wx.setStorageSync('get_userinfo_page_type', page_type);
      }
      
      wx.navigateTo({
        url: '/pages/login/login_get_userinfo',
      });

      return true;
    }

    return false;
  },
  



  check_user_login: function () {
    var user_info_str = wx.getStorageSync("wxa_user_info");
    console.log("获取小程序用户数据：" + user_info_str);
    if (user_info_str) {
      var user_info = JSON.parse(user_info_str);
      if (user_info) {
        if (user_info.userid > 0) {
          return;
        }
      }
    }

    //如果userid等于0,则提示绑定手机号
    console.log("需要用户登录");
    wx.navigateTo({
      url: '../login/login'
    });

    return true;

  },
  set_current_parentid: function(parentid){
    if(!parentid){
      return;
    }

    console.log("设置parentid：" + parentid);

    //缓存返回数据
    wx.setStorageSync("current_parentid", parentid);
  },
  get_current_parentid: function(){
    var parentid = wx.getStorageSync("current_parentid");
    console.log("获取parentid：" + parentid);

    if(!parentid){
      parentid = 0;
    }

    return parentid;
  },
  set_sellerid: function (sellerid) {
    console.log("设置sellerid：" + sellerid);

    //缓存返回数据
    wx.setStorageSync("current_sellerid", sellerid);
  },
  get_sellerid: function () {
    if (this.globalData.force_sellerid == 1){
      return this.globalData.default_sellerid
    }
    //缓存返回数据
    var sellerid = wx.getStorageSync("current_sellerid");

    console.log("获取sellerid：" + sellerid);

    if ((sellerid == null) || (sellerid.length == 0)) {
      var that = this
      sellerid = that.globalData.default_sellerid;
      
      console.log("0000000000000000000获取sellerid不成功，使用默认sellerid：" + that.globalData.default_sellerid + ' ==>>  ' + sellerid);
    }

    return sellerid;
  },
  getColor:function(){
    //从本地读取
    var option_list_str = wx.getStorageSync('shop_option_list_str_' + this.get_sellerid());


    if (!option_list_str) {
      //return null;

       wx.showToast({
        title: '数据更新中……',
         icon:'loading'
      });

      //this.set_option_list_str(this, this.getColor);

      return;
  
    }
     
    
    var option_list =  JSON.parse(option_list_str);

    this.globalData.option_list = option_list;

    console.log('oplist-----', option_list.wxa_shop_nav_bg_color);

    //console.log('111111111111111111111111111111::' + this.globalData.navigationBarBackgroundColor_fixed);

    if (this.globalData.navigationBarBackgroundColor_fixed != 1){

      if (option_list && option_list.wxa_shop_nav_font_color && option_list.wxa_shop_nav_bg_color) {
        wx.setNavigationBarColor({
          frontColor: option_list.wxa_shop_nav_font_color,
          backgroundColor: option_list.wxa_shop_nav_bg_color,

          // animation: {
          //   duration: 40,
          //   timingFunc: 'easeIn'
          // }
        });
      }
    }

    //2020.7.29. 隐藏底部导航的选项
    if(option_list && (option_list.wxa_hidden_tabbar == 1)){
      wx.hideTabBar({
        animation: false,
      })
    }

    
    return option_list.wxa_shop_nav_bg_color;
    /*wx.setTabBarStyle({
      color: '#858585',
      selectedColor: option_list.wxa_shop_nav_font_color,
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    })*/
  
  },
  
  set_option_list_str: function (that, callback_function) {
    //console.log('调用set_option_list_str=========================》》》》》');

    var currentTime = (new Date()).getTime();//获取当前时间

    if (wx.getStorageSync('shop_option_list_str_' + this.get_sellerid()) && (currentTime - wx.getStorageSync("option_list_str_time")) < 3600 * 1000) {
      
      var option_list = JSON.parse(wx.getStorageSync('shop_option_list_str_' + this.get_sellerid()))

      this.globalData.option_list = option_list;
      
      //console.log(' this.globalData.option_list===========', this.globalData.option_list)

      //刷新界面
      typeof callback_function == "function" && callback_function(that, option_list);

    } else {


      var that002 = this;

      wx.request({
        url: this.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_option',
        method: 'post',
        data: {
          sellerid: this.get_sellerid()          
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var option_list = res.data.option_list;

          that002.globalData.option_list = option_list;


          //保存到本地
          var option_list_str = JSON.stringify(option_list);

          //缓存返回数据
          wx.setStorageSync('shop_option_list_str_' + that002.get_sellerid(), option_list_str);
          var currentTime = (new Date()).getTime();//获取当前时间
          wx.setStorageSync("option_list_str_time", currentTime);

          console.log('保存商城选项：' + option_list_str);

          //刷新界面
          typeof callback_function == "function" && callback_function(that, option_list);

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


  set_current_openid: function (openid) {
    if (!openid) {
      return;
    }

    console.log("设置openid：" + openid);

    //缓存返回数据
    wx.setStorageSync("current_openid", openid);
  },
  get_current_openid: function () {
    var openid = wx.getStorageSync("current_openid");
    console.log("获取openid：" + openid);

    if (!openid) {
      openid = null;
    }

    return openid;
  },

  set_current_weiduke_token: function (weiduke_token) {
    if (!weiduke_token) {
      return;
    }

    console.log("设置weiduke_token：" + weiduke_token);

    //缓存返回数据
    wx.setStorageSync("current_weiduke_token", weiduke_token);
  },
  get_current_weiduke_token: function () {
    var weiduke_token = wx.getStorageSync("current_weiduke_token");
    console.log("获取weiduke_token：" + weiduke_token);

    if (!weiduke_token) {
      weiduke_token = null;
    }

    return weiduke_token;
  },
  

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //读取缓存中的userid checkstr openid
      that.globalData.userInfo = that.get_user_info();
      console.log('当前登录信息：');
      console.log(that.globalData.userInfo);

      typeof cb == "function" && cb(that.globalData.userInfo);

    }
  },

  getFaquanSetting: function (that, callback_function) {
    var currentTime = (new Date()).getTime();//获取当前时间

    if (wx.getStorageSync("cms_faquan_setting") && (currentTime - wx.getStorageSync("cms_faquan_setting_time")) < 3600 * 1000) {

      var cms_faquan_setting = JSON.parse(wx.getStorageSync("cms_faquan_setting"))

      //this.globalData.cms_faquan_setting = cms_faquan_setting;
      console.log(' this.globalData.option_list===========', this.globalData.cms_faquan_setting)
      //刷新界面
      typeof callback_function == "function" && callback_function(that, cms_faquan_setting);

      return;

    } 

    var that002 = this;

    var userInfo = this.get_user_info();

    var data_params = {
      sellerid: this.get_sellerid(),
    }

    if(userInfo){
      data_params.userid = userInfo.userid;
      data_params.checkstr = userInfo.checkstr;
    }

    wx.request({
      url: this.globalData.http_server + 'openapi/FaquanData/get_faquan_setting',
      method: 'post',
      data: data_params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var cms_faquan_setting = res.data.data;

        //保存到本地
        var cms_faquan_setting_str = JSON.stringify(cms_faquan_setting);

        //缓存返回数据
        wx.setStorageSync("cms_faquan_setting", cms_faquan_setting_str);
        var currentTime = (new Date()).getTime();//获取当前时间
        wx.setStorageSync("cms_faquan_setting_time", currentTime);

        console.log('保存乖乖兽选项：' + cms_faquan_setting_str);

        //刷新界面
        typeof callback_function == "function" && callback_function(that, cms_faquan_setting);

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

  },
  delFaquanSetting: function () {
    wx.removeStorageSync("cms_faquan_setting");
  },


  set_o2o_basic_data_option_str: function (that, callback_function) {

    var currentTime = (new Date()).getTime();//获取当前时间

    console.log('wx.getStorageSync("o2o_basic_data_option_str")', wx.getStorageSync("o2o_basic_data_option_str"),'88888')
    if (wx.getStorageSync("o2o_basic_data_option_str") && (currentTime - wx.getStorageSync("o2o_basic_data_option_str_time")) < 3600 * 1000) {

      var o2o_basic_data_option = JSON.parse(wx.getStorageSync("o2o_basic_data_option_str"))

      this.globalData.o2o_basic_data_option = o2o_basic_data_option;
      console.log(' this.globalData.o2o_basic_data_option===========', this.globalData.o2o_basic_data_option)
      //刷新界面
      typeof callback_function == "function" && callback_function(that, o2o_basic_data_option);

    } else {
      var that002 = this;

      wx.request({
        url: this.globalData.http_server + '/openapi/O2OAddressData/get_basic_data_option',
        method: 'post',
        data: {
          sellerid: this.get_sellerid()
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var o2o_basic_data_option = res.data;

          that002.globalData.o2o_basic_data_option = o2o_basic_data_option;


          //保存到本地
          var o2o_basic_data_option_str = JSON.stringify(o2o_basic_data_option);

          //缓存返回数据
          wx.setStorageSync("o2o_basic_data_option_str", o2o_basic_data_option_str);
          var currentTime = (new Date()).getTime();//获取当前时间
          wx.setStorageSync("o2o_basic_data_option_str_time", currentTime);

          console.log('保存商城选项：' + o2o_basic_data_option_str);

          //刷新界面
          typeof callback_function == "function" && callback_function(that, o2o_basic_data_option);

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


  
  getOrBindTelPhone:function(returnUrl){
    var user = this.globalData.userInfo;
    if(!user.tel){
      wx.navigateTo({
        url: 'pages/binding/binding'
      });
    }
  },
  httpPost: function (url, data, cbSuccess, cbError) {
    console.log('准备请求网址：：：：' + url);
    console.log(data);

    //发起网络请求
    wx.request({
      url: url,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: data,
      success: function (request_res) {
        console.log('请求成功，返回内容如下：：：：');
        console.log(request_res);

        typeof cbSuccess == "function" && cbSuccess(request_res);
      },
      fail: function (request_res) {
        console.log('请求失败，返回内容如下：：：：');
        console.log(request_res);
        typeof cbError == "function" && cbError(request_res);
      },
      complete: function () {
        console.log('请求完成' + url);
      }
    })

  },
  //调用H5browser打开网页
  call_h5browser_or_other_goto_url: function (url, var_list=null, ret_page='') {
    console.log('call_h5browser_or_other_goto_url : url && var_list :'+url);
    console.log(var_list);

    if (url.indexOf("%ensellerid%") != -1) {
      url = url.replace('%ensellerid%', this.get_sellerid());
    }

    if (url.indexOf("%wxa_appid%") != -1) {
      url = url.replace('%wxa_appid%', this.globalData.xiaochengxu_appid);
    }

    if (url.indexOf("%wxa_openid%") != -1) {
      url = url.replace('%wxa_openid%', this.get_current_openid());
    }



    if ((url.indexOf("%oneclicklogin%") != -1) || (url.indexOf("%refresh_token%") != -1)) {

      var userInfo = this.get_user_info();

      console.log('userInfo====', userInfo)

      if(!userInfo){
        this.goto_user_login(url, var_list, ret_page);

        return;

      }

      var that = this;

      var new_url = this.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=one_click_login_str';
      if (url.indexOf("%refresh_token%") != -1){
        new_url = this.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=generate_refresh_token_value_for_other_system';
      }



      wx.request({
        url: new_url,
        method: 'post',
        data: {
          sellerid: this.get_sellerid(),
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
			  
          if(res.data.oneclicklogin){
            url = url.replace('%oneclicklogin%', res.data.oneclicklogin);
          }
			
            if (res.data.refresh_token) {
              url = url.replace('%refresh_token%', res.data.refresh_token);
            }        

            that.call_h5browser_or_other_goto_url(url, var_list);

            return;

          } else {
            wx.showToast({
              title: '非法操作.',
              duration: 2000
            });

            setTimeout(function () {
              app.del_user_info();

              var last_url = url;
              app.goto_user_login(last_url);

            }, 2000);



          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });

      return;

    }

    console.log('url==============00000', url);
    
   

    //判断各种跳转条件
    if (url.indexOf('switchTab') == 0) {
      var arr = url.split(" ");

      console.log('switchTab ========>>>> ', arr);

      if (arr.length >= 2) {
        var new_url = arr[1];
        wx.switchTab({
          url: new_url,
        })
      }
    }
    else if (url.indexOf('navigateTo') == 0) {
      var arr = url.split(" ");

      console.log('navigateTo ========>>>> ', arr);

      if (arr.length >= 2) {
        var new_url = arr[1];

        console.log('navigateTo ========>>>> ', new_url);

        wx.navigateTo({
          
          url: new_url
        })
      }
    }
    else if (url.indexOf('redirectTo') == 0) {
      var arr = url.split(" ");

      console.log('redirectTo ========>>>> ', arr);

      if (arr.length >= 2) {
        var new_url = arr[1];
        wx.redirectTo({
          url: new_url,
        })
      }
    }
    else if (url == '/pages/index/index' || url == '/pages/category/index' || url == '/pages/cart/cart' || url == '/pages/user/user') {
      wx.switchTab({
        url: url,
      })
    } else if (url == '/pages/help_detail/help_detail') {
      var browser_cache_id = wx.getStorageSync('browser_cache_id');
      if (browser_cache_id) {
        wx.navigateTo({
          url: url + '?id=' + browser_cache_id,
        })
      } else {
        wx.showToast({
          title: '无浏览记录',
        })
      }
    }
    else if (url == 'duorenpintuan') {
      var url1 = 'https://yanyubao.tseo.cn/Home/DuorenPintuan/pintuan_list/ensellerid/' + this.get_sellerid() + '.html?click_type=Wxa';
      wx.redirectTo({
        url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1) + '&ret_page=' + ret_page,
      })
    } else if (url == 'fenxiangkanjia') {
      var productid = 0;
      if (var_list && var_list.productid) {

        var url1 = 'https://yanyubao.tseo.cn/Home/ShareKanjia/share_list/productid/' + var_list.productid + '.html?click_type=Wxa';
        wx.redirectTo({
          url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url1) + '&ret_page=' + ret_page,
        })

      }

    } 
    else if ((url.indexOf('https://') == 0) || (url.indexOf('http://') == 0)) {
      if (url.indexOf('#redirectTo') != -1){
        //如果指定了跳转方式为 #redirectTo
        url = url.replace(/#redirectTo/, '');
        wx.redirectTo({
          url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url) + '&ret_page=' + ret_page,
        })
      }
      else{
        wx.navigateTo({
          url: '/pages/h5browser/h5browser?url=' + encodeURIComponent(url) + '&ret_page=' + ret_page,
        })
      }
      
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

        var extraData_obj = null;
        if (extraData) {
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
    else if (url.indexOf('tel:') == 0) {
      url = url.replace(/tel:/, '');

      wx.makePhoneCall({
        phoneNumber: url,
      })
    }
    else {
      wx.navigateTo({
        url: url
      })
    }

  },

  toRad: function (d) {
    return d * Math.PI / 180;
  },

  getDisance: function (lat1, lng1, lat2, lng2) {
    var dis = 0;
    var radLat1 = this.toRad(lat1);
    var radLat2 = this.toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = this.toRad(lng1) - this.toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) *
      Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2),
        2)));
    return dis * 6378137;
  },

});





