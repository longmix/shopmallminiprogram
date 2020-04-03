// cms/video/videolist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    month: '',
    cata: '',
    imgheights:[],
    current:0,
    isShowBottomLine:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.set_option_list_str(null, app.getColor());

    // wx.setNavigationBarTitle({
    //   title: '视频库'
    // })

    var that = this;
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


    


// 加载分类和时间
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/get_cata_month_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;


        var cataArr = [];
        var monthArr = [];
        cataArr.push('全部');
        monthArr.push('全部');

        if(!data.cata){
          console.log('error!!! data.cata');
          return;
        }

        if (!data.month) {
          console.log('error!!! data.month');
          return;
        }

        for (var i = 0; i < data.cata.length; i++) {
          cataArr.push(data.cata[i]);       
        }

        for (var i = 0; i < data.month.length; i++) {
          monthArr.push(data.month[i]);
        }

        that.setData({
          cataArr: cataArr,
          monthArr: monthArr,
        })

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

    this.getVideoList();
   
  },

// 加载视频库列表
  getVideoList:function(e){
    var that = this
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/get_video_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        page: 1,
        month: that.data.month,
        cata: that.data.cata
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var videoList = res.data.data;

        console.log('videoList===', videoList)

        if (res.data.code == 1){
          that.setData({
            videoList: videoList,
            page: that.data.page + 1
          })
        }else{
          that.setData({
            videoList: [],
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


  // 月份改变函数
  bindPickerChangeMonth:function(e){

    console.log('month===',e);
    var value = e.detail.value  
      this.setData({
        month: value==0 ? '' : this.data.monthArr[value],
        page: 1
      })
  

    this.getVideoList();
  },

  // 分类改变函数
  bindPickerChangeCata: function (e) {
    console.log('cata===', e);
    var value = e.detail.value
    this.setData({
      cata: value==0 ? '' : this.data.cataArr[value],
      page: 1
    })

    this.getVideoList();
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
    this.getVideoList();
    console.log('下拉刷新==')
    this.onLoad();
    this.onShow();
    console.log('下拉刷新==============')
    // app.set_option_list_str(this, this.getShopOptionAndRefresh);
    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    console.log('onReachBottom onReachBottom onReachBottom');
  
    var that = this
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/get_video_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        page: that.data.page,
        month: that.data.month,
        cata: that.data.cata
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var videoList = res.data.data;

        console.log('videoList===', videoList)

        if (res.data.code == 1) {
          that.setData({
            videoList: that.data.videoList.concat(videoList),
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  


  tovideo_details: function (e) {
    console.log('0000',e)
     
    wx.navigateTo({
      url: '/cms/video/video_details?videoid=' + e.currentTarget.dataset.videoid,
    })
  }
})