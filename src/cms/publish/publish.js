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
    disable:false,
    selectTabArr:[]
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

    app.set_option_list_str(null, app.getColor());

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

    app.set_option_list_str(this, this.callback_set_option);

  },


  callback_xieyi_content: function (that, cms_faquan_setting) {

    console.log('cms_faquan_setting==', cms_faquan_setting)
    if (!cms_faquan_setting) {
      return;
    }


    if (cms_faquan_setting.faquan_page_title){
      wx.setNavigationBarTitle({
        title: cms_faquan_setting.faquan_page_title
      })
      that.setData({
        faquan_page_title: cms_faquan_setting.faquan_page_title
      })
    }


    if (cms_faquan_setting.faquan_tag_status) {
      that.setData({
        faquan_tag_status: cms_faquan_setting.faquan_tag_status
      })
    }

    if (cms_faquan_setting.faquan_zidingyi_tag_status) {
      that.setData({
        faquan_zidingyi_tag_status: cms_faquan_setting.faquan_tag_status
      })
    }


    if (cms_faquan_setting.faquan_hot_tag_words) {
      that.setData({
        faquan_hot_tag_words: cms_faquan_setting.faquan_hot_tag_words
      })
    }
    

    if (cms_faquan_setting.faquan_tag_color) {
      that.setData({
        faquan_tag_color: cms_faquan_setting.faquan_tag_color
      })
    }

    if (cms_faquan_setting.faquan_tag_all_num) {
      that.setData({
        faquan_tag_all_num: cms_faquan_setting.faquan_tag_all_num
      })
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

  callback_set_option: function (that, cb_params) {
    console.log('getShopOptionAndRefresh+++++:::' + cb_params)

    //从本地读取
    var option_list_str = wx.getStorageSync("option_list_str");
    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    console.log('option_list===', option_list)

    if (!option_list) {
      return;
    }


    if (option_list.wxa_shop_nav_bg_color) {
      that.setData({
        wxa_shop_nav_bg_color: option_list.wxa_shop_nav_bg_color
      });
    }

    if (option_list.wxa_shop_nav_font_color) {
      that.setData({
        wxa_shop_nav_font_color: option_list.wxa_shop_nav_font_color
      });
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


    var selectTabArr = that.data.selectTabArr
    var selectTabArr_length = selectTabArr.length;


    if (that.data.tab_content) {
      ++selectTabArr_length;
    }

    if (selectTabArr_length > that.data.faquan_tag_all_num){
      wx.showModal({
        title: '提示',
        content: '标签最多为' + that.data.faquan_tag_all_num + '个',
        showCancel: false
      })
      return;
    }


    for (var i = 0; i < selectTabArr.length; i++) {
      if (selectTabArr[i] == that.data.tab_content) {
        wx.showModal({
          title: '提示',
          content: '标签重复',
          showCancel: false
        })
        return;
      }
    }

    var selectTabStr = selectTabArr.join(',')

    if(that.data.tab_content){
      selectTabStr += ',' + that.data.tab_content;
    }

    
    

  that.setData({
    disable: true,
  })

    var last_url = wx.getStorageSync('last_url');
    var page_type = wx.getStorageSync('page_type');

    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/FaquanData/add_faquan_text',
          method: 'post',
          data: {
            sellerid: app.get_sellerid(),
            appid: app.globalData.xiaochengxu_appid,
            userid: userInfo ? userInfo.userid : '',
            text: that.data.ideaText,
            tag: selectTabStr,
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
                        
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '上传失败',
                    })
                    that.setData({
                      disable: true,
                    })

                  }        
              } 
            },
            fail: function (res) {
              that.setData({
                disable: true,
              })

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
  var last_url = wx.getStorageSync('last_url');
  var page_type = wx.getStorageSync('page_type');
 
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
              }
            })
          } else {
            wx.showToast({
              title: '上传失败',
            })
            that.setData({
              disable: true,
            })

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



  //选择标签
  selectTab: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;

    var faquan_hot_tag_words = that.data.faquan_hot_tag_words

    faquan_hot_tag_words[index]['select'] = !faquan_hot_tag_words[index]['select'];

    console.log('faquan_hot_tag_words', faquan_hot_tag_words)

    var selectTabArr = that.data.selectTabArr;

    if (faquan_hot_tag_words[index]['select']) {
      selectTabArr.push(faquan_hot_tag_words[index].name)
    } else {

      for (var i = 0; i < selectTabArr.length; i++) {
        if (selectTabArr[i] == faquan_hot_tag_words[index].name) {
          selectTabArr.splice(i, 1);
          break;
        }
      }
    }

    console.log('selectTabArr', selectTabArr)

    that.setData({
      faquan_hot_tag_words: faquan_hot_tag_words,
      selectTabArr: selectTabArr,
    })
  },



  addTab:function(e){

    var tab_content = e.detail.value;
    this.setData({
      tab_content: tab_content
    })

    console.log('tab_content', tab_content)
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