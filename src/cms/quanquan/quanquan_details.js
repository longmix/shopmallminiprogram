// cms/quanquan/quanquan_details.js
var app = getApp();
var api = require('../../utils/api');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    faquan_one_click_to_save:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = app.get_user_info();

    var that = this;
    var videoid = options.videoid;

    app.set_option_list_str(null, app.getColor());

 

    


    if(options.videoid){
      that.setData({
        videoid: videoid,
      })
    }
    
    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/get_video_detail',
      method: 'post',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        videoid: that.data.videoid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        console.log(res);
        var data = res.data.data;

        if(res.data.code == 1){
          that.setData({
            video_data: data.video_data,
            video_remark_list: data.video_remark_list
          });

          wx.setNavigationBarTitle({
            title: data.video_data.title
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


    this.get_video_list_option();



  },

  get_video_list_option:function(){
    var that = this;

    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/get_option_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == 1){
          var option_list = res.data.data;

          if(option_list.faquan_one_click_to_save){

            that.setData({
              faquan_one_click_to_save:option_list.faquan_one_click_to_save,
              file_one_click_download:option_list.file_one_click_download
            });

          }

        }
      }
    });


  },
  //下载视频
  saveVedio:function(e){
    var that = this;

    var last_url = '/cms/quanquan/quanquan_details?videoid=' + that.data.videoid;

    var ret001 = app.goto_user_login(last_url);

    if(ret001){
      return;
    }

    var userInfo = app.get_user_info();
    
    var video_type = e.currentTarget.dataset.videoType;

    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/download_file_token?from=video_list',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo.userid,
        checkstr:userInfo.checkstr,
        videoid: that.data.videoid,
        text: that.data.remarktext,
        video_type:video_type,
      },
      success: function (res) {
        if(!res || (res.data.code != 1)){
          wx.showModal({
            cancelColor: 'cancelColor',
            title:'提示',
            content:res.data.msg,
            showCancel:false
          })

          return;
        }

        var download_token = res.data.download_token;


        if(that.data.video_data.file_can_be_open_in_wxa != 1){

          var video_url = that.data.video_data.video_url;
          
          wx.setClipboardData({
            data: video_url,
          })

          wx.showModal({
            title:'下载链接已经复制',
            showCancel:false,
            content: '下载链接'+video_url+'已经复制到剪切板，请用浏览器下载。',
          })

          return;

        }


        var file_url = app.globalData.http_server + 'openapi/FaquanData/download_file_02?url=';
        file_url += encodeURIComponent(that.data.video_data.video_url);
        file_url += '&userid='+userInfo.userid+'&download_token='+download_token;

        that.setData({
          disabled: true,
        })
        if(video_type == 'file'){
          wx.showLoading({
            title: '正在下载文件',
          })
        }else if(video_type == 'video'){
          wx.showLoading({
            title: '正在下载视频',
          })
        }
       

        
        const downloadTask = wx.downloadFile({
          url: file_url, //仅为示例，并非真实的资源
          //filePath:aaa,
          header:{userid:userInfo.userid, sellerid:app.get_sellerid()},
          success(res) {
            //wx.hideLoading();
            
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              if(video_type == 'file'){
                //普通文件
                wx.openDocument({
                  filePath: res.tempFilePath,
                  success: function (res) {

                  },
                  fail(res){
                    wx.showToas ({
                      title: '打开文档失败',
                    })
                    
                  }
                })
                // wx.saveFile({
                //   tempFilePath: res.tempFilePath,
                //   success (res) {
                //     console.log('res===ddd>>',res);

                    

                //   },
                //   fail(res){
                //     console.log('res===fff>>',res);
                //     wx.showModal({
                //       content: 'saveFile失败',
                //     })
                //   }
                // })
              }else if(video_type == 'video'){
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    that.setData({
                      disabled: false,
                    })
                    wx.showToast({
                      title: '下载成功',
                    })
                    
                  },
                  fail:function(res){
                    
                    wx.hideLoading();
                  }
                })
              }

            }
          },
          fail:function(res){
            wx.showToast({
              title: '下载失败',
            })
            
            wx.hideLoading();
          },
          complete:function(res){
            wx.hideLoading();
          }
        })

        downloadTask.onProgressUpdate((res) => {
          console.log('下载进度', res.progress)
          console.log('已经下载的数据长度', res.totalBytesWritten)
          console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        })



        
      }
    });





    


  },
  onShareTimeline: function () {
    console.log('app.globalData.shop_name : '+app.globalData.shop_name);

    return this.share_return();
  },
  onAddToFavorites: function () {
    return this.share_return();
  },
  share_return: function () {
    return {
      title: this.data.video_data.title,
      query: 'videoid=' + this.data.videoid, 
      imageUrl:this.data.video_data.img_url
    }
  },

  inputContent:function(e){
    var remarktext = e.detail.value;
    this.setData({
      remarktext: remarktext
    })
  },

  sendRemark:function(){
    var that = this;

    var last_url = '/cms/quanquan/quanquan_details?videoid=' + that.data.videoid;

    if(app.goto_user_login(last_url)){
      return;
    }

    var userInfo = app.get_user_info();
    
    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/add_video_remark',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo.userid,
        checkstr:userInfo.checkstr,
        videoid: that.data.videoid,
        text: that.data.remarktext
      },
      success: function (res) {

        if(res.data.code == 1){
          wx.showToast({
            title: '评论成功',
          })

          that.setData({
            remarktext: ''
          })

          wx.showModal({
            cancelColor: 'cancelColor',
            title:'提示',
            content:res.data.msg,
            showCancel:false
          })
        }
        else{
          wx.showModal({
            cancelColor: 'cancelColor',
            title:'提示',
            content:res.data.msg,
            showCancel:false
          })
        }
        
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },


  collectVedio:function(e){
    var that = this;

    var last_url = '/cms/quanquan/quanquan_details?videoid=' + that.data.videoid;

    if(app.goto_user_login(last_url)){
      return;
    }

    var userInfo = app.get_user_info();

    if ('is_get_userinfo' in userInfo){
      var is_get_userinfo = userInfo.is_get_userinfo;
    }

    if (!is_get_userinfo) {

      wx.setStorageSync('get_userinfo_last_url', '/cms/quanquan/quanquan_details?videoid=' + that.data.videoid)

      wx.navigateTo({
        url: '/pages/login/login_get_userinfo',
      });

      return;
    }
    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/add_video_collect',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo.userid,
        checkstr:userInfo.checkstr,
        videoid: that.data.videoid,
      },
      success: function (res) {

        if (that.data.video_data.has_video_collect == '0'){
          that.data.video_data.has_video_collect = '1'
          wx.showToast({
            title: '收藏成功',
          })
        }else{
          that.data.video_data.has_video_collect = '0'
          wx.showToast({
            title: '取消收藏成功',
          })
        }
                       
        that.setData({
          video_data: that.data.video_data
        })

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  showRemarkInput:function(e){
    var that = this;

    var last_url = '/cms/quanquan/quanquan_details?videoid=' + that.data.videoid;

    if(app.goto_user_login(last_url)){
      return;
    }

    var userInfo = app.get_user_info();


    if ('is_get_userinfo' in userInfo) {
      var is_get_userinfo = userInfo.is_get_userinfo;
    }
    if (!is_get_userinfo) {
      wx.setStorageSync('get_userinfo_last_url', '/cms/quanquan/quanquan_details?videoid=' + this.data.videoid)
      wx.navigateTo({
        url: '/pages/login/login_get_userinfo',
      });

      return;
    }

    if (!this.data.showCostDetail){
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      animation.translateY(100).step()
      this.setData({
        animationData: animation.export(),
        showCostDetail: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    } else {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      animation.translateY(100).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          // animationData: animation.export(),
          showCostDetail: false
        })
      }.bind(this), 200)
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

  },

  
  

})