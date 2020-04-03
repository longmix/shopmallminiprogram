var app = getApp();
var userInfo = app.get_user_info();
// pages/order/downline.js
Page({
  data:{
    orderId:0,
    reason:'',
    remark:'',
    imgUrl:'',
  },
  onLoad:function(options){
    this.setData({
      orderId: options.orderId,
    });
    userInfo = app.get_user_info();
  },
  submitReturnData:function(){
    //console.log(this.data);
    //数据验证
    if(!this.data.remark){
      wx.showToast({
        title: '请填写退款原因',
        icon: 'success',
        duration: 2000
      });
      return;
    }
    // if(!this.data.remark){
    //   wx.showToast({
    //     title: '请填写退货描述',
    //     icon: 'success',
    //     duration: 2000
    //   });
    //   return;
    // }
    var that = this;

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=order_tuikuan',
      method: 'post',
      data: {
        orderid: that.data.orderId,
        sellerid: app.get_sellerid(),
        checkstr: userInfo.checkstr,
        userid: userInfo.userid,
        sale_memo: that.data.remark
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var code = res.data.code;
        if (code == 1) {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          });
          // wx.navigateBack({
          //   delta
          // })
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });


    
    // wx.request({
    //   url: app.d.ceshiUrl + '/Api/Order/orders_edit',
    //   method:'post',
    //   data: {
    //     id: that.data.orderId,
    //     type:'refund',
    //     back_remark:that.data.remark,
    //     //imgUrl:that.data.imgUrl,
    //   },
    //   header: {
    //     'Content-Type':  'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     //--init data        
    //     var status = res.data.status;
    //     if(status == 1){
    //       wx.showToast({
    //         title: '您的申请已提交审核！',
    //         duration: 2000
    //       });
    //       // wx.navigateTo({
    //       //   url: '/pages/user/dingdan?currentTab=4',
    //       // });
    //     }else{
    //       wx.showToast({
    //         title: res.data.err,
    //         duration: 2000
    //       });
    //     }
    //   },
    // });

  },
  reasonInput:function(e){
    this.setData({
      reason: e.detail.value,
    });
  },
  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    });
  },

  onUnload:function(){
    
  },
  uploadImgs:function(){

    wx.chooseImage({
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            'user': 'test'
          },
          success: function(res){
            var data = res.data
            //do something
          }
        })
      }
    });
  },
})