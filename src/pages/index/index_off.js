// pages/index/index_off.js
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
    
    app.set_option_list_str(null, app.getColor());
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
    var that = this;
    var option_list = app.globalData.option_list;
    that.setData({
      option_list: option_list
    })

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
  //拨打客服电话
  call_seller: function () {

    wx.makePhoneCall({
      phoneNumber: this.data.option_list.wxa_kefu_mobile_num,
    })
  },
  //跳转h5
  goToOtherPage: function () {
    var url = this.data.option_list.wxa_kefu_form_url
    wx.navigateTo({
      url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
    });
    return;
  }  
})