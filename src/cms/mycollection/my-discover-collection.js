// cms/discover/discover.js



//这个模块已经不使用了，用  	/cms/discover/discover?display_type=collect 替代






var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    faquanList: [],
    is_my_discover_collection: 1,

    videometa_width_height_list: [],  //记录视频的高度
    current_view_width: 480,  //当前屏幕的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      nav_title: '发现.我收藏的',
    });
    

    that.getFaquanList();

    app.set_option_list_str(that, function (that02, option_list){
      app.getColor();

      if (option_list.wxa_shop_nav_bg_color) {
        that.setData({
          wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color,
          wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color,

        });
      }

    });

    app.getFaquanSetting(that, this.faquan_setting_callback);

  },
  faquan_setting_callback: function (that, cms_faquan_setting) {
    if (!cms_faquan_setting) {
      return;
    }

    if (cms_faquan_setting.faquan_tag_status) {
      that.setData({
        faquan_tag_status: cms_faquan_setting.faquan_tag_status
      })
    }


    if (cms_faquan_setting.faquan_my_title) {
      wx.setNavigationBarTitle({
        title: cms_faquan_setting.faquan_my_title
      })

      that.setData({
        nav_title: cms_faquan_setting.faquan_my_title,
      });
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
    var userInfo = app.get_user_info();

    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_collect_list',
      method: 'post',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),

        userid: userInfo.userid,
        checkstr: userInfo.checkstr,

        page: 1,
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
            count: res.data.count
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


    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success:function(){
          

          wx.setStorageSync('get_userinfo_last_url', '/cms/index/index');
          wx.setStorageSync('get_userinfo_page_type', 'switchTab');

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
    }

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/faquan_collect',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),

        userid: userInfo.userid,
        checkstr: userInfo.checkstr,

        faquanid: faquanid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if(res.data.code == 1){

          // if (that.data.faquanList[index].has_collect == '0'){
          //   that.data.faquanList[index].has_collect = "1"
          //   wx.showToast({
          //     title: '收藏成功！',
          //     duration: 2000
          //   });
          // }else{
            that.data.faquanList[index].has_collect = "0"
            wx.showToast({
              title: '取消收藏成功！',
              duration: 2000
            });
          // }
          
          that.getFaquanList();
          // that.setData({
          //   faquanList: that.data.faquanList
          // })
           
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

  bigImg: function (e) {
    var index = e.currentTarget.dataset.index;
    var index2 = e.currentTarget.dataset.index2;
    var img_or_video_list = this.data.faquanList[index].img_or_video_list;
    var imgList = [];

    for (var i = 0; i < img_or_video_list.length; i++) {
      imgList.push(img_or_video_list[i].url);
    }


    wx.previewImage({
      current: imgList[index2], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
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

    if(!userInfo){
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
    
    var userInfo = app.get_user_info();

    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list',
      method: 'post',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),

        userid: userInfo.userid,
        checkstr: userInfo.checkstr,

        page: that.data.page,
        keyword: that.data.keyword ? that.data.keyword : '',
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
  onShareAppMessage22222: function () {

  },

  videometa: function (e) {
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

    current_view_width = current_view_width * 0.9 * 0.9;

    //计算的高度值  
    var current_view_height = current_view_width / ratio;


    //赋值给前端
    var videometa_width_height_list = this.data.videometa_width_height_list;
    videometa_width_height_list[current_index] = [current_view_width, current_view_height];

    console.log('videometa_width_height_list====>>>>', videometa_width_height_list);

    this.setData({
      videometa_width_height_list: videometa_width_height_list
    });
  }

})