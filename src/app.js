// app.js
App({
  /*d: {
    hostUrl: 'https://wxplus.paoyeba.com/index.php',
    hostImg: 'http://img.ynjmzb.net',
    hostVideo: 'http://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    userId: 1,
    appId:"",
    appKey:"",
    //http_server: 'https://yanyubao.tseo.cn/index.php?',
    //ceshiUrl: '192.168.0.87/yanyubao_server/index.php',
  },*/
  onLaunch: function () {   
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //login
   // this.getUserInfo();


    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    //console.log(extConfig)

    this.globalData.xiaochengxu_appid = extConfig.xiaochengxu_appid;

    this.globalData.force_sellerid = 0;

    if (extConfig.force_sellerid_flag == 1) {
      this.globalData.force_sellerid = 1;
      this.globalData.default_sellerid = extConfig.force_sellerid_value;
    }

  },
  set_user_info: function (user_info) {
    console.log("准备保存用户数据：");
    console.log(user_info);

    var user_info_str = JSON.stringify(user_info);

    //缓存返回数据
    wx.setStorageSync("wxa_user_info", user_info_str);

    console.log('111111111111111111');
    console.log(wx.getStorageSync("wxa_user_info"));
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

    if ((sellerid == null) || (sellerid.lenth == 0)) {
      var that = this
      sellerid = that.globalData.default_sellerid;
      console.log("0000000000000000000获取sellerid不成功，使用默认sellerid：" + that.globalData.default_sellerid + ' ==>>  ' + sellerid);
    }

    return sellerid;
  },
  getColor:function(){
    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '333333333');

    if (!option_list_str) {
      return null;
    }

    var option_list =  JSON.parse(option_list_str);

    console.log(option_list);

    wx.setNavigationBarColor({
      frontColor: option_list.wxa_shop_nav_font_color,
      backgroundColor: option_list.wxa_shop_nav_bg_color,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });

    /*wx.setTabBarStyle({
      color: '#858585',
      selectedColor: option_list.wxa_shop_nav_font_color,
      backgroundColor: '#ffffff',
      borderStyle: 'white'
    })*/




    
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
  /*
  getUserInfo222:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          //get wx user simple info
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);
              //get user sessionKey
              //get sessionKey
              that.getUserSessionKey(code);
            }
          });
        }
      });
    }
  },
  
*/
  getUserSessionKey:function(code){
    //用户的订单状态
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
      method:'post',
      data: {
        code: code
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if(data.status==0){
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }

        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser();
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },
  onLoginUser:function(){
    var that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/authlogin',
      method:'post',
      data: {
        SessionId: user.sessionId,
        gender:user.gender,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid:user.openid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.arr;
        var status = res.data.status;
        if(status!=1){
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
        that.globalData.userInfo['id'] = data.ID;
        that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        var userId = data.ID;
        if (!userId){
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        that.d.userId = userId;
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });

    //获取下方图标
    wx.request({
      url: that.d.ceshiUrl + '?g=Yanyubao&m=ShopAppWxa&a=get_shop_icon_bottom',
      method: 'post',
      data: {
        'type':0
      },    
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        var status = res.data.status;
        if (status != 1) {
          wx.showToast({
            title: res.data,
            duration: 3000
          });
          return false;
        }
        that.globalData.userInfo['id'] = data.ID;
        that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        var userId = data.ID;
        if (!userId) {
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        that.d.userId = userId;
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });

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

 globalData:{
   http_weiduke_server: 'https://cms.weiduke.com/',
   //http_server:'http://192.168.0.205/yanyubao_server/',
   http_server: 'https://yanyubao.tseo.cn/',
   //http_server: 'http://192.168.0.87/yanyubao_server/',
   userInfo: {},

  //通版商城，
  xiaochengxu_appid: 'wx00d1e2843c3b3f77', //，，需要这个参数的地方：get_session_key
  default_sellerid: 'pQNNmSkaq', //大卖家服务市场
   shop_name:'大卖家服务市场',

  //开心拼享购
  //xiaochengxu_appid: 'wx00d1e2843c3b3f77',  
  //default_sellerid: 'fmJyUPkWj', //  连云港顺鸿欣远
  
  //
  // default_sellerid: 'fXiNUPaWV',//说彩商城

  //default_sellerid: 'pmyxQxkkU',
  //default_sellerid: 'fmJyUPkWj', //  连云港顺鸿欣远

   //default_sellerid: 'pmyxQxkkU',
   
   force_sellerid: 1, 

   sellerid: '',
   version_number: "1.2.0"
  },

  onPullDownRefresh: function (){
    wx.stopPullDownRefresh();
  },
});





