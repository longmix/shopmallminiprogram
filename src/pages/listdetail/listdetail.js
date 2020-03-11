var app = getApp()
Page({
  data: {
    current: 0,
    shopList: [],
    ptype:'',
    title:'延誉',
    page:1,
    catId:0,
    brandId: 0,
    focus: false,
    hotKeyShow: true,
    historyKeyShow: true,
    searchValue: '',
    historyKeyList: [],
    hotKeyList: [],
    is_more: true
  },
showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
 },
hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
    animationData: animation.export(),
    showModalStatus: false
   })
  }.bind(this), 200)
},

//点击加载更多
// getMore:function(e){
//   var that = this;
//   var page = that.data.page;
//   wx.request({
//       url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
//       method:'post',
//       data: {
//         page: page,
//         cataid:that.data.cataid,
//         sellerid: app.get_sellerid()
//       },
//       header: {
//         'Content-Type':  'application/x-www-form-urlencoded'
//       },
//       success: function (res) {  
//         var prolist = res.data.product_list;
//         if(prolist==''){
//           wx.showToast({
//             title: '没有更多数据！',
//             duration: 2000
//           });
//           return false;
//         }
//         //that.initProductData(data);
//         that.setData({
//           page: page+1,
//           shopList:that.data.shopList.concat(prolist)
//         });
//         //endInitData
//       },
//       fail:function(e){
//         wx.showToast({
//           title: '网络异常！',
//           duration: 2000
//         });
//       } 
//     })
// },
onLoad: function (options) {
  var that = this;
  var objectId = options.title;
  //更改头部标题
  wx.setNavigationBarTitle({
      title: objectId,
      success: function() {
      },
    });

    //页面初始化 options为页面跳转所带来的参数
    var cataid = options.cataid;
    that.setData({
      cataid: cataid,
    })
    if (cataid){
      that.setData({
        hotKeyShow: false,
        historyKeyShow: false,
      })
      //ajax请求数据
      this.searchProductData();
    }else{
      that.setData({
        is_more: false,
      })
    }
 
    
    
      console.log('nnnnnn', that.data.cataid)
    
    // wx.request({
    //   url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
    //   method:'post',
    //   data: {
    //     sellerid: app.get_sellerid(),
    //     cataid:cataid,
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     var shoplist = res.data.product_list;
    //     that.setData({
    //       shopList: shoplist
    //     })
    //   },
    //   error: function(e){
    //     wx.showToast({
    //       title: '网络异常！',
    //       duration: 2000
    //     });
    //   }
    // })
    

  var historyKeyList = wx.getStorageSync('historyKeyList_cache');

    that.setData({
      historyKeyList: historyKeyList ? historyKeyList : [],
    })

  console.log('56565', that.data.historyKeyList)

  wx.request({
    url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppH5&a=get_shop_option',
    method: 'post',
    data: {
      sellerid: app.get_sellerid(),
      keyword: that.data.searchValue,
      sort: 1,
      page: that.data.page,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log('sssss', res)
      var hotKeyList = res.data.hot_keywords
      that.setData({
        hotKeyList: hotKeyList,
      })
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    },
  });

  },

  //删除指定元素
  remove: function (e) {
    var index = this.data.historyKeyList.indexOf(e);
    if (index > -1) {
      this.data.historyKeyList.splice(index, 1);
    }
  },


  doKeySearch: function (e) {
    var key = e.currentTarget.dataset.key;

    var historyKeyList = this.data.historyKeyList;
    this.remove(key);
    historyKeyList.unshift(key);
    wx.setStorageSync('historyKeyList_cache', historyKeyList)

    this.setData({
      searchValue: key,
      hotKeyShow: false,
      historyKeyShow: false,
    });

    this.doSearch();
  },
  doSearch: function () {
    var searchKey = this.data.searchValue;

    var historyKeyList = this.data.historyKeyList;
    this.remove(searchKey);
    historyKeyList.unshift(searchKey);
    wx.setStorageSync('historyKeyList_cache', historyKeyList)
    console.log('dddddd', searchKey);

    if (!searchKey) {
      this.setData({
        focus: true,
        hotKeyShow: true,
        historyKeyShow: true,
      });
      return;
    };

    this.setData({
      hotKeyShow: false,
      historyKeyShow: false,
    })

    this.data.shopList.length = 0;
    this.searchProductData();

  },
  
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
      page: 1
    });
    if (!value && this.data.shopList.length == 0) {
      this.setData({
        hotKeyShow: true,
        historyKeyShow: true,
      });
    }
  },
  searchProductData: function () {
    var that = this;
    console.log('66666666666', that.data.cataid)
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        keyword: that.data.searchValue ? that.data.searchValue : '',
        sort: 1,
        page: that.data.page,
        cataid: that.data.cataid ? that.data.cataid : ''
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.product_list;
        if (data == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          that.setData({
            is_more: false,
          })
          return false;
        }
        that.setData({
          shopList: that.data.shopList.concat(data),
          page: that.data.page + 1,
          is_more: true,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },






  //详情页跳转
  lookdetail: function (e) {
    console.log(e)
    var lookid = e.currentTarget.dataset.procuctid;
    console.log(lookid);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
    })
  },
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    app.getColor();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }

})
