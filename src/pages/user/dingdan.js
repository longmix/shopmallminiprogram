// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var next_page = 1;
var common = require("../../utils/common.js");
var userInfo = app.get_user_info();
Page({  
  data: {  
    isHideLoadMore:false,
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,  
    isStatus:1,//1待付款，2待发货，6待收货 7已完成
    page:1,
    refundpage:0,
    ordreList:[],
    orderList0:[],
    orderList1:[],
    orderList2:[],
    orderList3:[],
    orderList4:[],
  },  
  onShow: function () {
    app.getColor();
  },
  onLoad: function(options) {
    // if (options.currentTab){
    //    this.onLoad();
    // }  
    
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus:options.otype
    });
    if(this.data.currentTab == 4){
      this.loadReturnOrderList();
    }else{
      
      this.loadOrderList();
    }
  },  
  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

//取消订单
removeOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=orderdel',
          method:'post',
          data: {
            orderid: orderId,
            sellerid: app.get_sellerid(),
            checkstr: userInfo.checkstr,
            userid: userInfo.userid
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var code = res.data.code;
            if(code == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
            }else{
              wx.showToast({
                title: res.data.msg,
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });

      }
    });
  },

  //确认收货
recOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定已收到宝贝吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_finish',
          method:'post',
          data: {
            orderid: orderId,
            sellerid: app.get_sellerid(),
            checkstr: userInfo.checkstr,
            userid: userInfo.userid
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var code = res.data.code;
            if (code == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
            }else{
              wx.showToast({
                title: res.data.msg,
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });

      }
    });
  },
