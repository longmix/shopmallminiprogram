// cms/discover/discover.js
var app = getApp();
var userInfo = app.get_user_info();
// var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    faquanList: [],
    isShowBottomLine: 0,
    imgheights: [],
    current: 0,
    startself:0,
    selectTabArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = app.get_user_info();
    console.log('userInfo========2', userInfo)
    var that = this;


    app.getFaquanSetting(that, this.callback_flash_ad_list);
   
    that.getFaquanList();

    app.set_option_list_str(null, app.getColor());

  },

  callback_flash_ad_list: function (that, cms_faquan_setting){
    if (!cms_faquan_setting){
      return;
    }


    if (cms_faquan_setting.faquan_tag_status) {
      that.setData({
        faquan_tag_status: cms_faquan_setting.faquan_tag_status
      })
    }

    var type = cms_faquan_setting.faquan_flash_ad_type;

    that.setData({
      isShowBanner: type!=888 ?  true : false 
    })
    if(type != 888){
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_flash_ad_list',
        method: 'post',
        data: {
          sellerid: app.get_sellerid(),
          type: type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var banner = res.data.data;
          console.log(res);
          console.log(banner);

          //that.initProductData(data);
          that.setData({
            imgUrls: banner,
          });
          //endInitData
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      })
    }

    console.log('cms_faquan_setting', cms_faquan_setting)

    if (cms_faquan_setting.faquan_button_status){
      that.setData({
        faquan_button_status: cms_faquan_setting.faquan_button_status
      })
    }
    

  },


  //搜索发圈
  searchFaquan: function (e) {
    console.log('e====',e)
    var that = this;
    var keyword = e.detail.value;
    that.setData({
      keyword: keyword,
      is_search: true,
    })
    that.getFaquanList();
  },

  //取消搜索
  cancelSearch:function(e){
    this.setData({
      keyword: '',
      is_search: false,
      page: 1
    })
    this.getFaquanList();
  },



  getFaquanList:function(e){
    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list',
      method: 'post',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        page: 1,
        keyword: that.data.keyword ? that.data.keyword : '',
        
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var faquanList = res.data.data;

        console.log('faquanList', faquanList)
        if(res.data.code == 1){
          that.setData({
            faquanList: faquanList,
            page: that.data.page + 1,
            hot_tag: res.data.hot_tag
          })  
        }
        // WxParse.wxParse('content', 'html', faquanList, that, 15);

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },


  //发圈收藏
  fanquanCollect:function(e){
    console.log('e=======',e)
    var that = this;
    var faquanid = e.currentTarget.dataset.faquanid;
    var index = e.currentTarget.dataset.index;

console.log('userInfo==',userInfo);
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success:function(){
          

          wx.setStorageSync('last_url', '/cms/discover/discover');
          wx.setStorageSync('page_type', 'switchTab');

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
    }

    var is_get_userinfo = userInfo.is_get_userinfo;
    if (!is_get_userinfo) {

      wx.setStorageSync('last_url', '/cms/discover/discover');
      wx.setStorageSync('page_type', 'switchTab');

      wx.navigateTo({
        url: '/pages/login/login_get_userinfo',
      });

      return;
    }

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/faquan_collect',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        faquanid: faquanid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if(res.data.code == 1){

          if (that.data.faquanList[index].has_collect == '0'){
            that.data.faquanList[index].has_collect = "1"
            wx.showToast({
              title: '收藏成功！',
              duration: 2000
            });
          }else{
            that.data.faquanList[index].has_collect = "0"
            wx.showToast({
              title: '取消收藏成功！',
              duration: 2000
            });
          }
          
          that.setData({
            faquanList: that.data.faquanList
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


  //发圈点赞
  fanquaDianzan: function (e) {
    console.log('e=======', e)
    var that = this;
    var faquanid = e.currentTarget.dataset.faquanid;
    var index = e.currentTarget.dataset.index;

    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success: function () {

          wx.setStorageSync('last_url', '/cms/discover/discover');
          wx.setStorageSync('page_type', 'switchTab');

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })

      return;
    }

    var is_get_userinfo = userInfo.is_get_userinfo;
    if (!is_get_userinfo) {

      wx.setStorageSync('last_url', '/cms/discover/discover');
      wx.setStorageSync('page_type', 'switchTab');

      wx.navigateTo({
        url: '/pages/login/login_get_userinfo',
      });

      return;
    }

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/faquan_like',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        faquanid: faquanid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == 1) {

          if (that.data.faquanList[index].has_like == '0') {

            that.data.faquanList[index].has_like = "1"
            ++that.data.faquanList[index].like_num
          
          } else {

            that.data.faquanList[index].has_like = "0"
            --that.data.faquanList[index].like_num
           
          }

          that.setData({
            faquanList: that.data.faquanList
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

//一键保存
  oneClickSave:function(e){
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var img_or_video_list = this.data.faquanList[index].img_or_video_list;
    this.setData({
      disabled: true,
    })

    if(type == 0 ){
      this.img_or_video_download(type, img_or_video_list);
    }
    
  },

  img_or_video_download: function (type, img_or_video_list, i=0){
    var that = this;   
    var file_url = app.globalData.http_server + 'openapi/FaquanData/download_file?url=' + encodeURIComponent(img_or_video_list[i].url);
  
    wx.downloadFile({
      url: file_url, //仅为示例，并非真实的资源
      success(res) {
        
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容       
          if (res.statusCode === 200) {
            if(type == 0){
              wx.showLoading({
                title: '下载第' + (i + 1) + '张图片',
              })
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res2) {
                  ++i;
                  if (i == img_or_video_list.length) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '下载完成',
                    })
                    that.setData({
                      disabled: false,
                    })
                  } else if (i < img_or_video_list.length) {
                    that.img_or_video_download(type, img_or_video_list, i);
                  }
                },
              })   
            }else{
              wx.showLoading({
                title: '正在下载视频',
              })
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res2) {
                  ++i;
                  if (i == img_or_video_list.length) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '下载完成',
                    })
                    that.setData({
                      disabled: false,
                    })
                  } else if (i < img_or_video_list.length) {
                    that.img_or_video_download(type, img_or_video_list, i);
                  }
                },
              }) 
            } 
                  
        } 
      }
    })
  },


  //分享
  clickBtn:function(e){
    console.log('clickBtn')
    this.onShareAppMessage();
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
    
    if(!userInfo || !userInfo.is_get_userinfo){
      console.log('userInfo========1',userInfo)
      userInfo = app.get_user_info();
    }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('ddddddd')
    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list',
      method: 'post',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        page: that.data.page,
        keyword: that.data.keyword ? that.data.keyword : '',
        tag: that.data.selectTabStr
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var faquanList = res.data.data;

        console.log('faquanList', faquanList)

        if (res.data.code == 1) {
          that.setData({
            faquanList: that.data.faquanList.concat(faquanList),
            page: that.data.page + 1,
          })
        } else {
          that.setData({
            isShowBottomLine: 1,
          })
          wx.showToast({
            title: '到底了!',
            icon: 'none',
            duration: 2000,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log('res=========',res)
    console.log('onShareAppMessage')
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      isShowBottomLine: 0
    })
    this.getFaquanList();
    this.onShow();
    console.log('下拉刷新==============')
    //停止当前页面的下拉刷新

    wx.stopPullDownRefresh();
  },

  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;

    console.log(imgheights);

    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },



  bigImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var img_or_video_list = this.data.faquanList[index].img_or_video_list;
    var imgList = [];
    
    for(var i=0; i<img_or_video_list.length; i++){
      imgList.push(img_or_video_list[i].url);
    }


    wx.previewImage({
      current: imgList[index2], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  //播放点击视频并停止播放其他视频
  start_and_stop_other_videos:function(e){
    console.log(e);
    var video_id = e.currentTarget.id;
    

    if (this.data.last_video_id){    
      //暂停正在播放的视频
      var videoContextPrev = wx.createVideoContext(this.data.last_video_id)
      videoContextPrev.pause();  
      
    }


    if (this.data.last_video_id == video_id) {
      this.setData({
        startself: 1
      })
    } else {
      this.setData({
        startself: 0
      })
    }


    if (!this.data.startself){
      console.log('sss')
      setTimeout(function () {
        //将点击视频进行播放
        var videoContext = wx.createVideoContext(video_id)
        videoContext.play();
      }, 500)
    }
    
    

    this.setData({
      last_video_id: video_id
    })
 
  },

  publishIdea: function (e) {

    var last_url = '/cms/discover/discover';
    var page_type = 'switchTab';
  
    app.goto_user_login(last_url, 'switchTab');

    if (userInfo){
      var is_get_userinfo = userInfo.is_get_userinfo;
    }
    
    if (!is_get_userinfo){
      app.goto_get_userinfo(last_url, 'switchTab');
      return;
    }
    

    wx.showActionSheet({
      itemList: ['照片', '视频'],
      success(res) {
        console.log(res.tapIndex)

        
        
        wx.setStorageSync('last_url', last_url);
        wx.setStorageSync('page_type', page_type);
        
        if ((res.tapIndex == 0)) {
          wx.navigateTo({
            url: '/cms/publish/publish?publishtype=image',
          })
        } else {
          wx.navigateTo({
            url: '/cms/publish/publish?publishtype=video',
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  //选择标签
  selectTab:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;

    var hot_tag = that.data.hot_tag

    hot_tag[index]['select'] = !hot_tag[index]['select']; 

    var selectTabArr = that.data.selectTabArr;

    if (hot_tag[index]['select']){
      selectTabArr.push(hot_tag[index].name)
    }else{

      for (var i = 0; i < selectTabArr.length; i++) {
        if (selectTabArr[i] == hot_tag[index].name) {
          selectTabArr.splice(i, 1);
          break;
        }
      }
    }

   

    var selectTabStr = selectTabArr.join(',')

    console.log('selectTabStr', selectTabStr)

    that.setData({
      hot_tag: hot_tag,
      selectTabStr: selectTabStr
    })

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list',
      method: 'post',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
        page: 1,
        keyword: that.data.keyword ? that.data.keyword : '',
        tag: that.data.selectTabStr
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var faquanList = res.data.data;

        console.log('faquanList', faquanList)
        if (res.data.code == 1) {
          that.setData({
            faquanList: faquanList,
            page: 1,

          })
        }else{
          that.setData({
            faquanList: [],
            page: 1,

          })
        }
        // WxParse.wxParse('content', 'html', faquanList, that, 15);

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
 
  

})