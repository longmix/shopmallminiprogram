// pages/welcome_page/welcome_page.js
var app = getApp();

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

    var that = this;
    console.log('66666666666', that.data.cataid)
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        keyword: that.data.searchValue ? that.data.searchValue : '',
        sort: 1,
        page: that.data.page,
        cataid: that.data.cataid ? that.data.cataid : ''
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.product_list;
        if (data == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          that.setData({
            is_more: false,
          })
          return false;
        }
        that.setData({
          shopList: data,
          page: 1,
          is_more: true,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

  },



  


  //详情页跳转
  lookdetail: function (e) {
    console.log(e)
    var lookid = e.currentTarget.dataset.procuctid;
    console.log(lookid);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
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
    wx.reLaunch({
      url: '../index/index'
    })
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

  }
})