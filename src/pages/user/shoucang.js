var app = getApp();
var userInfo = app.get_user_info();
// pages/user/shoucang.js
Page({
  data:{
    page:1,
    favoriteList:[],
  },
  onLoad:function(options){
    if ((!userInfo) || (!userInfo.userid)) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    };
    this.loadProductData();
  },
  onShow:function(){
    // 页面显示
    this.loadProductData();
    app.getColor();
  },
  removeFavorites:function(e){
    var that = this;
    var favid = e.currentTarget.dataset.favid;
    var fav_Id = [];
     fav_Id.push(favid);
    console.log(fav_Id);
    var favId = encodeURIComponent(JSON.stringify(fav_Id));
    console.log(favId);
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {

        res.confirm && wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=del_collect_product', 
          method:'post',
          data: {
            favoriteid: favId,
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
                title: res.data.msg,
                duration: 2000
              });
              that.loadProductData();
            }
          },
        });

      }
    });
  },
  loadProductData:function(){
    var that = this;
      var userInfo = app.get_user_info();
      if(userInfo) {
        wx.request({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=collection_products',
          method: 'post',
          data: {
            sellerid: app.get_sellerid(),
            checkstr: userInfo.checkstr,
            userid: userInfo.userid
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data        
            var code = res.data.code;
            if (code == 1) {
              var favoriteList = res.data.data;
              that.setData({
                favoriteList: favoriteList
              });
            } else if(code==0){
              that.setData({
                favoriteList: '',
              });
            }
          },
          error: function (e) {
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      }
  },
  initProductData: function (data){
    for(var i=0; i<data.length; i++){
      //console.log(data[i]);
      var item = data[i];

      item.Price = item.Price/100;
      item.ImgUrl = app.d.hostImg + item.ImgUrl;

    }
  },
});