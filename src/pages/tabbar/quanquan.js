// cms/quanquan/quanquan.js
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


    /*
    if(options.cata){
      //跳转到 cms/quanquan/quanquanlist  在tab栏 参数写缓存

      wx.setStorageSync('current_quanquan_cata', options.cata);
      wx.switchTab({
        url: '/cms/quanquan/quanquanlist',
      })

    }*/
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

    //通过  redirectTo 跳转，模板页面应该添加一个返回首页的链接，不然在APP中会出现跳不回去的情况
    wx.redirectTo({
      url: '/cms/quanquan/quanquanlist',
      fail: (res) => {
        console.log(res);
      },
      success: (res) => {
        console.log(res);
      }
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

  }
})