//点击加载更多
onReachBottom: function () {
  var app = getApp();
  var userInfo = app.get_user_info();
    console.log('加载更多')
  var that = this;
  var page = that.data.page;
  next_page++;
  wx.showToast({ 
    title: '加载中',
    icon: 'loading',
    duration: 500
  }) 
  wx.request({
    url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_index',
    method: 'post',
    data: {
      order_sort: that.data.isStatus,
      sellerid: app.get_sellerid(),
      checkstr: userInfo.checkstr,
      userid: userInfo.userid,
      page: next_page
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {

      console.log('11111111');
      var list = res.data.orderList;
      /*
      var order_list = [];
      if (list || list != null) {
        for (var i = 0; i < list.length; i++) {
          //var pro_list = list[i].orderProduct;
          //console.log(pro_list);
          order_list.push(list[i].orderProduct);
        }
      }
      */
      console.log(that.data.orderList0);
      if (list == null) {
        console.log('2222222');
        that.setData({
          isHideLoadMore: true,
        });
        return false;
      }else{
      switch (that.data.currentTab) {
        case 0:
          console.log('3333333');
          setTimeout(() => {
            that.setData({
              orderList: that.data.orderList.concat(list),
              page: page + 1,
            });
          }, 100)
          break;
        case 1:
          setTimeout(() => {
          that.setData({
            orderList0: that.data.orderList0.concat(list),
            page: page + 1,
          });
          }, 100)
          break;
        case 2:
          setTimeout(() => {
          that.setData({
            orderList1: that.data.orderList1.concat(list),
            page: page + 1,
          });
          }, 100)
          break;
        case 3:
          setTimeout(() => {
          that.setData({
            orderList2: that.data.orderList2.concat(list),
            page: page + 1,
          });
          }, 100)
          break;
        case 4:
          setTimeout(() => {
          that.setData({
            orderList3: that.data.orderList3.concat(list),
            page: page + 1,
          });
          }, 100)
          break;
      }
      if (list && list != null && list.length > 5) {
        var winHeight = that.data.winHeight;
        console.log(that.data.page)
        var Height = winHeight * (winHeight / 370) * (that.data.page+1);
        console.log(Height);
        that.setData({
          Height: Height*3
        });
      } else  {
        that.setData({
          Height: that.data.winHeight + 370,
          isHideLoadMore: true,
        });
      } 
      }
    },
      //that.initProductData(data);
    fail: function (e) {
      console.log("22222");
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  })
},
  loadOrderList: function(){
    console.log('sdfsdfsdfasadf')
    var that = this;
    var userInfo = app.get_user_info();
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_index',
      method:'post',
      data: {
        order_sort: that.data.isStatus,
        page:	1,
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var code = res.data.code;
        var list = res.data.orderList;
        /*
        var order_list = [];
        if (list||list!=null){
        for(var i = 0;i < list.length;i++){
          //var pro_list = list[i].orderProduct;
          //console.log(pro_list);
          order_list.push(list[i].orderProduct);
        }
        }
        */
        var Height = that.data.winHeight;
        console.log('that.data.currentTab====', that.data.currentTab)
        console.log('listlist',list);
        switch(that.data.currentTab){
          case 0:
          console.log('ddddddd')
            that.setData({
              isHideLoadMore: false,
              orderList: list,
              Height: Height,
              page: 1
            });
            break;
          case 1:
            that.setData({
              isHideLoadMore: false,
              orderList0: list,
              Height: Height,
              page:1
            });
            break;
          case 2:
            that.setData({
              isHideLoadMore: false,
              orderList1: list,
              Height: Height,
              page: 1
            });
            break;  
          case 3:
            that.setData({
              isHideLoadMore: false,
              orderList2: list,
              Height: Height,
              page: 1
            });
            break;
          case 4:
            that.setData({
              isHideLoadMore: false,
              orderList3: list,
              Height: Height,
              page: 1
            });
            break;
 
        }

        console.log('orderlistorderlist', that.data.orderList);
        if (list && list != null && list.length>5){
          var winHeight = that.data.winHeight
          var Height = winHeight*2*that.data.page;
          that.setData({
            Height: Height
          });
        } else {

          that.setData({
            Height: that.data.winHeight+370,
            isHideLoadMore: false,
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

loadReturnOrderList:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_refund',
      method:'post',
      data: {
        uid:app.d.userId,
        page:that.data.refundpage,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.ord;
        var status = res.data.status;
        if(status==1){
          that.setData({
            orderList4: that.data.orderList4.concat(data),
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  
  // returnProduct:function(){
  // },
  initSystemInfo:function(){
    var that = this;  
    wx.getSystemInfo( {
      success: function( res ) {  
        console.log('地地道道的多大的',res)
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }    
    });
  },
  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  },  
  swichNav: function(e) { 
    
    var that = this;  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else { 
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });
      that.loadOrderList();
      //没有数据就进行加载
/*
      switch(that.data.currentTab){
          case 0:
            !that.data.orderList0.length && that.loadOrderList();
            break;
          case 1:
            !that.data.orderList1.length && that.loadOrderList();
            break;  
          case 2:
            !that.data.orderList2.length && that.loadOrderList();
            break;
          case 3:
            !that.data.orderList3.length && that.loadOrderList();
            break;
          case 4:
            that.data.orderList4.length = 0;
            that.loadReturnOrderList();
            break;
        }
        */
    };
  },
  /**
   * 微信支付订单
   */
  // payOrderByWechat: function(event){
  //   var orderId = event.currentTarget.dataset.orderId;
  //   this.prePayWechatOrder(orderId);
  //   var successCallback = function(response){
  //     console.log(response);
  //   }
  //   common.doWechatPay("prepayId", successCallback);
  // },

  payOrderByWechat: function (e) {
    var order_id = e.currentTarget.dataset.orderId;
    var order_sn = e.currentTarget.dataset.ordersn;
    if(!order_sn){
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  payOrderByWechat: function (e) {
    var order_id = e.currentTarget.dataset.orderId;
    var order_sn = e.currentTarget.dataset.ordersn;
    if(!order_sn){
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../user/dingdan?currentTab=1&otype=deliver',
                });
              }, 3000);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '/pages/user/user',
    })
  },
  
  /**
   * 调用服务器微信统一下单接口创建一笔微信预订单
   */
//   prePayWechatOrder: function(orderId){
//     var uri = "/ztb/userZBT/GetWxOrder";
//     var method = "post";
//     var dataMap = {
//       SessionId: app.globalData.userInfo.sessionId,
//       OrderNo: orderId
//     }
//     console.log(dataMap);
//     var successCallback = function (response) {
//       console.log(response);
//     };
//     common.sentHttpRequestToServer(uri, dataMap, method, successCallback);
//   }
})