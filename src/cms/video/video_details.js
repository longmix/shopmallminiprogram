// cms/video/video_details.js
var app = getApp();
var userInfo = app.get_user_info();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = app.get_user_info();
    var that = this;
    var videoid = options.videoid;

 

    


    if(options.videoid){
      that.setData({
        videoid: videoid,
      })
    }
    
    wx.request({
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




//下载视频
  saveVedio:function(e){
    var that = this;
    var file_url = app.globalData.http_server + 'openapi/FaquanData/download_file?url=' + encodeURIComponent(that.data.video_data.video_url);
    that.setData({
      disabled: true,
    })
    wx.showLoading({
      title: '正在下载视频',
    })


      wx.downloadFile({
        url: file_url, //仅为示例，并非真实的资源
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {          
              
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  that.setData({
                    disabled: false,
                  })
                  wx.hideLoading();
                  wx.showToast({
                    title: '下载成功',
                  })
                  console.log(res.errMsg)
                }
              })            
          }
        }
      })
  },


  inputContent:function(e){
    var remarktext = e.detail.value;
    this.setData({
      remarktext: remarktext
    })
  },

  sendRemark:function(){
    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/add_video_remark',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        videoid: that.data.videoid,
        text: that.data.remarktext
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if(res.data.code == 1){
          wx.showToast({
            title: '评论成功',
          })

          that.setData({
            remarktext: ''
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
    

    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success: function () {

          // wx.setStorageSync('last_url', '/cms/video/video_detail?videoid=' + videoid);
          // //wx.setStorageSync('page_type', 'switchTab');

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })

      return;
    }

    if ('is_get_userinfo' in userInfo){
      var is_get_userinfo = userInfo.is_get_userinfo;
    }

    if (!is_get_userinfo) {

      wx.setStorageSync('last_url', '/cms/video/video_detaild?videoid=' + that.data.videoid)

      wx.navigateTo({
        url: '/pages/login/login_get_userinfo',
      });

      return;
    }
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/add_video_collect',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        videoid: that.data.videoid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
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
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success: function () {

          // wx.setStorageSync('last_url', '/cms/video/video_detail?videoid=' + videoid);
          // //wx.setStorageSync('page_type', 'switchTab');

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })

      return;
    }
    if ('is_get_userinfo' in userInfo) {
      var is_get_userinfo = userInfo.is_get_userinfo;
    }
    if (!is_get_userinfo) {
      wx.setStorageSync('last_url', '/cms/video/video_detaild?videoid=' + this.data.videoid)
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
    app.getColor();
    
    userInfo = app.get_user_info();

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