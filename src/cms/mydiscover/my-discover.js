// cms/discover/discover.js
var app = getApp();
var userInfo = app.get_user_info();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    faquanList: [],
    is_my_discover: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    that.getFaquanList();

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
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list_by_userid',
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
            count: res.data.count,
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


  //发圈收藏
  fanquanCollect:function(e){
    console.log('e=======',e)
    var that = this;
    var faquanid = e.currentTarget.dataset.faquanid;
    var index = e.currentTarget.dataset.index;


    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success:function(){
          

          wx.setStorageSync('last_url', '/cms/index/index');
          wx.setStorageSync('page_type', 'switchTab');

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

          wx.setStorageSync('last_url', '/cms/index/index');
          wx.setStorageSync('page_type', 'switchTab');

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })
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
    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/get_faquan_list_by_userid',
      method: 'post',
      data: {
        appid: app.globalData.xiaochengxu_appid,
        sellerid: app.get_sellerid(),
        userid: userInfo ? userInfo.userid : '',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})