// pages/nickname/nickname_edit.js
var app = getApp();

Page({
  data:{
      nickname:"",
      name:''
  },
  onLoad:function(options){
    
    app.set_option_list_str(null, app.getColor());

    var that = this

    app.check_user_login();
    
    // 页面初始化 options为页面跳转所带来的参数
    wx.getStorage({
      key: 'userListInfo',
      success: function (res) {
        console.log(res.data);
         that.setData({
           nickname: res.data.fenxiao_info.nickname,
 
          });
      }
    })
  },
  nameInput: function(e) {
      //console.log('昵称是='+e.detail.value);
      var that = this;
    if (e.detail.value == that.data.nickname){
      that.data.name = e.detail.value;
      }else{
      that.data.nickname = e.detail.value;
      }
  },
  keep_button:function(){
    var that = this;
    console.log('that.data.nickname', that.data.nickname);
    console.log('that.data.name', that.data.name);
    if(that.data.name==that.data.nickname){
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      });
      // wx.redirectTo({
      //   url: '../userinfo/userinfo'
      // })
      return;
    }
    
  console.log(1111555555);


    var userInfo = app.get_user_info();


    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=user_info_save',
      header: {  
                "Content-Type": "application/x-www-form-urlencoded"  
              }, 
      method: "POST",  
      data: {
         nickname:that.data.nickname,
         checkstr:userInfo.checkstr,
         userid:userInfo.userid,
         sellerid: app.get_sellerid()
      },    
      success:function(res){
        console.log('success',res);
        if(res.data.code == 1){
          wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
          })
          wx.redirectTo({
            url: '../userinfo/userinfo'
          
          })
          return;
        }
        else{
          wx.showToast({
              title: res.data.msg,
              icon: 'fail',
              duration: 2000
          })
        }
      
      },
      fail:function(res){
        console.log('failfail',res)
      }

    });

  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow: function () {

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})