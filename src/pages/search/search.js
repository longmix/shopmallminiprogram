var app = getApp();
// pages/search/search.js
Page({
  data:{
    focus:true,
    hotKeyShow:true,
    historyKeyShow:true,
    searchValue:'',
    page:1,
    productData:[],
    historyKeyList:[],
    hotKeyList:[]
  },
  onShow: function () {

  },
  onLoad:function(options){
    var that = this;
<<<<<<< HEAD

    app.set_option_list_str(null, app.getColor());
    
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    var historyKeyList = wx.getStorageSync('historyKeyList_cache');
    if (historyKeyList){
        that.setData({
          historyKeyList: historyKeyList,
      })
    }
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
        console.log('sssss',res)
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
  onReachBottom:function(){
      //下拉加载更多多...
      this.setData({
        page:(this.data.page+1)
      })
      
      this.searchProductData();
  },

//删除指定元素
  remove:function (e) {  
    var index = this.data.historyKeyList.indexOf(e);
    if (index > -1) {
      this.data.historyKeyList.splice(index, 1);
    }
  },


  doKeySearch:function(e){
    var key = e.currentTarget.dataset.key;

    var historyKeyList = this.data.historyKeyList;
    this.remove(key);
    historyKeyList.unshift(key);
    wx.setStorageSync('historyKeyList_cache', historyKeyList)
    
    this.setData({
      searchValue: key,
       hotKeyShow:false,
       historyKeyShow:false,
    });

    this.data.productData.length = 0;
    this.searchProductData();
  },
  doSearch:function(){
    var searchKey = this.data.searchValue;

    var historyKeyList = this.data.historyKeyList;
    this.remove(searchKey);
    historyKeyList.unshift(searchKey);
    wx.setStorageSync('historyKeyList_cache', historyKeyList)
    console.log('dddddd', searchKey);

    if (!searchKey) {
        this.setData({
            focus: true,
            hotKeyShow:true,
            historyKeyShow:true,
        });
        return;
    };

    this.setData({
      hotKeyShow:false,
      historyKeyShow:false,
    })
    
    this.data.productData.length = 0;
    this.searchProductData();

    this.getOrSetSearchHistory(searchKey);
  },
  getOrSetSearchHistory:function(key){
    var that = this;
    wx.getStorage({
      key: 'historyKeyList',
      success: function(res) {
          console.log(res.data);

          //console.log(res.data.indexOf(key))
          if(res.data.indexOf(key) >= 0){
            return;
          }

          res.data.push(key);
          wx.setStorage({
            key:"historyKeyList",
            data:res.data,
          });

          that.setData({
            historyKeyList:res.data
          });
      }
    });
  },
  searchValueInput:function(e){
    var value = e.detail.value;
    this.setData({
      searchValue:value,
    });
    if(!value && this.data.productData.length == 0){
      this.setData({
        hotKeyShow:true,
        historyKeyShow:true,
      });
    }
  },
  searchProductData:function(){
    var that = this;
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_list',
      method:'post',
      data: {
        sellerid: app.get_sellerid(), 
        keyword:that.data.searchValue, 
        sort: 1,
        page: that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        var data = res.data.product_list;
        that.setData({
          productData:that.data.productData.concat(data),
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

});