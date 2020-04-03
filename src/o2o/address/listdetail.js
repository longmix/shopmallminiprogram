// o2o/address/listdetail.js
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
    companyName:'',
    roomNo:'',
    is_add_new_address:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('111111', options);
    var name = options.qvname;
    var shengname = options.shengname;
    var that = this;
      that.setData({
        level01: shengname,
        level02: name,
      });

    wx.request({
      url: app.globalData.http_server + 'openapi/O2OAddressData/get_level03_jingwei_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        level01: shengname,
        level02: name,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('565656565', res);

        if (res.data.code != 1) {
          //显示错误信息

          return;
        }


        var arr = res.data.data;
        var dis = 0
        var shop_location_list = []
        for (var index in arr) {
          if (!isNaN(index)) {
            dis = app.getDisance(wx.getStorageSync("latitude"), wx.getStorageSync("longitude"), arr[index]['latitude'], arr[index]['longitude']);

            arr[index]['dis'] = dis;

            dis = Math.ceil(dis)

            var dis_str = '';
            if (dis < 1000) {
              dis_str = dis + '米'
            }
            else {
              dis_str = (dis / 1000).toFixed(1) + '公里'
            }

            arr[index]['dis_str'] = dis_str;

            //console.log('222222222222222', arr[index]);

            shop_location_list.push(arr[index])
          }
        }

        function compare(obj1, obj2) {
          var val1 = obj1.dis;
          var val2 = obj2.dis;
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        }

        //排序
        console.log('排序完成', shop_location_list.sort(compare));

        wx.setStorageSync("shop_location_list", shop_location_list)


        var shop_location_list = wx.getStorageSync("shop_location_list")

        
        var threeArr = shop_location_list
        var str = ''
        for (var i = 0; i < threeArr.length; i++) {
          str += threeArr[i].bid + '|'
        }
        console.log('准备请求这20个商户：', threeArr)
        console.log('商户的id为：', str)
        that.setData({
          bid_str: str
        })

        that.getLoutList();


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



  chooseRoom:function(e){
    var that = this
    var index1 = e.currentTarget.dataset.index1;
    var index2 = e.currentTarget.dataset.index2;
    var address_info = {
      address: that.data.loulist[index1].address,
      level01: that.data.loulist[index1].level01,
      level02: that.data.loulist[index1].level02,
      level03: that.data.loulist[index1].level03,
      level04: that.data.loulist[index1].level04[index2]
    }
    var address_info_str = JSON.stringify(address_info);
    wx.setStorageSync('address_info_str', address_info_str)
    
    wx.reLaunch({
      url: '/o2o/index/index',
    })
    
    },
    //添加新地址
  addNewAddress:function(e){
    var that = this;
    console.log('ddddddssssssss',e)
    var totalfloor = e.currentTarget.dataset.totalfloor;
    var bid = e.currentTarget.dataset.bid;

    var floorList = [];
    for(var i=0; i<totalfloor; i++){
      floorList[i] = i+1;
    }

    that.setData({
      is_add_new_address: true,
      floorList: floorList,
      floorIndex: 0,
      bid: bid
    })
  },

  //关闭添加地址
  closeAddAddress: function (e) {
    this.setData({
      is_add_new_address: false,
    })
  },

  //选择楼层
  bindPickerChangeFloor:function(e){
    var index = e.detail.value;
    this.setData({
      floorIndex: index,
    })
  },
  companyName:function(e){
    var companyName = e.detail.value;
    this.setData({
      companyName: companyName,
    })
  },
  roomNo:function(e){
    var roomNo = e.detail.value;
    this.setData({
      roomNo: roomNo,
    })
  },

  //确认添加地址
  doAddNewAddess:function(e){
    var roomNo = this.data.roomNo;
    var companyName = this.data.companyName;
    console.log('123456789', companyName);
    if (companyName == ''){
      wx.showToast({
        title: '公司名称不能为空'
      })
      return false
    }
    if (roomNo == '') {
      wx.showToast({
        title: '房间编号不能为空'
      })
      return false
    }
    var that = this 
    wx.request({
      url: app.globalData.http_server + 'openapi/O2OAddressData/add_company_by_bid',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        bid: that.data.bid,
        name: that.data.companyName,
        room_no: that.data.roomNo,
        floor_num: that.data.floorList[that.data.floorIndex]
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('565656565', res);

        if (res.data.code == 1) {
          that.getLoutList();
          that.setData({
            is_add_new_address: false,
          })
          return;
        }
      }
  })
  },

  getLoutList:function(){
    var that = this;
    var shop_location_list = wx.getStorageSync("shop_location_list")
    api.abotRequest({
      url: app.globalData.http_server + 'openapi/O2OAddressData/get_level03_and_level04_by_jingwei_list',
      data: {
        sellerid: app.get_sellerid(),
        // checkstr: userInfo.checkstr,
        // userid: userInfo.userid,
        str: that.data.bid_str
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log('77777', res);

        var data = res.data;
        if (data.code != 1) {
          //显示错误信息
          return;
        }

        var loulist = data.data
        for (var i = 0; i < loulist.length; i++) {
          for (var j = 0; j < shop_location_list.length; j++) {
            if (loulist[i].bid == shop_location_list[j].bid) {
              loulist[i].dis_str = shop_location_list[j].dis_str;
              break;
            }
          }

        }

        that.setData({
          loulist: loulist
        });
        console.log('88888', loulist);
      }
    })
  }

})