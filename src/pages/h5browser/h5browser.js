
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: null,
        title: "",

        ret_page:'',

        current_params_str:'',
        current_shop_list:null

    },

    /**
     * 生命周期函数--监听页面加载
     * 不能重载 onShow这个函数，否是webpage组件不显示网页的标题
     */
    // onShow:function(){
      
    // },
    onLoad: function (options) {

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


      app.set_option_list_str(this, function(that, option_list){
        app.getColor();

        that.setData({
          current_shop_list:option_list
        });

      });


      

      

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
          return;
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
              //判断网址是否为http开头的，如果不是按照路径跳转

              /*self.setData({
                url: res.data.longurl
              });*/

              if (res.data.longurl.indexOf('https://') == 0){
                self.setData({
                  url: res.data.longurl
                });
              }
              else{
                console.log('====>>>>>>h5browser内部跳转：' + res.data.longurl);

                wx.navigateTo({
                  url: res.data.longurl,
                });
                return;
              }



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


        console.log('url decode=====>>>' + decodeURIComponent(options.url));




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
      var share_title = this.data.current_shop_list.name;

      var share_image = this.data.current_shop_list.icon;

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
    onShareTimeline: function () {
      var that = this;

      //设置分享转发的内容
      var share_title = this.data.current_shop_list.name;
      var share_image = this.data.current_shop_list.icon;

      if (this.data.share_title) {
        share_title = this.data.share_title;
      }
      if (this.data.share_image) {
        share_image = this.data.share_image;
      }


      return {
        title: share_title,
        query: that.data.current_params_str, 
        imageUrl: share_image
      }
    },
    onAddToFavorites: function () {
      return this.onShareTimeline();
    },





  bindmessage:function(e){
    var userInfo = app.get_user_info();
    console.log('bindmessage==',e)
    var data = e.detail.data;
    var length = e.detail.data.length;
    var value = data[length-1];
    var type = data[0];
    console.log('value==', value)

    if(type.type == 'chouheji'){
      wx.request({
        url: app.globalData.http_server + 'openapi/ChouhejiData/cancel_queue',
        method: 'POST',
        header: { 'Content-type': 'application/x-www-form-urlencoded' },
        data: {
          'openid': userInfo.user_openid,
          'big_box_id': value.big_box_id,
          'sellerid': app.get_sellerid()
        },

        success: function (res) {
          console.log('cancelQueue====3', res)

        },
      })
    }
   


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