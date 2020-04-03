// cms/index/index.js
var app = getApp();
var userInfo = app.get_user_info();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    imgheights:[],
    current: 0,
    isShowBottomLine: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getSystemInfo({      
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })



    app.get_shop_info_from_server(that.loadInfo);


    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_flash_ad_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        'type': 4
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

    that.getArticleList();

    app.set_option_list_str(this, this.callback_function);

    app.set_option_list_str(null, app.getColor());

  },


  

  // callback_function callback_function callback_function
  callback_function: function (that, cb_params) {
    var option_list = app.globalData.option_list;


    console.log('callback_function+++++:::' + cb_params)

    if (!option_list) {
      return;
    }

    if (option_list.wxa_show_index_swiper) {
      that.setData({
        wxa_show_index_swiper: option_list.wxa_show_index_swiper
      });
    }
    
  },



  loadInfo: function (res) {
    console.log('cms/index get_shop_info_from_server 回调：');
    console.log(res);

    var that = this;

    var shop_info_from_server = res;

    app.globalData.shop_name = shop_info_from_server.shop_name;

    wx.setNavigationBarTitle({
      title: app.globalData.shop_name
    })


  },

  showDetail: function (e) {
    var that = this;
    console.log('点击商户头条进入该详情' + e.currentTarget.dataset.id);

    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('browser_cache_id', id);

    wx.navigateTo({
      url: '/pages/help_detail/help_detail?id=' + id + '&sellerid=' + app.get_sellerid()

    })
  },



  getArticleList:function(e){
    var that = this
    wx.request({
      url: app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=yingxiao',
      method: 'post',
      data: {
        id: 'seller',
        action: 'list',
        sellerid: app.get_sellerid(),
        currentpage: 1,
        keyword: that.data.keyword ? that.data.keyword : ''
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        if (res.data.code == 1) {
          that.setData({
            articleList: res.data.data,
            page: that.data.page + 1
          })

          app.set_current_weiduke_token(res.data.token);

        } else {
          wx.showToast({
            title: '网络异常',
            icon: 'fail',
            duration: 2000,
          })
        }


      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

    });
  },


  //搜索文章
  searchArticle: function (e) {
    console.log('e====', e)
    var that = this;
    var keyword = e.detail.value;
    that.setData({
      keyword: keyword,
      is_search: true,
    })
    that.getArticleList();
  },

  //取消搜索
  cancelSearch: function (e) {
    this.setData({
      keyword: '',
      is_search: false,
      page: 1
    })
    this.getArticleList();
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
    
    if (!userInfo) {
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('ddddddd')
    var that = this;

    wx.request({
      url: app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=yingxiao',
      method: 'post',
      data: {
        id: 'seller',
        action: 'list',
        sellerid: app.get_sellerid(),
        currentpage: that.data.page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        if (res.data.code == 1) {
          if(res.data.data.length > 0){
            that.setData({
              articleList: that.data.articleList.concat(res.data.data),
              page: that.data.page + 1,
            })
          } else {
            that.setData({
              isShowBottomLine: 1,
            })
          }
          
          app.set_current_weiduke_token(res.data.token);

        } else {
          that.setData({
            isShowBottomLine: 1,
          })
          wx.showToast({
            title: '到底了！',
            icon: 'none',
            duration: 2000,
          })
        }


      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

    });


  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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

})