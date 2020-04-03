// import ApiList from  '../../config/api';
// import request from '../../utils/request.js';
//获取应用实例  
var app = getApp();
Page({
    data: {
        // types: null,
        typeTree: {}, // 数据缓存
        currType: 0 ,
        // 当前类型
        "types": [
        ],
        typeTree: [],
    },
    onShow: function () {
     

    },
    onLoad: function (option){

      app.set_option_list_str(that, this.call_back_set_option);

      app.set_option_list_str(null, app.getColor());



        var that = this;
      //   wx.request({
      //       url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_cata_level2',
      //       method:'post',
      //       data: {
      //        // 'cataid': 'fXiNUPaWV',
      //         sellerid: app.get_sellerid()
      //       },
      //       header: {
      //           'Content-Type':  'application/x-www-form-urlencoded'
      //       },
      //       success: function (res) {
      //           //--init data 
      //           var code = res.data.code;
      //           if(code==1) { 
      //               var list = res.data.data;
      //               that.setData({
      //                   types:list,
      //                   typeTree: list[0].sub_cata,
      //                   currType: list[0].cataid
      //               });
      //           } else {
      //               wx.showToast({
      //                   title:res.data.err,
      //                   duration:2000,
      //               });
      //           }    
      // console.log(list)

      //       },
      //       error:function(e){
      //           wx.showToast({
      //               title:'网络异常！',
      //               duration:2000,
      //           });
      //       },

      //   });
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
  onPullDownRefresh: function () {
    console.log('下拉刷新==============')
    
    this.onShow();
    this.onLoad();
    // app.set_option_list_str(this, this.getShopOptionAndRefresh);
    //停止当前页面的下拉刷新
    wx.stopPullDownRefresh();
  },
})