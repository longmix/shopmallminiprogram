// pages/help_detail/help_detail.js
var app = getApp();
//var mars = require('../../mars/modules/mars')
var WxParse = require('../../wxParse/wxParse.js');

//var userInfo = app.get_user_info();
var userInfo = null;

Page({
  data: {
      headlineItem_img:'',
      content:'',
      title:'',
      id:0,
      listid:0,
      sellerid:'',//如何获取listid和sellerid？？？
      mode:'widthFix'

  },
  onShow: function () {
    if(!userInfo){
      userInfo = app.get_user_info();
    }
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    

  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    

    var that = this

    app.set_option_list_str(null, app.getColor());
    
    app.set_option_list_str(that, that.callback_set_option);

    userInfo = app.get_user_info();
    
    var current_openid = app.get_current_openid();


    
    that.setData({
      wz_id:options.id,
      theme_color_wenku:app.getColor()
    })

    console.log('colr=====', app.getColor())
    
    if (!current_openid){
      wx.showLoading({
        title: '正在加载....',
      });

      console.log('wx.login <<<==== onLoad <<<==== help_detail');

     wx.login({
        success: function (login_res) {
          console.log("wx.login返回：");
          console.log(login_res);

          if (!login_res.code) {
            return;
          }

          wx.request({
            url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=wxa_get_openid_using_js_code',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            dataType: 'json',
            data: {
              js_code: login_res.code,
              xiaochengxu_appid: app.globalData.xiaochengxu_appid,
              sellerid: app.get_sellerid(),
            },
            success: function (res) {
              wx.hideLoading();

              

              if(res.data.code == 1){
                current_openid = res.data.openid;
                app.set_current_openid(current_openid);

                that.__get_img_from_weiduke(options.id, that); 
                console.log('jjjjss')
              }
              else{
                wx.showModal({
                  title: '遇到错误',
                  content: res.data.msg,
                  showCancel:false,
                  success(res){
                    //返回上一页
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                });
                
                
              }
            },
            fail:function(res){
              wx.hideLoading();

              wx.showModal({
                title: '确认',
                content: '小程序网络异常',
              });

              //返回上一页
              wx.navigateBack({
                delta: 2
              })

            }
          });


        },
        fail: function (login_res){
          wx.hideLoading();

          console.log("wx.login  fail 返回：");
          console.log(login_res);

          wx.showModal({
            title: '确认',
            content: '小程序认证异常',
          });

          //返回上一页
          wx.navigateBack({
            delta: 2
          })
        }
      })   // End of wx.login

    }

    console.log(options);
    console.log("商户头条id:"+options.id);
    console.log("sellerid:" + options.sellerid);
    
    
    

    that.data.id = options.id;
    that.data.sellerid = options.sellerid;
    if (typeof (that.data.sellerid) == 'undefined') {
      that.data.sellerid = app.globalData.sellerid;
    }
    console.log('jjjjj', userInfo, app.globalData.token);

    this.__get_img_from_weiduke(options.id, this); 
    that.get_remark_list();

    //this.initArticle(options.aid)
  },


  callback_set_option: function (that, cb_params) {
    console.log('getShopOptionAndRefresh+++++:::' + cb_params)

    var that = this;
    var option_list = cb_params;
    console.log('option_list===', option_list)
    if (!option_list) {
      return;
    }
    if (option_list.wxa_show_article_detail_category) {
      that.setData({
        wxa_show_article_detail_category: option_list.wxa_show_article_detail_category
      })
    }
  }, 



  __get_img_from_weiduke: function (imgid, that){
    //=====更新商户头条=================
    //var url = app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=yingxiao';//+ app.globalData.sellerid;
    // var data = {
    //   id:options.id,
    //   action:'detail'
    // };
    var url = app.globalData.http_weiduke_server + 'index.php/openapi/ArticleImgApi/article_detail.shtml';
    var data = {
      token: app.get_current_weiduke_token(),
      id: imgid,
      openid: app.get_current_openid()
    };



    var cbSuccess = function (res) {
      if (res.data.code == 1) {
        //更新首页的商户头条
        //console.log('成功返回商户头条信息:' + res);
        //console.log(mars.html2json(res.data.data.info));
        var wz_keyword = res.data.data.keyword;
        that.setData({
          wz_text: res.data.data,
          wz_keyword2: wz_keyword,
          wz_title: res.data.data.title
        });

        // wx.setNavigationBarTitle({
        //   title: res.data.data.title
        // })

        var is_col = that.data.wz_text.is_col;
        if (is_col == 1) {
          var isShoucang = !that.data.isShoucang;
          that.setData({
            isShoucang: isShoucang
          })
        }
        WxParse.wxParse('content', 'html', res.data.data.info, that, 15);
      }
    };
    var cbError = function (res) {

    };
    app.httpPost(url, data, cbSuccess, cbError);
      //========End====================
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '' + that.data.wz_text.title,
      path: 'pages/help_detail/help_detail?id='+that.data.id,
      imageUrl:that.data.wz_text.pic,
      success: function(res) {
        // 分享成功
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        // 分享失败
        wx.showToast({
          title: '转发失败',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },
  onShareTimeline: function () {
    var that = this;

    return {
      title: '' + that.data.wz_text.title,
      query: 'id='+that.data.id, 
      imageUrl:that.data.wz_text.pic
    }
  },
  onAddToFavorites: function () {
    return this.onShareTimeline();
  },

  onReady: function () {
    // 页面渲染完成
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  show_share_btn: function () {
    console.log('aaaaa');
    //显示分享页面
    wx.showShareMenu({
      withShareTicket: true,
      success:function(){
        console.log('bbbbbb');
      }
    })
  },
  returnto_toutiao:function(){
    var that = this;
    wx.redirectTo({
      url: '../help/help?sellerid=' + that.data.sellerid

    })
  },
  returnto_index: function () {
    var that = this;
    var wxa_hidden_shop = JSON.parse(wx.getStorageSync('shop_option_list_str_' + app.get_sellerid())).wxa_hidden_shop;
    if (wxa_hidden_shop==1){
      wx.navigateTo({
        url: '../index/Liar',
      })
    }else{
      wx.switchTab({
        url: '../index/index?sellerid=' + that.data.sellerid

      })
    }  
  },

  //收藏
  shoucang: function () {
    var that = this;
    var wz_id = that.data.wz_text.id;
    console.log(wz_id);
    var isShoucang = !this.data.isShoucang;
    this.setData({
      isShoucang: isShoucang
    })


    var url = app.globalData.http_weiduke_server + 'index.php/openapi/ArticleImgApi/collect_my_update.shtml';
    var data = {
      token: app.get_current_weiduke_token(),
      openid: app.get_current_openid(),
      id: wz_id
    };
    var cbSuccess = function (res) {
      if (res.data.code == 1) {
       
      }
    };
    var cbError = function (res) {

    };
    app.httpPost(url, data, cbSuccess, cbError);
  },

  //回到首页
  toHomePage: function () {
    console.log('jjjjj444')
    wx.redirectTo({
      url: '/pages/index/Liar',
    })
  },


  //获取评论列表
  get_remark_list: function () {
    var that = this;
    wx.request({
      url: app.globalData.http_weiduke_server + 'index.php/openapi/ArticleImgApi/remark_img',
      method: 'post',
      data: {
        token: app.get_current_weiduke_token(),
        openid: app.get_current_openid(),
        action: 'list',
        imgid: that.data.wz_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 1) {

          

          var comment_num_id = 'comment_num_' + that.data.wz_id;
          var last_comment_num = wx.getStorageSync(comment_num_id);

          console.log('comment_num_id==', comment_num_id)

          var new_comment_num = 0;

          if (last_comment_num && (data.count >= last_comment_num)){
            new_comment_num = data.count - last_comment_num;
          } else {

            new_comment_num = data.count
          }

          that.setData({
            remarkList: data.msg,
            comment_num: new_comment_num ? new_comment_num : 0,
            comment_num_all: data.count,
            openid: app.get_current_openid()
          })

          

        } else {
          that.setData({
            remarkList: [],
            comment_num: 0,
            openid: app.get_current_openid()
          })
        }
      }
    })
  },




  //提交评论
  submitRemark: function (e) {
    var that = this;
    var remark = e.detail.value;
    var imgid = e.currentTarget.dataset.imgid

  if(!userInfo || !userInfo.userid){
    wx.navigateTo({
      url: '/pages/login/login',
    })
    return;
  }else{
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
      data: {
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log('ddd', res);
        // console.log('ddd', res.data.code);
        if (res.data.code == "-1") {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          var data = res.data
          var headimgurl = data.data.headimgurl
          var nickname = data.data.nickname

          var url = app.globalData.http_weiduke_server + 'index.php/openapi/ArticleImgApi/remark_img';
          var data = {
            token: app.get_current_weiduke_token(),
            openid: app.get_current_openid(),
            action: 'add',
            imgid: imgid,
            content: remark,
            icon: headimgurl,
            name: nickname
          };
          var cbSuccess = function (res) {
            if (res.data.code == 1) {
              that.get_remark_list();
              that.setData({
                inputValue: ''
              })
              wx.showToast({
                title: res.data.msg,
                duration: 2000
              })
            }
          };
          var cbError = function (res) {
            wx.showToast({
              title: '评论失败',
              duration: 2000
            })
          };
          app.httpPost(url, data, cbSuccess, cbError);

        }

      }
    }) 
  }
  },



  //删除评论
  deleteRemark: function (e) {
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success: function () {

          wx.setStorageSync('get_userinfo_last_url', '/cms/publish/publish?publishtype=' + that.data.publishtype);

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
    }

    var that = this;
    wx.request({
      url: app.globalData.http_weiduke_server + 'index.php/openapi/ArticleImgApi/remark_img',
      method: 'post',
      data: {
        token: app.get_current_weiduke_token,
        openid: app.get_current_openid(),
        action: 'del',
        imgid: that.data.wz_id,
        id: e.currentTarget.dataset.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if (data.code == 1) {
          wx.setStorageSync('comment_num_' + that.data.wz_id, that.data.comment_num_all-1)
          that.get_remark_list();
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '删除失败',
          duration: 2000
        })

      }
    })

  },



  //执行文章点赞或取消:
  doArticleDianzan:function(e){
    var that = this;
    var tongjiid = e.currentTarget.dataset.tongjiid
    if(!that.data.isDianzan){
      var action = 'add'
    }else{
      var action = 'del'
    }
    wx.request({
      url: app.globalData.http_weiduke_server + 'openapi/ArticleImgApi/dianzan_img',
      method: 'post',
      data: {
        token: app.get_current_weiduke_token(),
        openid: app.get_current_openid(),
        action: action,
        imgid: that.data.wz_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('opopop',res);
        var data = res.data;
        if (data.code == 1) {
          that.getArticleDianzan()
          
        }
      }
    })
  },



  //获取文章点赞
  getArticleDianzan:function(){
    var that = this;
    wx.request({
      url: app.globalData.http_weiduke_server + 'index.php/openapi/ArticleImgApi/dianzan_img',
      method: 'post',
      data: {
        token: app.get_current_weiduke_token,      
        openid: app.get_current_openid(),
        action: 'list',
        imgid: that.data.wz_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
       if(data.code == 1){
         that.setData({
           dianzanNum: data.msg.num
         })
       }
       
        if (data.status==1){
         that.setData({
           isDianzan: true,
         })
       }else{
          that.setData({
            isDianzan: false,
          })
       }
       
        console.log('4545454', res);
        
      }
    })

  },

  toReamrkList: function () {
    wx.setStorageSync('comment_num_' + this.data.wz_id, this.data.comment_num_all)
    this.setData({
      comment_num: 0
    })
    const query = wx.createSelectorQuery()
    query.select('#the-id').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      res[0].top // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
      wx.pageScrollTo({
        scrollTop: res[0].top,
        duration: 300
      })
    })
  },

})