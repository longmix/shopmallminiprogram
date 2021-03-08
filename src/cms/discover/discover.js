// cms/discover/discover.js
var app = getApp();

// var WxParse = require('../../wxParse/wxParse.js');
var api = require('../../utils/api');

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
    current_self_in_tabbar:1,  //当前这个page挂接在底部导航中，用switchTab跳转
    faquan_add_img_url:'https://yanyubao.tseo.cn/Tpl/static/images/discover_publish_add.png',
    videometa_width_height_list:[],  //记录视频的高度
    current_view_width : 480,  //当前屏幕的宽度
    current_page_title:'发圈.发现.随拍',
    shop_info:'',
    current_faquanid :0,
    faquan_one_click_to_save_show:'none',

    is_my_discover: 0,
    is_my_discover_collection: 0,

    faquan_button_status: 0,
    selectTabStr:'',
    faquan_add_publish_to:0,

    faquan_content_type_image: 0,
    faquan_content_type_video : 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('discover options====>>>>', options);

    if(options){
      if (options.faquanid){
        this.setData({
          current_faquanid: options.faquanid,
          is_search: true
        });
      }
      else if (options.display_type){
        if (options.display_type == 'my'){
          this.setData({
            is_my_discover: 1,
            nav_title:'发现.我发布的',
            current_page_title: '发现.我发布的',
          });
        }
        else if (options.display_type == 'collect') {
          this.setData({
            is_my_discover_collection: 1,
            nav_title: '发现.我收藏的',
            current_page_title: '发现.我收藏的',
          });
        }
        

      }
      
    }




    var userInfo = app.get_user_info();
    console.log('userInfo========2', userInfo)

    var that = this;

    wx.getSystemInfo({
      success(res) {
        that.setData({ 
          current_view_width : res.windowWidth
        });
      }
    })


    app.getFaquanSetting(that, this.callback_flash_ad_list);

    app.set_option_list_str(that, function (that02, option_list) {
      app.getColor();

      if (option_list.wxa_shop_nav_bg_color) {
        that.setData({
          wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color,
          wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color,
        });
      }

    });

    app.get_shop_info_from_server(function (shop_info) {
      console.log('product/detail/index get_shop_info_from_server 回调：');
      console.log(shop_info);

      that.setData({
        shop_info: shop_info,
      });

    })

  },

  callback_flash_ad_list: function (that, cms_faquan_setting){
    if (!cms_faquan_setting){
      return;
    }


    if (cms_faquan_setting.faquan_add_publish_to) {
      that.setData({
        faquan_add_publish_to: cms_faquan_setting.faquan_add_publish_to
      })
    }

    if (cms_faquan_setting.faquan_content_type_image) {
      that.setData({
        faquan_content_type_image: cms_faquan_setting.faquan_content_type_image
      })
    }

    if (cms_faquan_setting.faquan_content_type_video) {
      that.setData({
        faquan_content_type_video: cms_faquan_setting.faquan_content_type_video
      })
    }

    

    if (cms_faquan_setting.faquan_tag_status) {
      that.setData({
        faquan_tag_status: cms_faquan_setting.faquan_tag_status
      })
    }

    if (cms_faquan_setting.faquan_add_img_url){
      that.setData({
        faquan_add_img_url: cms_faquan_setting.faquan_add_img_url
      });
    }
    else{
      that.setData({
        faquan_add_img_url: 'http://yanyubao.tseo.cn/Tpl/static/images/discover_publish_add.png'
      });
    }

    

    //设置默认标题    
    if (that.data.is_my_discover && cms_faquan_setting.faquan_my_title) {
      that.setData({
        nav_title: cms_faquan_setting.faquan_my_title,
        current_page_title: cms_faquan_setting.faquan_my_title,
      });
    }
    else if (that.data.is_my_discover_collection && cms_faquan_setting.faquan_collect_title) {
      that.setData({
        nav_title: cms_faquan_setting.faquan_collect_title,
        current_page_title: cms_faquan_setting.faquan_collect_title,
      });
    }
    else{
      if (cms_faquan_setting.faquan_list_title) {
        that.setData({ current_page_title: cms_faquan_setting.faquan_list_title });
      }
    }

    wx.setNavigationBarTitle({
      title: that.data.current_page_title
    })



    if (cms_faquan_setting.faquan_one_click_to_save && (cms_faquan_setting.faquan_one_click_to_save == 1)) {

      that.setData({ faquan_one_click_to_save_show: 'block' });
    }


    


    //这个页面是否在tabBar中
    if (cms_faquan_setting.page_not_in_tabbar && (cms_faquan_setting.page_not_in_tabbar == 1)){
      that.setData({
        current_self_in_tabbar : 0
      });
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
      page:1,
      keyword: keyword,
      is_search: true,
    })

    that.__getFaquanList();
  },

  //取消搜索
  cancelSearch:function(e){
    this.setData({
      keyword: '',
      is_search: false,
      current_faquanid : 0,
      page: 1
    })

    this.__getFaquanList();
  },



  __getFaquanList:function(){
    var that = this;

    var current_faquanid = this.data.current_faquanid;

    var userInfo = app.get_user_info();

    var post_url = app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list';

    if(this.data.is_my_discover){
      post_url = app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list_by_userid';
    }
    else if(this.data.is_my_discover_collection){
      post_url = app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_collect_list';
    }

    var post_data = {
      appid: app.globalData.xiaochengxu_appid,
      sellerid: app.get_sellerid(),
      page: that.data.page,
      faquanid: current_faquanid,
      keyword: that.data.keyword ? that.data.keyword : '',
      tag: that.data.selectTabStr
    };

    if (userInfo){
      post_data.userid = userInfo.userid;
      post_data.checkstr = userInfo.checkstr;
    }

    
    api.abotRequest({
      url: post_url,
      method: 'post',
      data: post_data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var faquanList = res.data.data;

        console.log('__getFaquanList===>>>>faquanList====>>>', faquanList)

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


  //发圈收藏
  fanquanCollect:function(e){
    console.log('e=======',e)
    var that = this;
    var faquanid = e.currentTarget.dataset.faquanid;
    var index = e.currentTarget.dataset.index;

    var userInfo = app.get_user_info();

    console.log('userInfo==',userInfo);

    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success:function(){
          

          wx.setStorageSync('get_userinfo_last_url', '/cms/discover/discover');
          if (that.data.current_self_in_tabbar == 1){
            wx.setStorageSync('get_userinfo_page_type', 'switchTab');
          }
          else{
            wx.setStorageSync('get_userinfo_page_type', 'normal');
          }
          

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
    }

    var is_get_userinfo = userInfo.is_get_userinfo;
    if (!is_get_userinfo) {

      wx.setStorageSync('get_userinfo_last_url', '/cms/discover/discover');

      if (that.data.current_self_in_tabbar == 1) {
        wx.setStorageSync('get_userinfo_page_type', 'switchTab');
      }
      else {
        wx.setStorageSync('get_userinfo_page_type', 'normal');
      }

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

    var userInfo = app.get_user_info();

    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success: function () {

          wx.setStorageSync('get_userinfo_last_url', '/cms/discover/discover');

          if (that.data.current_self_in_tabbar == 1) {
            wx.setStorageSync('get_userinfo_page_type', 'switchTab');
          }
          else {
            wx.setStorageSync('get_userinfo_page_type', 'normal');
          }

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })

      return;
    }

    var is_get_userinfo = userInfo.is_get_userinfo;
    if (!is_get_userinfo) {

      wx.setStorageSync('get_userinfo_last_url', '/cms/discover/discover');
      
      if (that.data.current_self_in_tabbar == 1) {
        wx.setStorageSync('get_userinfo_page_type', 'switchTab');
      }
      else {
        wx.setStorageSync('get_userinfo_page_type', 'normal');
      }

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
    console.log('准备下载====>>>>', e);

    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var img_or_video_list = this.data.faquanList[index].img_or_video_list;

    this.setData({
      disabled: true,
    })

    wx.showLoading({
      title: '正在下载……',
    })

    if(type == 0 ){
      
    }

    this.img_or_video_download(type, img_or_video_list);
    
  },

  img_or_video_download: function (type, img_or_video_list, i=0){
    var that = this;

    var last_url = 'pages/discover/discover';

    if(app.goto_user_login(last_url)){
      return;
    }


    var userInfo = app.get_user_info();
    
    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/download_file_token',
      data: {
        sellerid: app.get_sellerid(),
        userid: userInfo.userid,
        checkstr:userInfo.checkstr,
        videoid: that.data.videoid,
        text: that.data.remarktext
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

        var file_url = app.globalData.http_server + 'openapi/FaquanData/download_file_02?url=';
        file_url += encodeURIComponent(img_or_video_list[i].url);
        file_url += '&userid='+userInfo.userid+'&download_token='+download_token;
  
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
                    fail(res) {
                      wx.hideLoading();
                      wx.showToast({
                        title: '下载失败',
                      })
                      that.setData({
                        disabled: false,
                      })
                    }

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
                    fail(res) {
                      wx.hideLoading();
                      wx.showToast({
                        title: '下载失败',
                      })
                      that.setData({
                        disabled: false,
                      })
                    }
                  }) 
                } 
                      
            } 
          }
        })


      }
    });






    
  },


  //分享
  clickBtn:function(e){
    console.log('clickBtn===>>>', e)

    this.onShareAppMessage(e);
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
    var userInfo = app.get_user_info();
    
    if(!userInfo || !userInfo.is_get_userinfo){
      console.log('userInfo========1',userInfo)
      userInfo = app.get_user_info();
    }


    this.__getFaquanList();

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

    this.__getFaquanList();



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log('onShareAppMessage=========',res)
    console.log('onShareAppMessage')

    var faquanid = res.target.dataset.id;

    var faquanList = this.data.faquanList;

    console.log(faquanList);

    var current_faquan = null;

    var share_path = 'pages/discover/discover?faquanid='+faquanid;
    var share_title = this.data.current_page_title;
    var share_img = this.data.shop_info.icon;

    for (var ii = 0; ii < faquanList.length; ii++){
      var tt = faquanList[ii];
      if(tt.faquanid == faquanid){
        current_faquan = tt;
        break;
      }
    }

    console.log('current_faquan===>>>>', current_faquan);

    if(current_faquan){
      share_title = current_faquan.text;

      if(current_faquan.type == 0){
        //图片
        if (current_faquan.img_or_video_list && current_faquan.img_or_video_list[0]) {
          share_img = current_faquan.img_or_video_list[0].url;
        }
      }
      else if(current_faquan.type == 1){
        //视频
        if(current_faquan.img_or_video_list && current_faquan.img_or_video_list[0]){
          share_img = current_faquan.img_or_video_list[0].video_img;
        }
      }
    }

    

    return {
      title: share_title,
      path: share_path,
      imageUrl: share_img,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }



  },
  onShareTimeline: function () {
    console.log('app.globalData.shop_name : '+app.globalData.shop_name);

    return this.share_return();
  },
  onAddToFavorites: function () {
    return this.share_return();
  },
  share_return: function () {
    var parameters = '';
    if (this.data.current_faquanid){
      parameters = 'faquanid=' + this.data.current_faquanid;
    }
    else if(this.data.is_my_discover = 1){
      parameters = 'display_type=my';
    }
    else if(this.data.is_my_discover_collection = 1){
      parameters = 'display_type=collect';
    }

    return {
      title: '' + app.globalData.shop_name,
      query: parameters, 
      imageUrl:app.globalData.shop_icon
    }
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      isShowBottomLine: 0,

      faquanList: [],
    })

    app.delFaquanSetting();
    app.getFaquanSetting(this, this.callback_flash_ad_list);

    this.__getFaquanList();

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
    console.log('start_and_stop_other_videos=====>>>>', e);
    var video_id = e.currentTarget.dataset.id;
    

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
    if (this.data.current_self_in_tabbar == 1) {
      last_url = 'switchTab /cms/discover/discover';
    }

    //如果发布帖子成功后跳转到 我的发布
    if (this.data.faquan_add_publish_to == 1){
      last_url = '/cms/discover/discover?display_type=my';
    }

    
  
    if(app.goto_user_login(last_url)){
      return;
    }

    var userInfo = app.get_user_info();

    var is_get_userinfo = null;

    if (userInfo){
      is_get_userinfo = userInfo.is_get_userinfo;
    }

    console.log('is_get_userinfo====>>>', is_get_userinfo);
    


    if (!is_get_userinfo){
      if (this.data.current_self_in_tabbar == 1) {
        app.goto_get_userinfo(last_url, 'switchTab');
      }
      else{
        app.goto_get_userinfo(last_url, 'normal');
      }
      
      return;
    }

    var action_list = [];
    var is_single_count = 1;
    var is_single_image_or_video =  '';

    console.log('this.data.faquan_content_type_image===>>>', this.data.faquan_content_type_image);
    console.log('this.data.faquan_content_type_video===>>>', this.data.faquan_content_type_video);

    if ((this.data.faquan_content_type_image == 1) && (this.data.faquan_content_type_video == 0)) {
      console.log('000000000000=====>>>>')

      action_list = ['照片'];
      is_single_image_or_video = 'image';
    }
    else if ((this.data.faquan_content_type_image == 0) && (this.data.faquan_content_type_video == 1)) {
      console.log('111111111=====>>>>')

      action_list = ['视频'];
      is_single_image_or_video = 'video';
    }
    else if ((this.data.faquan_content_type_image == 1) && (this.data.faquan_content_type_video == 1)) {
      console.log('222222222222222=====>>>>')

      action_list = ['照片', '视频'];
      is_single_count = 2;
    }

    console.log('is_get_userinfo====>>>22222222222222', is_get_userinfo);
    

    wx.showActionSheet({
      itemList: action_list,
      success(res) {
        console.log('showActionSheet=====>>>>', res);

        
        
        wx.setStorageSync('get_userinfo_last_url', last_url);
        wx.setStorageSync('get_userinfo_page_type', 'normal');
        
        if ((res.tapIndex == 0)) {
          if((is_single_count == 1) && (is_single_image_or_video == 'image')){
            is_single_image_or_video = 'image';
          }
          else if ((is_single_count) && (is_single_image_or_video == 'video')){
            is_single_image_or_video = 'video';
          }
          else if(is_single_count == 2){
            is_single_image_or_video = 'image';
          }
          
        } else {
          is_single_image_or_video = 'video';
        }

        wx.navigateTo({
          url: '/cms/publish/publish?publishtype=' + is_single_image_or_video,
        })

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

    this.__getFaquanList();
    
  },

  videometa:function(e){
    console.log('videometa======>>>>>', e);

    var current_id = e.target.dataset.id;
    var current_index = e.target.dataset.index;

    var imgwidth = e.detail.width;
    var imgheight = e.detail.height;


    //宽高比  
    var ratio = imgwidth / imgheight;

    console.log(imgwidth, imgheight)

    //var current_view_width = this.data.current_view_width;

    // rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。
    // 如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。
    var current_view_width = 750;

    current_view_width = current_view_width*0.9*0.9;

    //计算的高度值  
    var current_view_height = current_view_width / ratio;


    //赋值给前端
    var videometa_width_height_list = this.data.videometa_width_height_list;
    videometa_width_height_list[current_index] = [current_view_width, current_view_height];

    console.log('videometa_width_height_list====>>>>', videometa_width_height_list);

    this.setData({
      videometa_width_height_list: videometa_width_height_list
    });
  },

  //修改帖子状态
  change_faquan_status:function(e){
    var faquanid = e.target.dataset.faquanid;
    var status = e.target.dataset.status;

    var userInfo = app.get_user_info();
    if (!userInfo){
      return;
    }

    var that = this;
    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/change_faquan_status',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),
        
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,

        faquanid: faquanid,
        status:status
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showModal({
            title: '操作成功',
            content: res.data.msg,
            showCancel: false,
            success(){
              that.setData({
                page:1
              });

              that.setData({
                faquanList: [],
              })

              that.__getFaquanList();
            }
          })
        }
        else{
          wx.showModal({
            title: '操作失败',
            content: res.data.msg,
            showCancel: false
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

  }
 
  

})