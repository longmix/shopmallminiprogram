// pages/scan-qrcode/scan-qrcode.js
var app = getApp();
var bmap = require('../../utils/bmap-wx.min.js');
var wxMarkerData = []; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],

    current_latitude: '',
    current_longitude: '',
    current_address:'',

    rgcData: {},
    owner_flag:0,  //订单管理者标记，0 不是订单所有者 1 订单所有者 2 订单所有者要发短信
    display: '',

    showModal: false,
    selfform_mazhu_url:'',

  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
     //this.getMap();
  
    var q = options.q;
    var orderno = null;

    //q = 'http%3A%2F%2Fjh.tseo.cn%2Findex.php%3Fg%3DHome%26m%3DScan%26a%3Dindex%26orderno%3D20190315104009EAPWAP';

    that.setData({
      q: q,
      is_send_mess: false
    })

   
    console.log(options);

    if (typeof (q) != 'undefined') {
      console.log('获取到带参二维码参数q：' + q);
      q = decodeURIComponent(q);
      console.log('decodeURI转码后的q：' + q);

      orderno = q.replace('http://jh.tseo.cn/index.php?g=Home&m=Scan&a=index&orderno=', '');
      if (orderno.length > 20) {
        orderno = orderno.replace('http%3A%2F%2Fjh.tseo.cn%2Findex.php%3Fg%3DHome%26m%3DScan%26a%3Dindex%26orderno%3D', '');
      }

      console.log('从q参数得到的 orderno：' + orderno);
      that.setData({
        orderno: orderno
      })

      that.__wx_login(that, orderno)
     

     
    }

  },


