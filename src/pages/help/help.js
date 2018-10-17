
var app = getApp();

Page({
  data: {
    sellerid:'',
    articlelist: [],
    loading: true,
  },
  onShow: function () {
    app.getColor();
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {

    var that = this

    that.data.sellerid = options.sellerid;

    if (typeof (that.data.sellerid) == 'undefined') {
      that.data.sellerid = app.globalData.sellerid;
    }

    this.initArticleList(that.data.sellerid);

  },
  initArticleList: function () {

     var that = this
     

     //=====更新商户头条=================
      var url = app.globalData.http_weiduke_server + '?g=Home&m=Yanyubao&a=yingxiao';//+ app.globalData.sellerid;
      var data = {
        id:'seller',
        action:'list',
        sellerid: that.data.sellerid,
        currentpage:1
      };
      
      var cbError = function (res) {

      };
      app.httpPost(url, data, this.articleBack, cbError);
      //========End====================

  },
  articleBack: function (res) {
    console.log(res);

    let _this = this
    if (res.data.code == '1') {
      //为显示加载动画添加3秒延时
      setTimeout(function () {
        _this.setData({
          articlelist: res.data.data,
          loading: !_this.data.loading,
        })
      }, 500)
    }
    else{
      //没有获取数据
    
    }
  },
  showDetail:function(e){
    var that = this;
    console.log('点击商户头条进入该详情'+e.currentTarget.dataset.id);

    var id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../help_detail/help_detail?id=' + id + '&sellerid=' + that.data.sellerid
      
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },
  // 生命周期函数--监听页面显示
  // 生命周期函数--监听页面隐藏
  onHide: function () {

  },
  // 生命周期函数--监听页面卸载
  onUnload: function () {

  },

})