// cms/library/library.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'red',
    scrollTop: 100,
    productList: [],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })

    app.set_option_list_str(null, app.getColor());

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_cata_level2',
      method: 'post',
      data: {
        // 'cataid': 'fXiNUPaWV',
        sellerid: app.get_sellerid()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var code = res.data.code;
        if (code == 1) {
          var list = res.data.data;

          if(!list){
            return;
          }

          that.setData({
            types: list,
            typeTree: list[0].sub_cata,
            currType: list[0].cataid
          });

        //首次进入显示商品列表
          wx.request({
            url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
            method: 'post',
            data: {
              sellerid: app.get_sellerid(),
              keyword: that.data.searchValue ? that.data.searchValue : '',
              sort: 1,
              page: 1,
              cataid: that.data.typeTree[0].cataid ? that.data.typeTree[0].cataid : ''
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
                currentTab2: that.data.typeTree[0].cataid,
                productList: data,
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


        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
        console.log(list)

      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

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
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },

  // 点击一级分类
  swichNav: function (e) {
    console.log('一级分类',e)
    var that = this;
    var cataid = e.target.dataset.cataid;
    if (this.data.currentTab == cataid) { return false; }
    else {
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_cata_supplier',
        method: 'post',
        data: {
          sellerid: app.get_sellerid(),
          cataid: cataid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var code = res.data.code;
          console.log(res.data);
          if (code == 1) {
            var cataList = res.data.data;
            console.log(res.data);
            that.setData({
              typeTree: cataList,
              currentTab: cataid,
            });


            that.swichNav2('', cataList[0].cataid);


          } else {
            wx.showToast({
              title: res.data.err,
              duration: 2000,
            });
          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        }
      });
    }
  },

  // 点击二级分类
  swichNav2: function (e, cataid2='') {
    console.log('ee==', e, cataid2)
    var that = this;

    if (!cataid2){
      var cataid2 = e.target.dataset.cataid;
    }
    
    if (this.data.currentTab2 == cataid2) { return false; }
    else {
      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
        method: 'post',
        data: {
          sellerid: app.get_sellerid(),
          keyword: that.data.searchValue ? that.data.searchValue : '',
          sort: 1,
          page: 1,
          cataid: cataid2
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var data = res.data.product_list;
          if (data == '') {
            that.setData({
              currentTab2: cataid2,
              productList: data,
              is_more: false,
            })
            return false;
          }
          that.setData({
            currentTab2: cataid2,
            productList: data,
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
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },


//滑动到底部
  lower:function(e){
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method: 'post',
      data: {
        sellerid: app.get_sellerid(),
        // keyword: that.data.searchValue ? that.data.searchValue : '',
        sort: 1,
        page: that.data.page,
        // cataid: cataid2
        cataid: that.data.typeTree[0].cataid ? that.data.typeTree[0].cataid : ''
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
          productList: that.data.productList.concat(data),
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

  //跳转列表页
  toLibraryList:function(e){
    var productid = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/cms/library/library_list?productid=' + productid,
    })
  }


 
})