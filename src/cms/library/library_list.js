// cms/library/library_list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    isShowBottomLine: 0,
    pictureList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options======', options)
    if(options && options.productid){
      this.setData({
        productid: options.productid
      })
    
    }

    app.set_option_list_str(null, app.getColor());

    var that = this 
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/ProductAlbumData/get_product_album_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        page: 1,
        productid: that.data.productid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var data = res.data.data
        if (res.data.code == 1) {
        that.setData({
          pictureList: data.data,
          type: data.type,
          page: that.data.page + 1,
        })
        }else{
          wx.showToast({
            title: '暂无图片',
            icon: 'none'
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


  get_product_album_list:function(e){
    var that = this
    var productid = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/cms/library/library_list?productid=' + productid,
    })
  },


  bigImg:function(e){
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.pictureList[index], // 当前显示图片的http链接
      urls: this.data.pictureList // 需要预览的图片http链接列表
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
    var that = this;
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/ProductAlbumData/get_product_album_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        page: that.data.page,
        productid: that.data.productid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var data = res.data.data
        if (res.data.code == 1) {
          if(data.data){
            that.setData({
              pictureList: that.data.pictureList.concat(data.data),
              type: data.type,
              page: that.data.page + 1,
            })
          }else{
            that.setData({
              isShowBottomLine: 1,
            })
            wx.showToast({
              title: '到底了!',
              icon: 'none',
              duration: 2000,
            })
          }
          
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

  }
})