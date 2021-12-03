
var app = getApp();

Page({
  data: {
    sellerid:'',
    articlelist: [],
    loading: true,
  },
  onShow: function () {

  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {

    app.set_option_list_str(this, function(that002, option_list){
      app.getColor();

      that002.initArticleList(that002, option_list);

    });

    var that = this

    that.data.sellerid = options.sellerid;

    if (typeof (that.data.sellerid) == 'undefined') {
      that.data.sellerid = app.globalData.sellerid;
    }

    wx.setNavigationBarTitle({
      title: app.globalData.shop_name
    })

  },
  initArticleList: function (that003, option_list) {
    console.log('initArticleList option_list====>>>', option_list);

    if(!option_list || !option_list.weiduke_token_to_toutiao || !option_list.weiduke_classid_to_toutiao){
      console.log('缺少 weiduke_token_to_toutiao 或 weiduke_classid_to_toutiao');
      return;
    }

    console.log('initArticleList option_list====>>>', option_list);


    var post_data = {
      token: option_list.weiduke_token_to_toutiao,
      sellerid: that003.data.sellerid,
      action: 'newlist',
      page:1,
      page_size:50,
    };
    
    post_data['cataid'] = option_list.weiduke_classid_to_toutiao;

     //=====更新商户头条=================
    var url = app.globalData.http_weiduke_server + 'openapi/ArticleImgApi/article_list';//+ app.globalData.sellerid;
    
    var cbError = function (res) {

    };
    app.httpPost(url, post_data, that003.articleBack, cbError);
    //========End====================

  },
  articleBack: function (res) {
    console.log('articleBack======>>>>', res);

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
    wx.setStorageSync('browser_cache_id', id);

    if(e.currentTarget.dataset.url && (e.currentTarget.dataset.url.length > 0)){
      //可以跳转到http网址或者其他小程序内部链接
      app.call_h5browser_or_other_goto_url(e.currentTarget.dataset.url);
      
      return;
    }
    
    wx.navigateTo({
      url: '../help/detail?id=' + id + '&sellerid=' + that.data.sellerid
      
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