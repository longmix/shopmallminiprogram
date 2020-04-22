// import ApiList from  '../../config/api';
// import request from '../../utils/request.js';
// 响应服务器端的商品超级分类这个功能模块的。
var util = require('../../utils/util.js');
//获取应用实例  
var app = getApp();
var userInfo = app.get_user_info();
Page({
    data: {
        // types: null,
        typeTree: {}, // 数据缓存
        currType: 0 ,
        // 当前类型
        "types": [
        ],
        typeTree: [],
        hide_good_box: true,
    },
    onShow: function () {
      userInfo = app.get_user_info();

    },
    onLoad: function (option){

      app.set_option_list_str(that, this.call_back_set_option);

      app.set_option_list_str(null, app.getColor());

      var that = this;
      var option_list_str = wx.getStorageSync("option_list_str");

      console.log("获取商城选项数据：" + option_list_str + '333333333');

      if (!option_list_str) {
        return null;
      }

      var option_list = JSON.parse(option_list_str);

      if (!option_list) {
        return;
      }

      if (option_list.wxa_product_super_list_style) {
        that.setData({
          wxa_product_super_list_style: option_list.wxa_product_super_list_style
        })
      }


      this.busPos = {};
      this.busPos['x'] = 234.375;//购物车的位置
      this.busPos['y'] = app.globalData.hh - 32;
    },    
 

  call_back_set_option:function(that, cb_params){
    var that = this;
    var option_list = cb_params;
    console.log('option_list===', option_list)
    if (!option_list){
      return;
    }
    if (option_list.wxa_order_super_cata_parentid){
      that.setData({
        wxa_order_super_cata_parentid: option_list.wxa_order_super_cata_parentid
      })
    }


    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_cata_tree_chart',
      method: 'post',
      data: {        
        sellerid: app.get_sellerid(),
        cataid: that.data.wxa_order_super_cata_parentid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data;
        if(data.code == 1){
          var list = res.data.data;
          that.setData({
            types: data.data.sub_cata_list,
            typeTree: data.data.sub_cata_list[0].product_list,
            currType: 0
          });
        }
        
        console.log('lllllllllll', res)

      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

    });


  },


    tapType: function (e){
        var that = this;
        var currType = e.currentTarget.dataset.idx;
        console.log(currType);
        that.setData({
            currType: currType,
          typeTree: that.data.types[currType].product_list ? that.data.types[currType].product_list : [],
        });
        
    },
    // 加载品牌、二级类目数据
    getTypeTree (currType) {
        const me = this, _data = me.data;
        if(!_data.typeTree[currType]){
            request({
                url: ApiList.goodsTypeTree,
                data: {typeId: +currType},
                success: function (res) {
                    _data.typeTree[currType] = res.data.data;
                    me.setData({
                        typeTree: _data.typeTree
                    });
                }
            });
        }
    },


  addCart: function (e) {
    var that = this;

    if (!userInfo){
      var last_url = '/pages/category/index2';
      app.goto_user_login(last_url, 'switchTab');
      return;
    }

    var productid = e.currentTarget.dataset.productid;

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopApp&a=cart_add',
      method: 'post',

      data: {
        amount: 1,
        checkstr: userInfo.checkstr,
        productid: productid,
        sellerid: app.get_sellerid(),
        userid: userInfo.userid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '添加成功',
        });
        
        wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=cart_list',
          method: 'post',
          data: {
            userid: userInfo.userid,
            checkstr: userInfo.checkstr,
            page: 1,
            sellerid: app.get_sellerid()
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var carts = res.data.data;
            var total_amount = 0;
            if (res.data.code == 1) {           
              for (var i = 0; i < carts.length; i++) {               
                total_amount += carts[i].amount
              }
              wx.setTabBarBadge({
              index: 2,
              text: total_amount.toString()
            })

            } else if (res.data.code == 2) {
             
            }

            //endInitData
          },
        });

        that.touchOnGoods(that, e);
      },
      fail: function (e) {
        wx.showToast({
          title: '添加失败',
        });
      },
    });
  },

  //调用的方法
  touchOnGoods: function (that, e) {
    if (!this.data.hide_good_box) return;
    that.finger = {}; var topPoint = {};
    that.finger['x'] = e.touches["0"].clientX;//点击的位置
    that.finger['y'] = e.touches["0"].clientY;

    if (that.finger['y'] < that.busPos['y']) {
      topPoint['y'] = that.finger['y'] - 150;
    } else {
      topPoint['y'] = that.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(that.finger['x'] - that.busPos['x']) / 2;

    if (that.finger['x'] > that.busPos['x']) {
      topPoint['x'] = (that.finger['x'] - that.busPos['x']) / 2 + that.busPos['x'];
    } else {//
      topPoint['x'] = (that.busPos['x'] - that.finger['x']) / 2 + that.finger['x'];
    }
    that.linePos = util.bezier([that.busPos, topPoint, that.finger], 20);
    console.log('bezier_points', that.linePos)
    that.startAnimation(that, e);
  },

  startAnimation: function (that, e) {
    var index = 0,
      bezier_points = that.linePos['bezier_points'];
    that.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    var i = index - 1;
    that.timer = setInterval(function () {

      if (i > -1) {
        that.setData({
          bus_x: bezier_points[i]['x'],
          bus_y: bezier_points[i]['y']
        })
        i--;
      }

      if (i < 1) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true
        })
      }
    }, 15);
  },




  onPullDownRefresh: function () {
    console.log('下拉刷新==============')
    
    this.onShow();
    this.onLoad();
    // app.set_option_list_str(this, this.getShopOptionAndRefresh);
    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();
  },

  
})