var app = getApp();
var userInfo = app.get_user_info();
Page({
  	data: {
  		userInfo: {}, 
      userListInfo:[
        { text:  '昵称' },
        { text:  '账号' },
        { text:  '手机' },   
        { text: '生日'}, 
      ],
      userListInfo2: [
        { text: '性别' },
        { text: '地区' },
        { text: '个性签名' },
      ],
      headimgurl: "", // 头像图片路径  
  	},

    logout: function () {
      app.del_user_info();
      
      var sellerid = app.get_sellerid();
      if(typeof(sellerid) != 'undefined'){
        if(sellerid.length > 15){
        wx.clearStorageSync();
        console.log('清空完成，sellerid：'+app.get_sellerid());
        }
     }


      if (app.globalData.is_ziliaoku_app == 1) {
        wx.reLaunch({
          url: "/cms/index/index"
        });
        return;
      }

      if (app.globalData.is_o2o_app == 1) {

        wx.reLaunch({
          url: "/o2o/index/index"
        });
        return;
      } 


      wx.clearStorageSync();
      wx.switchTab({
        url: '../index/index'
      });
     
    },
    onShow: function () {

    },
  	onLoad: function(){
      app.set_option_list_str(null, app.getColor());
      
      var that = this
      var userInfo = app.get_user_info();
      if ((!userInfo) || (!userInfo.userid)) {
        wx.redirectTo({
          url: '../login/login',
        })
        return;
      }
      console.log(app.globalData.http_server+'0100000')
/*

          wx.getStorage({
            key: 'key2',
            success: function (res) {
              that.setData({
                userImg: res.data
              })
                  }
              })
*/
      wx.request({
        url: app.globalData.http_server +'?g=Yanyubao&m=ShopAppWxa&a=get_user_info',
        data: {
           sellerid: app.get_sellerid(),
           checkstr:userInfo.checkstr,
           userid:userInfo.userid
        },
        header: {  
                "Content-Type": "application/x-www-form-urlencoded"  
              }, 
        method: "POST",
        success: function(res) {
          if(res.data.code == -1){
            wx.redirectTo({
              url: '../login/login',
            })
            
            return;
          }
          var headimgurl = res.data.data.headimgurl
          //var img_url = JSON.stringify(headimgurl);
          console.log(headimgurl);
         // console.log(img_url);
          that.setData({
            userListInfo:res.data.data,
            headimgurl: res.data.data.headimgurl
          });
          wx.setStorage({
            key: "userListInfo",
            data: res.data.data
          })
        }
      }) 
  	},
    /*
    imgYu: function (event) {
      var src = event.currentTarget.dataset.src;//获取data-src
      var imgList = ["http://yanyubao.tseo.cn/uploads/qrcode_card_wxa/wxa_qrcode_pmyxQxkkU.png"]//获取data-list
      console.log(imgList);
      //图片预览

      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList// 需要预览的图片http链接列表
      })
    },
    */
    // 点击头像 显示底部菜单 
   
    clickImage: function () {
      var that = this;
      var userInfo = app.get_user_info();
      // var childId = wx.getStorageSync("child_id");
      // var token = wx.getStorageSync('token');
      wx.chooseImage({
        count: 1, // 最多可以选择的图片张数，默认9
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          console.log(res);
          console.log(res.tempFilePaths + "修改页面")
          var headimgurl = res.tempFilePaths;
          wx.uploadFile({
            url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=upload_image_file', 
            filePath: headimgurl[0],
            name: 'file',
            formData:{
              sellerid: app.get_sellerid(),
              checkstr: userInfo.checkstr,
              userid: userInfo.userid,
            },
            success: function (res) {
              var obj = JSON.parse(res.data);
              console.log(obj);
              that.setData({
                headimgurl: obj.img_url,
              })
              wx.request({
                url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=set_image_headimgurl', 
                data: {
                  sellerid: app.get_sellerid(),
                  checkstr: userInfo.checkstr,
                  userid: userInfo.userid,
                  img_url: that.data.headimgurl
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                success: function (res) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000
                  });
                }
              });

            }
          });

    } 
      })
    }
    
})