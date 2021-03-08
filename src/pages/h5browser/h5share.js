// pages/h5browser/h5share.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    return :{
      height_overall:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var __that = this;

    console.log("options",options);

    wx.getSystemInfo({
      //获取手机信息
      success: res => {
        //获取手机各种参数
        console.log("手机参数", res);
        //设置父元素(overall)高度  swiper不会自适应高度 需要设置固定高度
        this.height_overall = res.windowHeight;
        console.log("height_overall ====", this.height_overall);

      }
    })

    var idtype = options.idtype;
    var id = options.id;
    __that.setData({
      sellerid: options.sellerid
    })
    console.log('sellerid333333',this.data.sellerid);

    if(idtype == 'product'){

      var productid = id;
      console.log("productid",productid);

      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_detail',
        method: 'post',
        data: {
          productid: productid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var code = res.data.code;
          if (code == 1) {
            var detail = res.data.data;

            console.log("detail",detail);

            __that.setData({
              detail: detail,
            });

          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }

        },
        fail: function (res) {
          wx.showToast({
            title: '网络异常',
            duration: 2000
          })

        },
      });

    }



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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log('this.data.sellerid',this.data.sellerid);
    
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }

    //var url = 'http://192.168.0.87:8080/chouheji/pages/chouheji/chouheji_index2?sellerid=' + app.get_sellerid();
    var url = app.globalData.http_server + 'chouheji/?sellerid=' +  this.data.sellerid;


    return {
      title: '抽盒机',
      path: '/pages/h5browser/h5hub?url=' + encodeURIComponent(url) + '&parent_openid=' + app.get_current_openid() + '&sellerid=' + this.data.sellerid
    }

  },

  changeColor:function(){
    // console.log(123);
  }
})