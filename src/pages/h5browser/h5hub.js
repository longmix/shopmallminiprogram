// pages/h5browser/h5hub.js

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

    console.log('options', options)

    var redirect_url = decodeURIComponent(options.url);

    console.log('redirect_url=======', redirect_url);
    //return;

    var parent_openid = options.parent_openid;

    that.setData({
      parent_openid: parent_openid
    })

    wx.login({
      success: function (res) {
        console.log("btn_one_click_login 获取到的jscode是:" + res.code);

        //如果拒绝授权， e.detail.errMsg
        //console.log(e.detail.errMsg);return;

        wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=wxa_one_click_login',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          dataType: 'json',
          data: {
            js_code: res.code,
            xiaochengxu_appid: app.globalData.xiaochengxu_appid,
            // iv: e.detail.iv,
            // encryptedData: e.detail.encryptedData,
            sellerid: app.get_sellerid(),
            parentid: app.get_current_parentid(),

            //uwid: app.globalData.userInfo.uwid,
            //checkstr: app.globalData.userInfo.checkstr,
            // userid: app.globalData.userInfo.userid
          },
          success: function (res) {
            console.log(res);

            if (res.data && (res.data.code == 1)) {
              //更新checkstr和uwid，
              app.globalData.userInfo.userid = res.data.userid;
              //app.globalData.userInfo.checkstr = res.data.checkstr;

              console.log('静默方式获取openid成功:' + res.data);

              app.globalData.sellerid = app.get_sellerid();
              app.globalData.userInfo.user_openid = res.data.openid;


              //app.globalData.userInfo.userid = res.data.userid;
              //app.globalData.userInfo.checkstr = res.data.checkstr;
              //app.globalData.userInfo.is_get_userinfo = res.data.is_get_userinfo;

              //保存openid
              app.set_current_openid(res.data.openid);

              console.log(app.globalData.userInfo);

              app.set_user_info(app.globalData.userInfo);

              redirect_url = redirect_url + '&openid=' + res.data.openid;
              // o2yUE5hWMpWHKGYzI3NEfwSymo5o
              // redirect_url = 'https://yanyubao.tseo.cn/chouheji/?sellerid=pmyxQxkkU&openid=' + res.data.openid;


              //redirect_url = '/pages/h5browser/h5browser?url=' + encodeURIComponent(redirect_url);
           

              wx.request({
                url: app.globalData.http_server + 'openapi/ChouhejiData/set_toushika_record',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                dataType: 'json',
                data: {
                  sellerid: app.get_sellerid(),
                  parent_openid: that.data.parent_openid,
                  openid: app.get_current_openid()
                },
                success: function (res) {
                  var data = res.data;

                  if (data.code == 1) {
                    console.log('redirect_url', redirect_url)

                    app.call_h5browser_or_other_goto_url(redirect_url)
                    return;
                    // wx.redirectTo({
                    //   url: redirect_url,
                    // })

                  }
                }
              });

              


            }
            else {
              //一键登录返回错误代码
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })

            }
          }
        });
      },
      fail: function (login_res) {
        console.log('login.js  wx.login失败。');
      }

    });

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