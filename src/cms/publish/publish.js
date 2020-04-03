// cms/publish/publish.js
var app = getApp();
var userInfo = app.get_user_info();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cataIndex: 0,
    imgList: [],
    flag: 1,
    checked:true,
<<<<<<< HEAD
    disable:false,
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.publishtype){
      this.setData({
        publishtype: options.publishtype
      })
    }

<<<<<<< HEAD
    app.set_option_list_str(null, app.getColor());

=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    var that = this;
    
    userInfo = app.get_user_info();
    
    // wx.request({
    //   url: app.globalData.http_server + 'index.php/openapi/VideoListRemarkData/get_cata_month_list',
    //   method: 'post',
    //   data: {
    //     sellerid: app.get_sellerid(),

    //   },
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     var data = res.data.data;
    //     var cataArr = [];


    //     cataArr.push('请选择 > ');


    //     for (var i = 0; i < data.cata.length; i++) {
    //       cataArr.push(data.cata[i]);
    //     }


    //     that.setData({
    //       cataArr: cataArr,
    //     })

    //   },
    //   fail: function (e) {
    //     wx.showToast({
    //       title: '网络异常！',
    //       duration: 2000
    //     });
    //   },
    // })
    console.log('userInfo---------2', userInfo)
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000,
        success: function () {

          wx.setStorageSync('last_url', '/cms/publish/publish?publishtype=' + that.data.publishtype);

          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      })

      return;
    }

    var is_get_userinfo = userInfo.is_get_userinfo;

   
    if (!is_get_userinfo) {

      wx.setStorageSync('last_url', '/cms/publish/publish?publishtype=' + that.data.publishtype);

      wx.navigateTo({
        url: '/pages/login/login_get_userinfo',
      });

      return;
    }




    app.getFaquanSetting(that, this.callback_xieyi_content);



  },


  callback_xieyi_content: function (that, cms_faquan_setting) {

    console.log('cms_faquan_setting==', cms_faquan_setting)
    if (!cms_faquan_setting) {
      return;
    }


    if (cms_faquan_setting.faquan_xieyi_status){
      that.setData({
        faquan_xieyi_status: cms_faquan_setting.faquan_xieyi_status
      })
      return;
    }

    if (cms_faquan_setting.faquan_xieyi_title) {
      that.setData({
        faquan_xieyi_title: cms_faquan_setting.faquan_xieyi_title
      })
    }


    if (cms_faquan_setting.faquan_xieyi_content) {
      that.setData({
        faquan_xieyi_content: cms_faquan_setting.faquan_xieyi_content
      })
    }


  },



  // 分类改变函数
  bindPickerChangeCata: function (e) {
    console.log('cata===', e);
    var value = e.detail.value
    this.setData({
      cataValue: value == 0 ? '' : this.data.cataArr[value],
      cataIndex: value
    })

  },

  inputContent: function (e) {
    console.log('ee',e)
    var ideaText = e.detail.value;
    this.setData({
      ideaText: ideaText
    })

    console.log('ideaText==', ideaText)
  },

  chooseImg:function(e){
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        console.log('chooseImage===============',res)

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imgList = res.tempFilePaths;

        that.setData({
          imgList: imgList
        })

      }
    })

  },

  chooseVideo:function(e){
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: 'true',
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log('chooseVideo===============',res)

        var video = res.tempFilePath;

        that.setData({
          video: video
        })

      }
    })
  },





  publishIdea:function(e){
    var that = this;


    // if (!that.data.cataValue) {
    //   wx.showToast({
    //     title: '没有选择分类',
    //     icon: 'none'
    //   })
    //   return;
    // }


    if (that.data.imgList.length == 0 && that.data.publishtype == "image") {
      wx.showToast({
        title: '没有添加图片',
        icon: 'none'
      })
      return;
    }

    if (!that.data.video && that.data.publishtype == "video") {
      wx.showToast({
        title: '没有添加视频',
        icon: 'none'
      })
      return;
    }
    
    if ((that.data.faquan_xieyi_status == 1) && !that.data.checked) {
      wx.showToast({
        title: '请先同意发布许可协议',
        icon: 'none'
      })
      return;
    }

<<<<<<< HEAD
  that.setData({
    disable: true,
  })

    var last_url = wx.getStorageSync('last_url');
    var page_type = wx.getStorageSync('page_type');
=======

>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/add_faquan_text',
          method: 'post',
          data: {
            sellerid: app.get_sellerid(),
            appid: app.globalData.xiaochengxu_appid,
            userid: userInfo ? userInfo.userid : '',
            text: that.data.ideaText,
            // cata: that.data.cataValue,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            if(res.data.code == 1){
              var faquanid = res.data.faquanid
              that.setData({
                faquanid: faquanid
              })


          if (that.data.publishtype == "image"){
          
          that.upLoadImg(0);
<<<<<<< HEAD
         
=======
          
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
        }else{
            wx.showLoading({
              title: '正在上传',
            })

          wx.uploadFile({
            //url: 'http://192.168.0.205:81/index/upload/uploadImg',      //此处换上你的接口地址
            url: app.globalData.http_server + 'index.php/openapi/FaquanData/add_faquan_video_or_img',
            filePath: that.data.video,
            header: {
              "Content-Type": "multipart/form-data",
              'elem': '#up-image',
              'accept': 'application/json',
            },
            name: "uploadvideo",
            formData: {
              sellerid: app.get_sellerid(),
              userid: userInfo ? userInfo.userid : '',
              faquanid: faquanid,
              type: 1
            },
            success: function (res) {
              wx.hideLoading();
              console.log('res===========',res)
              if (res.errMsg == "uploadFile:ok") {
                var data = res.data;
                data = JSON.parse(data);
                  if(data.code == 1){
                    wx.showToast({
                      title: '上传成功',
                      success: function (e) {
                        console.log('e=======', e)
                        that.setData({
                          ideaText: '',
                        })
<<<<<<< HEAD
                        if(last_url){
                          wx.switchTab({
                            url: last_url,
                          })
                        } else {
                          wx.switchTab({
                            url: '/pages/user/user2',
                          })
                        }
                        wx.removeStorageSync('last_url');
                        wx.removeStorageSync('page_type');
                        
=======
                        wx.switchTab({
                          url: '/pages/user/user2',
                        })
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '上传失败',
                    })
<<<<<<< HEAD
                    that.setData({
                      disable: true,
                    })
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

                  }        
              } 
            },
            fail: function (res) {
<<<<<<< HEAD
              that.setData({
                disable: true,
              })
=======
              console.log('fail');
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

            },
          })

        }


        }else{
          wx.showToast({
            title: '提交失败，请重新发布',
            icon:'none'
          })
        }
        

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  
  },

upLoadImg:function(i){
  console.log('i=======',i)
<<<<<<< HEAD
  var last_url = wx.getStorageSync('last_url');
  var page_type = wx.getStorageSync('page_type');
 
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
  var that = this;
  wx.showLoading({
    title: '正在上传第' + (i+1) + '张',
  })
  wx.uploadFile({
    //url: 'http://192.168.0.205:81/index/upload/uploadImg',      //此处换上你的接口地址
    url: app.globalData.http_server + 'index.php/openapi/FaquanData/add_faquan_video_or_img',
    filePath: that.data.imgList[i],
    header: {
      "Content-Type": "multipart/form-data",
      'elem': '#up-image',
      'accept': 'application/json',
      'exts': 'jpg|jpeg|png|gif'
    },
    name: "image",
    formData: {
      sellerid: app.get_sellerid(),
      userid: userInfo ? userInfo.userid : '',
      faquanid: that.data.faquanid,
      type: 0
    },
    success: function (res) {
      i++;
      wx.hideLoading();
      console.log('res===========', res)
      if (i == that.data.imgList.length) {
        if (res.errMsg == "uploadFile:ok") {
          var data = res.data;
          console.log('data===', data)
          data = JSON.parse(data);
          if (data.code == 1) {
            wx.showToast({
              title: '上传成功',
              success: function (e) {
                console.log('e=======', e)
                that.setData({
                  ideaText: '',
                })
<<<<<<< HEAD
                if (last_url) {
                  wx.switchTab({
                    url: last_url,
                  })
                } else {
                  wx.switchTab({
                    url: '/pages/user/user2',
                  })
                }
                wx.removeStorageSync('last_url');
                wx.removeStorageSync('page_type');
=======
                wx.switchTab({
                  url: '/pages/user/user2',
                })
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
              }
            })
          } else {
            wx.showToast({
              title: '上传失败',
            })
<<<<<<< HEAD
            that.setData({
              disable: true,
            })
=======
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e

          }
        }
      } else if (i < that.data.imgList.length){
        that.upLoadImg(i);
      }
    },
    fail: function (res) {
      console.log('fail');
    },
  })
},



  readAgreement:function(e){
    this.setData({
      flag: 0,
    })
  },

  checkBox:function(e){
    this.setData({
      checked: e.detail.value[0] ? true : false
    })
  },

  selectAgree:function(e){
    this.setData({
      flag: 1,
      checked: true,
    })
  },


  
  



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
<<<<<<< HEAD
=======

    app.getColor();
>>>>>>> c45e7d5c1ec541e1dbc618c53cdc08a06400366e
    
    userInfo = app.get_user_info();
    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})