//获取订单详情
  __wx_login: function (that, orderno){
  

  var current_openid = app.get_current_openid();
  if(current_openid){
    that.__get_order_detail(that, orderno, current_openid, that.getMap);

    return;
  }

  wx.login({
    success: function (wxlogin_res) {
      console.log("btn_one_click_login 获取到的jscode是:" + wxlogin_res.code);

      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=wxa_get_openid_using_js_code',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        dataType: 'json',
        data: {
          js_code: wxlogin_res.code,
          xiaochengxu_appid: app.globalData.xiaochengxu_appid,
          sellerid: app.get_sellerid(),
        },
        success: function (http_res) {
          

          if (http_res && http_res.data) {
            if (http_res.data.code == 1) {
              var openid = http_res.data.openid;
              console.log('999999999999999999',openid)
              app.set_current_openid(openid);

              that.__get_order_detail(that, orderno, openid, that.getMap);
            }
            else {
              wx.showModal({
                title: '提示',
                content: http_res.data.msg,
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }

          }
          else {
            wx.showToast({
              title: '网络解密异常！',
              duration: 2000
            });
          }


        }
      });

    },
    fail: function (login_res) {
      console.log('login.js  wx.login失败。');

      wx.showToast({
        title: '打开小程序登录异常',
        duration: 2000
      });
    }
  })



  
},

  __get_order_detail: function (that, orderno, openid, callback_get_map){

  //请求延誉宝接口，根据订单编号和openid、appid得到订单的详细信息
  wx.request({
    url: app.globalData.http_server + 'index.php/openapi/Jianghanyinhua/order_detail_get',
    method: 'post',
    data: {
      orderno: orderno,
      openid : openid,
      sellerid: app.get_sellerid(),
      //xiaochengxu_appid: app.globalData.xiaochengxu_appid
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log('order_detail_get', res)

      var data = res.data.data;
      if (!res.data.data) {
        return;
      }
     
      if(data.selfform_mazhu_url){
        that.setData({
          selfform_mazhu_url : data.selfform_mazhu_url,
        })
        console.log('123456789',that.data.selfform_mazhu_url);
      }
      

      var mobile = data.mobile;

      //app.globalData.userInfo.user_openid = data.openid;

      //但是订单的手机号为空，则跳转到绑定手机号码的page
      // that.data.owner_flag =1 
      if (!mobile) {
        console.log('mobile', mobile);

        wx.navigateTo({
          url: '/pages/scan_qrcode/scan_bind_mobile?orderno=' + orderno,
        })

        return;
      }

      //请求成功，

      //当前手机号存在，如果当前openid和订单的openid一致，跳出两个选择，更换手机号码和扫码定位
      // this.data.owner_flag =1 

      //如果不是以上两种情况，this.data.owner_flag =2 

      console.log('ddddd', data.openid);
      // app.get_current_openid()
      console.log('ddddd',app.get_current_openid())
      if (data.openid == app.get_current_openid()) {

        console.log('!mobile&&888888')


        that.setData({
          owner_flag: 1,
          mobile: mobile,
          display: "block",
          map_type: data.map_type,
          token: data.token,
          formid:data.formid,
        })
        console.log('map_type',that.data.map_type)
      } else {
        that.setData({
          owner_flag: 2
        })
      }



      var is_expire = data.is_expire;
      //如果不存在过期时间这个字段，默认为过期
      //如果过期，弹窗提示，点击确认后去续费
      //如果有过期时间，并且小于当期时间，那么也是过期的

      console.log('订单112233====>'+orderno);

      if(is_expire){

        var new_url = null;
        var title001 = '提示';

        if(that.data.owner_flag == 1){
          //new_url = '/pages/product/detail?productid='+data.buy_url_productid;
          new_url = 'https://yanyubao.tseo.cn/Home/Jianghanyinhua/order_chongzhi/ensellerid/fSmyUPkjj?wxa_openid=%wxa_openid%&orderno001='+orderno;

          
        }
        else{
          title001 = '代续费提示';

          var order_option_key_and_value = [];
          order_option_key_and_value.push({'key':'jianghan_orderno', 'value':orderno});

          var order_option_key_and_value_str = encodeURIComponent(JSON.stringify(order_option_key_and_value));

          //new_url = '/pages/order/pay?action=direct_buy&amount=1&productid='+data.buy_url_productid;
          //new_url += '&order_option_key_and_value_str='+order_option_key_and_value_str;
          //new_url += '&buyer_memo=' + '代续费订单：'+orderno;

         

          new_url = 'https://yanyubao.tseo.cn/Home/Jianghanyinhua/order_chongzhi/ensellerid/fSmyUPkjj?wxa_openid=%wxa_openid%&orderno001='+orderno;


        }

        console.log('充值跳转地址123123=====>'+new_url);

        wx.showModal({
          title: title001,
          content: data.tips,
          cancelColor: 'cancelColor',
          success:function(res){
            if(res.confirm){
              //wx.navigateTo({
              //  url: new_url,
              //});
              app.call_h5browser_or_other_goto_url(new_url);
            }
            else{
              app.call_h5browser_or_other_goto_url('/pages/index/index');
            }
            

          },

        });



        

        return;
      }









      typeof callback_get_map == "function" && callback_get_map(that);
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    },
  });

},




  getMap: function (that){
    var that = this;


    var regeocoding_fail = function (data) {
      console.log('fail', data)
      wx.chooseLocation({
        success: function (e) {
          //已打开定位
          that.setData({
            showCon: false
          })
        },
        fail: () => {
          //没有打开定位
          wx.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.userLocation']) {
                //打开提示框，提示前往设置页面
                console.log('没有打开定位');

                that.setData({
                  //showCon: true
                  showCon: false
                })

                //如果不是码主，则准备跳转
                if (!that.data.is_send_mess && (that.data.owner_flag == 2)) {
                  var messageid = '000';

                  var data_url = 'https://yanyubao.tseo.cn/openapi/Jianghanyinhua/get_order_scan_report_page?orderno='+that.data.orderno+'&messageid='+messageid;

                  
                  wx.navigateTo({
                    url: '/pages/welcome_page/welcome_page?data_url='+ encodeURIComponent(data_url),
                  })

                  //var page_url = 'https://yanyubao.tseo.cn/openapi/Jianghanyinhua/show_order_scan_report_page?orderno='+that.data.orderno+'&messageid='+messageid;

                  //app.call_h5browser_or_other_goto_url(page_url);

                }

                


              }

            }
          })
        }
      })
    };

    var regeocoding_success_get_location = function (data) {
      console.log('success', data)
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });



      if ((wxMarkerData[0].latitude == 0) || (wxMarkerData[0].longitude == 0) ) {
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            wxMarkerData[0].latitude = res.latitude;
            wxMarkerData[0].longitude = res.longitude;
            wx.request({
              url: 'https://api.map.baidu.com/geocoder/v2/?location=' + res.latitude + ',' + res.longitude + '&coordtype=wgs84ll&output=json&pois=1&latest_admin=1&ak=Sj9XVcaHMrKfaXZ2VmZhUqd03wpr0SAK',
              method: 'get',

              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log('sssssssssss', res);

                wxMarkerData[0].address = res.data.result.formatted_address;


                that.setData({
                  current_latitude: wxMarkerData[0].latitude,
                  current_longitude: wxMarkerData[0].longitude,
                  current_address: wxMarkerData[0].address,
                });


                console.log('llllllllaaaaaaaaaaaaa', wxMarkerData)


                if (!that.data.is_send_mess && (that.data.owner_flag == 2)) {
                  that.send_location_sms();
                }

                return;

              },
              fail: function (res) {

                return;

              }
            })


          }
        })



      }


      that.setData({
        current_latitude: wxMarkerData[0].latitude,
        current_longitude: wxMarkerData[0].longitude,
        current_address: wxMarkerData[0].address,
      });



      console.log('llllllll', wxMarkerData)

      //如果是订单所有者
      // if(that.data.owner_flag == 1){
      //   return;
      // }


      // //yixai function
      // if (that.data.owner_flag == 0) {
      //   return;
      // }


      if (!that.data.is_send_mess && (that.data.owner_flag == 2)) {
        that.send_location_sms();
      }




    }  //  end of success


    app.set_option_list_str(that, function (that, cb_params) {
      //var that = this;

      console.log('getShopOptionAndRefresh+++++:::' + cb_params)

      //从本地读取
      var option_list_str = wx.getStorageSync('shop_option_list_str_' + app.get_sellerid());
      var option_list = JSON.parse(option_list_str);
      console.log('获取商城选项数据用于百度地图',option_list);
      console.log('获取商城选项数据用于百度地图');
      console.log("百度地图AK：" + option_list.baidu_map_ak_wxa);

      /* 获取定位地理位置 */
      // 新建bmap对象

      // 新建百度地图对象 
      var BMap = new bmap.BMapWX({
        ak: option_list.baidu_map_ak_wxa
      });

      // 发起regeocoding检索请求 
      BMap.regeocoding({
        fail: regeocoding_fail,
        success: regeocoding_success_get_location,
        iconPath: '../../images/marker_red.png',
        iconTapPath: '../../images/marker_red.png'
      }); 

    });


    
    //不允许data

  },

  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      rgcData: {
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      }
    });
  },


