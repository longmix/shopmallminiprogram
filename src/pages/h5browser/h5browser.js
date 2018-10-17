
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
     */
    onShow:function(){
      app.getColor();
    },
    onLoad: function (options) {
        var self = this;
        console.log(decodeURIComponent(options.scene));
        console.log(1593699);
        console.log(options);
      
        if (options.scene != null) {
            var url_value = decodeURIComponent(options.scene);
            console.log(258369);
            console.log(url_value);

            var url_data = url_value.split('@');
            console.log(url_data);
            console.log(url_data[1]);

            if(url_data.length < 2){
              //跳转到首页
              wx.switchTab({
                url: '../index/index'
              })
            }

            var url = 'https://' + config.getDomain;
            if(url_data[1] == 'weiduke_home'){
              url = 'https://cms.weiduke.com/index.php/Wap/Index/index/token/'+url_data[0]+'.shtml';
            }
            //else if(){
            //}

            console.log(url);

            if (url.indexOf('*') != -1) {
                url = url.replace("*", "?");
            }
            self.setData({
                url: url
            });
            //   var slug = util.GetUrlFileName(options.url, domain);
            //   var domain = config.getDomain;
            //   var title = "";
            //   if (slug != 'index') {
            //       var getPostSlugRequest = wxRequest.getRequest(Api.getPostBySlug(slug));
            //       getPostSlugRequest
            //           .then(res => {
            //               if (res.statusCode == 200) {
            //                   if (res.data.length != 0) {
            //                       if (res.data[0].title.rendered) {
            //                           title = ':' + res.data[0].title.rendered;
            //                           self.setData({
            //                               title: title
            //                           });
            //                           console.log(title);
            //                       }
            //                   }
            //               }

            //           }) 
            //   }
        }
        else if (options.url != null) {
          self.setData({
            url: decodeURIComponent(options.url)
          });
          console.log(self.data.url);
        }
        else {
            self.setData({
                url: 'https://' + config.getDomain
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
            title: '帮忙砍价',
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