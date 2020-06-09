
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: null,
        title: "",

        ret_page:''

    },

    /**
     * 生命周期函数--监听页面加载
     * 不能重载 onShow这个函数，否是webpage组件不显示网页的标题
     */
    // onShow:function(){
      
    // },
    onLoad: function (options) {

      


      app.set_option_list_str(null, app.getColor());

      if(options.ret_page){
        this.setData({ ret_page: options.ret_page});
      }

      var self = this;

      //console.log(decodeURIComponent(options.scene));
      console.log('options====1111',options);

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

       
        var extra_option_str = '';


        //判断分享转发的特殊参数
        Object.keys(options).forEach(function (key) {

          //console.log(key, obj[key]);
          if (key != 'url'){
            extra_option_str += key+'='+options[key]+'&';
          }
        });

        if(extra_option_str.length > 2){
          extra_option_str = extra_option_str.substr(0, extra_option_str.length - 1);

          this.setData({
            share_path_extra_option : extra_option_str
          });
        }

        if(options.share_title){
          this.setData({
            share_title: options.share_title
          });
        }

        if (options.share_image) {
          this.setData({
            share_image: options.share_image
          });
        }




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
       
        console.log(options.webViewUrl);

      //设置分享转发的内容
      var share_title = app.globalData.shop_name;

      var share_image = null;

      var share_path = 'pages/h5browser/h5browser?url=' + encodeURIComponent(url1);

      if (this.data.share_title) {
        share_title = this.data.share_title;
      }
      if (this.data.share_image) {
        share_image = this.data.share_image;
      }

      if(this.data.share_path_extra_option){
        share_path += '&' + this.data.share_path_extra_option;
      }

      console.log("share_path==", share_path)


      var share_data = { 
        title: share_title,
        path: share_path,

        success: function (res) {
          // 转发成功
          
        },
        fail: function (res) {
          // 转发失败
        }
      }

      if(share_image){
        share_data.imageUrl = share_image
      }


      return share_data;


        
    },

  
    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    // wx.showToast({
    //   title: '33333333',
    // })
  

    // wx.reLaunch({
    //   url: '/pages/user/user',
    // })

    // wx.switchTab({
    //   url: '/pages/user/user',
    // })


    // wx.navigateBack({
    //   delta: 2000
    // })
    // var ret_page = this.data.ret_page
    // if (ret_page && ret_page != '') {
    //   if (ret_page = 'user_index') {
        
    //   }
    // }   
  },
 
})