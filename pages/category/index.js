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
      this.onLoad();
      app.getColor();
    },
    onLoad: function (option){
        var that = this;
        wx.request({
            url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_cata_level2',
            method:'post',
            data: {
             // 'cataid': 'fXiNUPaWV',
              sellerid: app.get_sellerid()
            },
            header: {
                'Content-Type':  'application/x-www-form-urlencoded'
            },
            success: function (res) {
                //--init data 
                var code = res.data.code;
                if(code==1) { 
                    var list = res.data.data;
                    that.setData({
                        types:list,
                        typeTree: list[0].sub_cata,
                        currType: list[0].cataid
                    });
                } else {
                    wx.showToast({
                        title:res.data.err,
                        duration:2000,
                    });
                }    
      console.log(list)

            },
            error:function(e){
                wx.showToast({
                    title:'网络异常！',
                    duration:2000,
                });
            },

        });
    },    
 


    tapType: function (e){
        var that = this;
        var currType = e.currentTarget.dataset.cataid;
        console.log(currType);
        that.setData({
            currType: currType
        });
        wx.request({
            url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_cata_supplier',
            method:'post',
            data: {
              sellerid: app.get_sellerid(),
              cataid:currType
              },
            header: {
                'Content-Type':  'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var code = res.data.code;
                console.log(res.data);
                if(code==1) { 
                    var cataList = res.data.data;
                    console.log(res.data);
                    that.setData({
                        typeTree:cataList,
                    });
                } else {
                    wx.showToast({
                        title:res.data.err,
                        duration:2000,
                    });
                }
            },
            error:function(e){
                wx.showToast({
                    title:'网络异常！',
                    duration:2000,
                });
            }
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
    }
})