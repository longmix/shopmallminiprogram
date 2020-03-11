
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
      app.getColor();

      var self = this;
      console.log(decodeURIComponent(options.scene));
      console.log(options);
      if (options.scene != null) {
        var url_value = decodeURIComponent(options.scene);

        console.log(url_value);

        var url_data = url_value.split('@');
        console.log(url_data);
        console.log(url_data[1]);

        if (url_data.length < 2) {
          //跳转到首页
          wx.switchTab({
            url: '../index/index'
          })
        }

        var url = 'https://www.abot.cn';
        if (url_data[1] == 'weiduke_home') {
          url = 'https://cms.weiduke.com/index.php/Wap/Index/index/token/' + url_data[0] + '.shtml';

          console.log(url);

          if (url.indexOf('*') != -1) {
            url = url.replace("*", "?");
          }
          self.setData({
            url: url
          });

        }
        else if (url_data[1] == 'shortu') {
          var short_code = url_data[0];

          wx.showLoading({
            title: '数据加载中……',
          });

          var url = app.globalData.http_server + '/openapi/ShortUrl/get_url';
          var data = {
            sellerid: app.get_sellerid(),
            code: short_code,
          };
          var cbSuccess = function (res) {
            wx.hideLoading();

            if (res.data.code == 1) {
              self.setData({
                url: res.data.longurl
              });
            }
            else {
              wx.showModal({
                title: '错误',
                content: '网址不存在',
                success(res) {
                  wx.navigateBack({
                    delta: 2
                  })
                }
              })
            }
          };
          var cbError = function (res) {
            wx.hideLoading();
          };
          app.httpPost(url, data, cbSuccess, cbError);







          return;
        }
        //else if(){
        //}


      }
      else if (options.url != null) {
        self.setData({
          url: decodeURIComponent(options.url)
        });
      }
      else {
        self.setData({
          url: 'https://www.abot.cn'
        });
      }

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
    }
})