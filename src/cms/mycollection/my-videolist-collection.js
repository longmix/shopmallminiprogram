// cms/quanquan/quanquanlist.js
var app = getApp();
var userInfo = app.get_user_info();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    month: '',
    cata: '',
    is_my_video_collection: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    app.set_option_list_str(null, app.getColor());
    
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
      url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/get_video_collect_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        page: 1,
        userid: userInfo.userid,
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
  onShareAppMessage: function () {

  },

  


  tovideo_details: function (e) {
    console.log('0000',e)
     
    wx.navigateTo({
      url: '/cms/quanquan/quanquan_details?videoid=' + e.currentTarget.dataset.videoid,
    })
  }
})