//更换手机号
  change_mobile_num:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/scan_qrcode/scan_change_mobile?orderno=' + that.data.orderno + '&mobile=' + that.data.mobile,
    })
  },

  //重置手机号码
  scan_remove_mobile:function(){
    var that = this;

    wx.showModal({
      title: '提示',
      content: '是否解除绑定？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定');


          wx.request({
            url: app.globalData.http_server + 'index.php/openapi/Jianghanyinhua/remove_mobile_phone',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              openid: app.get_current_openid(),
              appid: app.globalData.xiaochengxu_appid,        
              orderno: that.data.orderno,
              sellerid: app.get_sellerid()
            },
            success: function (res) {
              console.log('res', res)
      
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success: function (res2) {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              })
      
            }
          });




        } 
      }
    });

    



    

  },

//扫码定位
  scan_location:function(){
    var that = this;
    that.send_location_sms();
  },

  qrcode_meihua:function(){
   
    var qrcode_data = decodeURIComponent(this.options.q);
    console.log('123456',this.options)
    console.log('decodeURI转码后的q：' + qrcode_data);

    var orderno = qrcode_data.replace('http://jh.tseo.cn/index.php?g=Home&m=Scan&a=index&orderno=', '');
    if (orderno.length > 20) {
      orderno = orderno.replace('http%3A%2F%2Fjh.tseo.cn%2Findex.php%3Fg%3DHome%26m%3DScan%26a%3Dindex%26orderno%3D', '');
    }
    console.log('45645645',orderno)
    var qrcode_new_url = "https://yanyubao.tseo.cn/index.php?g=Home&m=BeautyQrcode&a=index&ensellerid=pQNNmSkaq&data=" + this.options.q + "&qrfont_xia=" + orderno ;
   console.log('asdasdaa',qrcode_new_url)
   
    app.call_h5browser_or_other_goto_url(qrcode_new_url);

  },

  send_location_sms:function(data){
    var that = this;
    console.log('dddd',data);
    console.log('123456789',wxMarkerData)
    if ((wxMarkerData[0].latitude == 0) || (wxMarkerData[0].longitude == 0)){
      return;
    }
   
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/Jianghanyinhua/mapaddress',
      method: 'post',
      data: {
        orderno: that.data.orderno,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        address: wxMarkerData[0].address,
        q: that.data.q,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('ooooo',res);

        that.setData({
          is_send_mess: true
        })

        if(res && res.data && (res.data.code == 1)){
          var messageid = res.data.messageid;
          
          var data_url = 'https://yanyubao.tseo.cn/openapi/Jianghanyinhua/get_order_scan_report_page?orderno='+that.data.orderno+'&messageid='+messageid;

          var new_url = '/pages/welcome_page/welcome_page?data_url='+ encodeURIComponent(data_url);

          if(res.data.map_type == 2){
            new_url = '/pages/selfform/selfform?form_type=2&token=' + res.data.data.token  + '&formid=' + res.data.data.formid;

            new_url += '&hidden_ad_img_list=1';

            new_url += '&latitude=' + that.data.current_latitude;
            new_url += '&longitude=' + that.data.current_longitude;
            new_url += '&address=' + that.data.current_address;

            if(res.data.data.video_url){
              new_url += '&video_url=' + encodeURIComponent(res.data.data.video_url);
              new_url += '&video_cover_url=' + encodeURIComponent(res.data.data.video_cover_url);
              new_url += '&video_autoplay=1';
            }

          }

          console.log('888888888888888888888888888888', new_url);

          wx.redirectTo({
            url: new_url,
          })

          //var page_url = 'https://yanyubao.tseo.cn/openapi/Jianghanyinhua/show_order_scan_report_page?orderno='+that.data.orderno+'&messageid='+messageid;

          //app.call_h5browser_or_other_goto_url(page_url);


        }
        else{
          wx.navigateTo({
            url: '/pages/welcome_page/welcome_page',
          })
        }
        

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

      
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
    var that = this;
      //that.getMap();
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

  },
  scan_set_community_interaction:function(){
 
    app.call_h5browser_or_other_goto_url(this.data.selfform_mazhu_url);
  },
  updataRadio:function(e){
    console.log('555555',e);
    wx.request({
      url: app.globalData.http_server + 'index.php/openapi/Jianghanyinhua/set_order_map_type',
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        map_type:e.detail.value,
        orderno:this.data.orderno,
        openid:app.get_current_openid(),
      },
      success: function (res) {
        if(res.data.code != 1){
          return
        }
      }

    });
  },
  scan_set_e_profile:function(){
    var new_url = '/pages/selfform/selfform?form_type=2&sellerid=' + app.get_sellerid();
    new_url += '&token=' + app.get_current_weiduke_token();
    new_url += '&formid=325&orderno=' + this.data.orderno;
    new_url += '&submit_url=https%3A%2F%2Fyanyubao.tseo.cn%2Fopenapi%2FJianghanyinhua%2Fsubmit_user_data';

    wx.navigateTo({
      url: new_url,
    });

  },

  go_to_set_weixin_notify:function(){
    var last_url = '/pages/selfform/selfform?form_type=2&token=mrfuhd1546833814&formid=342&submit_url=https%3A%2F%2Fyanyubao.tseo.cn%2Fopenapi%2FJianghanyinhua%2Fsubmit_data_notify_type';

    console.log('go_to_set_weixin_notify====>>>>'+last_url);


    if(app.goto_user_login(last_url)){
      return;
    }

    app.call_h5browser_or_other_goto_url(last_url);
  },

  go_to_weixin_pay:function(){   
    var new_url = 'https://yanyubao.tseo.cn/Home/Jianghanyinhua/order_chongzhi/ensellerid/fSmyUPkjj?wxa_openid=%wxa_openid%&orderno001=' + this.data.orderno + '&oneclicklogin=%oneclicklogin%';
    
    if(app.goto_user_login(new_url)){
      return;
    }

    app.call_h5browser_or_other_goto_url(new_url);
    
  },





  // ----------------------------------------------
  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  }




  


})