//城市选择
var app = getApp();
var userInfo = app.get_user_info();
Page({
  data: {
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    quArr: [],//区数组
    shengIndex:0,
    shiIndex: 0,
    quIndex: 0,
    mid: 0,
    sheng:0,
    city:0,
    area:0,
    code:0,
    cartId:0,
    addressId:'',
    action: 'add'
  },
  formSubmit: function (e) {
    var that = this;
    var adds = e.detail.value;
    var cartId = this.data.cartId;
    var userInfo = app.get_user_info();
    console.log(e)
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_save',
      data: {
        action: that.data.action,
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        sellerid: app.get_sellerid(),
        name: adds.name,
        mobile: adds.phone,
        province: that.data.province,
        city: that.data.city,
        district: that.data.area,
        address: adds.address,
        addressid: that.data.addressId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var code = res.data.code;
        if(code==1){
          wx.showToast({
            title: '保存成功！',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          });
          return;
        }
        wx.redirectTo({
          url: 'user-address/user-address?'
        });
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
  onShow: function () {
    app.getColor();
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      shengIndex: 0,
      shengArr: [],
      shengId: []
    });
    var that = this;
    var userInfo = app.get_user_info();
    if ((!userInfo) || (!userInfo.userid)) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    } 

    that.setData({
      cartId: options.cartId,
      addressId: options.addressId,
      action: options.action
    })

    //调用市和区地址
    if(that.data.action == 'edit'){
      var region_id = this.data.province;
      this.bindPickerChangeshiArr
      this.bindPickerChangequArr
    }


    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_save',
      data:{
        action: 'get',
        addressid: that.data.addressId,
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        sellerid: app.get_sellerid(),

      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        var province = res.data.data.province;
        var city = res.data.data.city;
        var district = res.data.data.district;
        console.log(city)
        province = province - 1;
        city = ++city;
        district = ++district;
        console.log(city)
        that.setData({
          name: res.data.data.name,
          mobile: res.data.data.mobile,
          shengIndex: province,
          shiIndex: city,
          quIndex: district,
          shixb: city,
          quxb: district,
          //拿到地址对应id
          province: res.data.data.province,
          city: res.data.data.city,
          district: res.data.data.district,
          area: res.data.data.district,
          address: res.data.data.address,
          sheng: res.data.data.province
        })

        //获取市级城市
        wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=region_get',
          data: {
            region_id: that.data.province
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            // success
            var code = res.data.code;
            var city = res.data.data;
            if (code == 1) {
              var shiArr = [];
              var shiId = [];
              var shiIndex = 0;
              var shiArr2 = [];
              shiArr.push('请选择');
              shiId.push('0');
              for (var i = 0; i < city.length; i++) {
                shiArr.push(city[i].region_name);
                shiId.push(city[i].region_id);
                console.log(2222222)
                console.log(that.data.shixb)
                if(city[i].region_id == that.data.shixb){
                  shiIndex = i;
                }
              }
              that.setData({
                shiArr: shiArr,
                shiId: shiId,
                shiIndex: shiIndex,
                shiArr2: city
              })
              var shArr = that.data.shiArr
              var shId = that.data.shiId
              console.log(shiIndex);
              console.log(shId);
              console.log(shArr);
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        })

        //获取区地址
        wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=region_get',
          data: {
            region_id: that.data.city
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var code = res.data.code;
            var city = res.data.data;
            if (code == 1) {
              var quArr = [];
              var quId = [];
              var quIndex = 0;
              var quArr1 = [];
              quArr.push('请选择');
              quId.push('0');
              for (var i = 0; i < city.length; i++) {
                quArr.push(city[i].region_name);
                quId.push(city[i].region_id);
                console.log(2222222)
                if (city[i].region_id == that.data.quxb) {
                  quIndex = i;
                }
              }
              that.setData({
                quArr: quArr,
                quId: quId,
                quIndex: quIndex,
                quArr1:city
              })
              var shArr = that.data.quArr
              var shId = that.data.quId
              console.log(quIndex);
              console.log(shId);
              console.log(shArr);
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        })



      }

    })

    //获取省级城市
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=region_get',
      data: {
        region_id: 1
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
       var code = res.data.code;
       var city = res.data.data;
       if (code == 1) {
         var shengArr = [];
         var shengId = [];
         shengArr.push('请选择');
         shengId.push('0');
         for (var i = 0; i < city.length; i++) {
           shengArr.push(city[i].region_name);
           shengId.push(city[i].region_id);
         }
        that.setData({
          shengArr: shengArr,
          shengId: shengId
        })
        var shArr = that.data.shengArr
        var shId = that.data.shengId
       }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
    var region_id = that.data.shengIndex

  },

  bindPickerChangeshengArr: function (e) {
    console.log(e);
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
      quArr:[],
      quiId: []
    });
    var that = this;
    var region_Val = e.detail.value
    var region_Id = ++region_Val;
    console.log(region_Id);
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=region_get',
      data: {
        region_id	:++e.detail.value,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var code = res.data.code;
        var city = res.data.data;
        if(code==1){
        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].region_name);
          hId.push(city[i].region_id);
        }
        that.setData({
          province: region_Id,
          shi:res.data.data,
          shiArr: hArr,
          shiId: hId
        })
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
  },

  bindPickerChangeshiArr: function (e) {
    console.log(e);
    this.setData({
      shiIndex: e.detail.value,
      quArr:[],
      quiId: []
    })
    var that = this;
    var city_id = that.data.shiIndex;
    console.log(city_id);
    //var city_name = that.data.shi;
    if (Array.isArray(that.data.shi)) {
      var city_name = that.data.shi;
    } else {
      var city_name = that.data.shiArr2;
    }
    console.log(city_name);
    var region_id = city_name[--city_id].region_id;
    console.log(region_id);
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=region_get',
      data: {
        region_id: region_id,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var code = res.data.code;
        var area = res.data.data;
        if(code==1){
        var qArr = [];
        var qId = [];
        qArr.push('请选择');
        qId.push('0');
        for (var i = 0; i < area.length; i++) {
          qArr.push(area[i].region_name)
          qId.push(area[i].region_id)
        }
        that.setData({
          area: res.data.data,
          city: region_id,
          quArr: qArr,
          quiId: qId
        })
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
  bindPickerChangequArr: function (e) {
    this.setData({
      quIndex: e.detail.value
    });
    var that = this;
    var qu_id = that.data.quIndex;
    console.log(qu_id);
    console.log(that.data.area)
    if (Array.isArray(that.data.area)){
      var qu_name = that.data.area;
    }else{
      var qu_name = that.data.quArr1;
    }
    console.log(qu_name)
    var region_id = qu_name[--qu_id].region_id;
    console.log(region_id);
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=region_get',
      data: {
        region_id: region_id
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          area: region_id,
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

})