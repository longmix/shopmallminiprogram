// cms/top_showcase/mymytop_showcase.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: null,
    title: "",

  },

  /**
   * 生命周期函数--监听页面加载
   * 不能重载 onShow这个函数，否是webpage组件不显示网页的标题
   */
  // onShow:function(){

  // },
  onLoad: function (options) {
    app.set_option_list_str(null, app.getColor());

    var last_url = 'switchTab /cms/top_showcase/my';

    if(app.goto_user_login(last_url)){
      return;
    }

    var userInfo = app.get_user_info();

    var self = this;
    var current_web_url = 'https://yanyubao.tseo.cn/Yanyubao/TopShowcase/my/ensellerid/%ensellerid%.html?oneclicklogin=%oneclicklogin%';

    current_web_url = current_web_url.replace('%ensellerid%', app.get_sellerid());

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

          current_web_url = current_web_url.replace('%oneclicklogin%', oneclicklogin);
          var currentTime = (new Date()).getTime();//获取当前时间

          current_web_url = current_web_url + '&currentTime=' + currentTime

          console.log('/cms/top_showcase/my::' + current_web_url);

          self.setData({
            url: current_web_url
          });

        }
      },
      fail: function (res) {

      }
    });
  
    


    

  },
  successload: function (e) {
    console.log('successload', e)
  },
  errorload:function(e){
    console.log('errorload',e)
  },
  onShareAppMessage: function (options) {
    console.log(options);

    var self = this;
    var url1 = options.webViewUrl;
    /*
    if (url.indexOf("?") != -1) {
        url = url.replace("?", "*");
    }
    */
    //url = 'pages/h5browser/h5browser?scene=' + url;
    // var url1 = 'http://192.168.0.205/yanyubao_server/index.php?m=ShareKanjia&a=share_detail&productid=318&sharekanjia=sharekanjia&userid=';
    //url = 'pages/webpage/webpage?url=' + url1;
    // url = '/pages/h5browser/h5browser?url=' + url1;
    // url = 'pages/h5browser/h5browser?url=' + url1;
    console.log(options.webViewUrl);
    return {
      //title: self.data.title + '分享自' + config.getWebsiteName,
      title: app.globalData.shop_name,
      path: 'pages/h5browser/h5browser?url=' + encodeURIComponent(url1),
      success: function (res) {
        // 转发成功
        console.log(url);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow: function () {
  }

})