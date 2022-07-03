// pages/account_edit/account_edit.js
var app = getApp();
var userInfo = app.get_user_info();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:''
  },

  onShow: function(){
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(!userInfo){
      userInfo = app.get_user_info();
    }
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
      data: {
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        sellerid: app.get_sellerid(),
        
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        that.setData({
          account: res.data.data.account
        })
        
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  formSubmit: function (e) {
    var new_account = e.detail.value.new_account;
    var new_password = e.detail.value.new_password;
    var new_password2 = e.detail.value.new_password2;
    if (!new_account) {
      wx.showToast({
        title: '账号不能为6空',
        duration: 2000
      });
      return;
    }


    if(new_password.length<6){
      wx.showToast({
        title: '密码至少为6位',
        duration: 2000
      });
      return;
    }

    if (new_password != new_password2) {
      wx.showToast({
        title: '两次输入密码不一致',
        duration: 2000
      });
      return;
    }
    
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=set_user_password',
      data: {
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        sellerid: app.get_sellerid(),
        new_account: new_account,
        new_password: new_password,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var code = res.data.code;
        if (code == 1) {
          wx.showModal({
            title: '修改成功',
            content: res.data.msg,
            showCancel:false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }

              app.del_user_info();

              wx.reLaunch({
                url: '/pages/tabbar/user',
              })
            }

          })

        } else {
          wx.showToast({
            title: '修改失败！',
            duration: 2000
          });
          return;
        }        
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})