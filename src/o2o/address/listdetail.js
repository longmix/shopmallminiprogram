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
    showloulist:true,
    selectFloor:0
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
    if(options.bid){
      that.setData({
        search_bid:options.bid
      })
    }
    
    var data_params = {
      sellerid: app.get_sellerid(),
      level01: shengname,
      level02: name,
    }

    if (that.data.search_bid){
      data_params.bid = that.data.search_bid
    }

    wx.request({
      url: app.globalData.http_server + 'openapi/O2OAddressData/get_level03_jingwei_list',
      method: 'post',
      data: data_params,
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
    userInfo = app.get_user_info();
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

    var last_url = '/o2o/address/listdetail?shengname=' + that.data.level01 + '&qvname=' + that.data.level02;
    app.goto_user_login(last_url, 'normal');

    var totalfloor = e.currentTarget.dataset.totalfloor;
    var bid = e.currentTarget.dataset.bid;

    var floorList = ['请选择楼层'];

    for(var i=1; i<=totalfloor; i++){
      floorList[i] = i;
    }
    console.log('floorList=', floorList)

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
    if(index !=0){
      this.setData({
        selectFloor:1
      })
    }else{
      this.setData({
        selectFloor: 0
      })
    }
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
  userName: function (e) {
    var userName = e.detail.value;
    this.setData({
      userName: userName,
    })
  },
  mobileNo: function (e) {
    var mobileNo = e.detail.value;
    this.setData({
      mobileNo: mobileNo,
    })
  },

  //确认添加地址
  doAddNewAddess:function(e){
    var that = this 
    var roomNo = this.data.roomNo;
    var companyName = this.data.companyName;
    var userName = this.data.userName;
    var mobileNo = this.data.mobileNo;
    if (companyName == ''){
      wx.showToast({
        title: '公司名称不能为空',
        icon:'none'
      })
      return false
    }
    if (roomNo == '') {
      wx.showToast({
        title: '房间编号不能为空',
        icon: 'none'
      })
      return false
    }

    if (that.data.floorIndex == 0){
      wx.showToast({
        title: '请选择楼层',
        icon: 'none'
      })
      return false
    }


    if (userName == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return false
    }

    if (!that.data.mobileNo) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return;
    }


    if (!(/^1[345789]\d{9}$/.test(that.data.mobileNo)) || that.data.mobileNo.length > 11) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    
    wx.request({
      url: app.globalData.http_server + 'openapi/O2OAddressData/add_company_by_bid',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        bid: that.data.bid,
        name: that.data.companyName,
        room_no: that.data.roomNo,
        floor_num: that.data.floorList[that.data.floorIndex],
        userid: userInfo.userid,
        apply_name: that.data.userName,
        apply_mobile: that.data.mobileNo
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('565656565', res);

        if (res.data.code == 1) {
          wx.showToast({
            title: '添加成功，等待审核',
            icon: 'none'
          })
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
  },

  //搜索
  search: function () {
    var that = this;
    that.setData({
      showloulist: false
    })
  },

  //搜索提示
  searchinput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    that.setData({
      keywords: keywords
    })

    if (!keywords) {
      that.setData({
        showloulist: true,
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
        if (res.data.code == 1) {
          that.setData({
            building_list: data.building_list,
            room_list: data.room_list,
            showloulist:false
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
    console.log('this.data.keywords2', !this.data.keywords)
    if (!this.data.keywords) {
      this.setData({
        showloulist: true,
        building_list: [],
        room_list: []
      })
      return;
    }
  },
  goToDetail: function (e) {
    var index = e.currentTarget.dataset.index;
    var buildItem = this.data.building_list[index];

    wx.navigateTo({
      url: '/o2o/address/listdetail?shengname=' + buildItem.level01 + '&qvname=' + buildItem.level02 + '&bid=' + buildItem.bid,
    })
  },
  chooseRoom2: function (e) {
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