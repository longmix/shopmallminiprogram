var app = getApp()
Page({
  data: {
    current: 0,
    shopList: [],
    ptype:'',
    title:'延誉',
    page:2,
    catId:0,
    brandId: 0
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
getMore:function(e){
  var that = this;
  var page = that.data.page;
  wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: {
        page: page,
        cataid:that.data.cataid,
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var prolist = res.data.product_list;
        if(prolist==''){
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page+1,
          shopList:that.data.shopList.concat(prolist)
        });
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      } 
    })
},
onLoad: function (options) {
  var objectId = options.title;
  //更改头部标题
  wx.setNavigationBarTitle({
      title: objectId,
      success: function() {
      },
    });

    //页面初始化 options为页面跳转所带来的参数
    var cataid = options.cataid;
    var that = this;
    that.setData({
      cataid: cataid,
    })
    //ajax请求数据
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: {
        sellerid: app.get_sellerid(),
        cataid:cataid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shoplist = res.data.product_list;
        that.setData({
          shopList: shoplist
        })
      },
      error: function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })

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
