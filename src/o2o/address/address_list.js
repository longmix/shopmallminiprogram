// o2o/address/address_list.js
var app = getApp();
var next_page = 1;
var userInfo = app.get_user_info();
var api = require('../../utils/api');
var util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showshenglist:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.http_server + '/openapi/O2OAddressData/get_address_list_by_level',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.data;
        console.log('111111', res);

        if (!list){
          console.log('没有可选择的地址列表');
          return;
        }

        
        wx.request({
          url: app.globalData.http_server + '/openapi/O2OAddressData/get_address_list_by_level',
          method: 'post',
          data: {
            sellerid: app.get_sellerid(),
            level01: list[0],
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var list = res.data.data;
            console.log('2222', res);

            that.setData({
              qvlist: list,
            });

          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        })
        
        
        that.setData({
          shenglist: list,
          currType:list[0]
        });

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

  tapType: function (e) {
    var that = this;
    var currType = e.currentTarget.dataset.name;
    console.log('6666666',currType);
    that.setData({
      currType: currType
    });

    wx.request({
      url: app.globalData.http_server + '/openapi/O2OAddressData/get_address_list_by_level',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        level01: currType,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.data;
        console.log('2222', res);

        that.setData({
          qvlist: list,
        });

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },


  //搜索
  search: function () {
    var that = this;
    that.setData({
      showshenglist:false
    })
  },

  //搜索提示
  searchinput: function(e){
    var that = this;
    var keywords = e.detail.value;
    that.setData({
      keywords: keywords
    })

    if(!keywords){
      that.setData({
        showshenglist:true,    
      })
      return;
    }
    
      wx.request({
        url: app.globalData.http_server + '/openapi/O2OAddressData/search_by_keywords',
        method: 'post',
        data: {
          sellerid: app.get_sellerid(),
          keywords: keywords,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var data = res.data.data;
          if(res.data.code == 1){
            that.setData({
              building_list: data.building_list,
              room_list: data.room_list,
              showshenglist: false
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
  blurinput: function (e) {
    console.log('this.data.keywords', this.data.keywords)
    if(!this.data.keywords){
      this.setData({
        showshenglist: true,
        building_list:[],
        room_list:[]
      })
      return;
    }
  },
  goToDetail:function(e){
    var index = e.currentTarget.dataset.index;
    var buildItem = this.data.building_list[index];

    wx.navigateTo({
      url: '/o2o/address/listdetail?shengname=' + buildItem.level01 + '&qvname=' + buildItem.level02 + '&bid=' + buildItem.bid,
    })
  },
  chooseRoom:function(e){
    var index = e.currentTarget.dataset.index;
    var roomItem = this.data.room_list[index];

    var address_info = {
      address: roomItem.building_detail.address,
      level01: roomItem.building_detail.level01,
      level02: roomItem.building_detail.level02,
      level03: roomItem.building_detail.level03,
      level04: roomItem,
    }
    var address_info_str = JSON.stringify(address_info);
    wx.setStorageSync('address_info_str', address_info_str)

    wx.reLaunch({
      url: '/o2o/index/index',
    })
  },

  


})