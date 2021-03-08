// pages/selfform/selfform.js
var app = getApp();

var api = require('../../utils/api');
var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplier_input_list : '',
    date: "1992-10-12",
    indexs: '0',
    imgList: {},
    currentZone:'',
    value: "",
    submit_url:'',
    maxlength: -1,
    height:0,
    submit_text:'',
    
    picker_list : [],



    region: ['上海市', '上海市', '黄浦区'],
    customItem: '全部',
    textarea_auto_height:false,


    current_title:'',
    form_logourl:'',
    current_option_list:null,
    current_params_str:'',



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log('selfformselfform=====>>>>>', options);


    app.set_option_list_str(this, this.__handle_option_list);

    //=====分析参数=====
    var arr = Object.keys(options);
    var options_len = arr.length;

    if (options_len > 0){
      var params_str = '';

      for(var key in options){
        params_str += key+'='+options[key]+'&';
      }
      params_str = params_str.substr(0, params_str.length - 1);

      this.setData({
        current_params_str:params_str
      });
    }
    //===== End ======
    

    // region: ['广东省', '广州市', '海珠区'],
    var region = this.data.region['0'] + '-' + this.data.region['1'] + '-' + this.data.region['2'];
    this.setData({
      region: region
    })

    //是否带submit_url参数
    if (options.submit_url) {
      this.setData({
        submit_url: decodeURIComponent(options.submit_url)
      })
    }


    var form_type = 0;
    var current_token = '';
    var current_formid = 0;

    //=======处理 scene 参数======
    if (options.scene) {

      var url_value = decodeURIComponent(options.scene);
      var url_data = url_value.split('#');

      console.log(url_data);
      console.log(url_data[1]);

      if (url_data.length >= 3) {
        form_type = url_data[0];
        current_token = url_data[1];
        current_formid = url_data[2];

        options['form_type'] = form_type;
        options['token'] = current_token;
        options['formid'] = current_formid;
      }
    }    
    //========= End =========

    if (form_type == 0){
      form_type = options.form_type;
    }
    
    this.setData({
      form_type: form_type
    })

    //===========================================
    if (form_type == 1) {

      var last_url = '';

      var arr = Object.keys(options);
      var options_len = arr.length;

      if (options_len > 0) {
        var params_str = '';

        for (var key in options) {
          params_str += key + '=' + options[key] + '&';
        }
        params_str = params_str.substr(0, params_str.length - 1);

        last_url = '/pages/selfform/selfform?' + params_str;
      }

      //var last_url = '/pages/selfform/selfform' + '?channel=' + options.channel + '&form_type=' + options.form_type;

      if(app.goto_user_login(last_url)){
        return;
      }

      console.log('开始调用  get_input_list_form_type_1');

      this.get_input_list_form_type_1(this.get_input_list_callback);
      
    }
    //===========================================

    //===========================================
    else if (form_type == 2) {
      
      if (!options.formid) {
        wx.showModal({
          title: '错误提示',
          content: '缺少参数：表单主键！',
        })
       
      }

      if (!options.token) {
        wx.showModal({
          title: '错误提示',
          content: '缺少参数：项目标识！',
        })
        return;
      }
      console.log('开始调用  get_input_list_form_type_2');
      this.get_input_list_form_type_2('selfform', options.token, options.formid, this.get_input_list_callback);
    }
    //===========================================

    //===========================================
    else if (form_type == 3) {

      if (!options.formid) {
        wx.showModal({
          title: '错误，缺少参数！',
          content: '错误，缺少参数！',
        })

      }

      if (!options.token) {
        wx.showModal({
          title: '错误，缺少参数！',
          content: '错误，缺少参数！',
        })
        return;
      }
      console.log('开始调用  get_input_list_form_type_2 添加参数 img_classify');
      this.get_input_list_form_type_2('img_classify', options.token, options.formid, this.get_input_list_callback);
    }
    //===========================================
    

    this.setData({ current_option: options });

    var myDate = new Date();
    myDate.setDate(myDate.getDate() - 5);
    var myDate2 = new Date();
    myDate2.setDate(myDate2.getDate() + 5);

    console.log('aaaaaaa====>>', util.formatTime(myDate))
    console.log('aaaaaaa====>>', util.formatTime(myDate2))

    this.setData({
      date_start_val : util.formatTime(myDate),
      date_end_val : util.formatTime(myDate2),
    });

    var that = this;

    //2020.5.7. 加载图片平铺广告
    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/SelfformData/get_ad_list',
      data: {
        sellerid: app.get_sellerid(),
      },
      success: function (res) {
        if(res.data && (res.data.code == 1)){
          var ad_img_list = res.data.ad_img_list;

          that.setData({
            ad_img_list :  ad_img_list
          });


        }


      },
    });

    
  },
  //=================onLoad结束==================


  
  __handle_option_list: function (that, option_list) {
    var wxa_shop_nav_bg_color = app.getColor();

    console.log('================>>>>', option_list);

    that.setData({
      current_option_list : option_list
    });

    if (!option_list.wxa_shop_nav_font_color){
      option_list.wxa_shop_nav_font_color = '#000';
    }

    if (wxa_shop_nav_bg_color){
      this.setData({
        btn_background_color: wxa_shop_nav_bg_color,
        btn_text_color: option_list.wxa_shop_nav_font_color
      })
    }
    else{
      this.setData({
        btn_background_color: '#00BFFF',
        btn_text_color:'#000'
      })

    }

    

  },

  /**
   * 获取表单数据
   */
  submitData: function (event) {
    console.log('====pppppppppp',event.detail.value);
    
    //读取表单的输入项和输入规则
    var supplier_input_list = this.data.supplier_input_list;
    


    //表单提交带的参数
    var data_value_list = event.detail.value;
    


    //获取前端的输入值
    var input_value_list = [];

    for (var key in data_value_list) {

      var form_value = data_value_list[key];

      

      if (!form_value) {
      

        var require = 0;
        var displayname = '';
        var reg_string = '';
      
        //判断是否符合规则
        for (var keys in supplier_input_list) {
          if (supplier_input_list[keys]['fieldname'] == key) {
           

            require = supplier_input_list[keys]['require'];
            displayname = supplier_input_list[keys]['displayname'];
            reg_string = supplier_input_list[keys]['regex'];
            break;
          }

          
         
        }

        //是否必须输入
        if (require == 1) {
          wx.showModal({
            title: '提示',
            content: displayname + '不能为空',
          })
          return;
        }

        //正则表达式
        if (reg_string) {
          if (!(reg_string.test(data_value_list))) {
            wx.showModal({
              title: '提示',
              content: displayname + '有误',
            })
            return;
          }
        }



      }
      // var a = [];
      // a[key] = form_value;
      // console.log('aaaaaaa', a);
      input_value_list[key] = form_value;
     
      
    }

    //准备提交到服务器
    var sumbit_url = '';
    var submit_data = input_value_list;
    var options = this.data.current_option;

    //检查是否有隐藏域
    //var hidden_list = [];
    for(var key in options){
      if((key == 'form_type')||(key == 'submit_url')||(key == 'formid')
        || (key == 'cataid') || (key == 'sellerid') || (key == 'token')){
          //continue;
      }

      //hidden_list[key] = options[key];
      submit_data[key] = options[key];
    }

    //console.log('11111111111111111111====>>隐藏域：',hidden_list);

    //console.log('11111111111111111111====>> length ：',hidden_list.length);

    console.log('11111111111111111111====>>完整的提交数据01：', submit_data);


    //submit_data = submit_data.concat(hidden_list);

    

    //追加商户和会员的信息
    var basic_data = [];

    basic_data.sellerid = app.get_sellerid();

    var user_info = app.get_user_info();
   

    //userid    checkstr
    if(user_info){
      basic_data.userid = user_info.userid;
      basic_data.checkstr = user_info.checkstr;
    }

    //token
    if (options['token']) {
      basic_data.token = options.token;
    }

    if (options['formid']) {
      basic_data.formid = options.formid;
    }

    basic_data.openid = app.get_current_openid();
    // basic_data.openid = 123;
    

    for (var key in basic_data){
      submit_data[key] = basic_data[key];
    }

    //将数组转为 | 分割分割 的 元素
    for (var key in submit_data) {
      if (typeof (submit_data[key]) == 'object'){
        submit_data[key] = submit_data[key].join('|');
      }
      
    }

    console.log('11111111111111111111====>>完整的提交数据02：', submit_data);
    
    var data_submit_url = '';
    
    if(this.data.current_option.form_type == 1){
      //提交到会员扩展属性
     
      data_submit_url = app.globalData.http_server + 'index.php/Yanyubao/ShopAppWxa/user_set_ext_info_list';
     
    }
    else if (this.data.current_option.form_type == 2) {
      //提交到微读客万能表单
      
      data_submit_url = app.globalData.http_weiduke_server + 'index.php/openapi/SelfformData/submit_data_url_selfform';
      
    }
    else if (this.data.current_option.form_type == 3) {
      //提交到文章分类的自定义属性
      data_submit_url = app.globalData.http_weiduke_server + 'index.php/openapi/SelfformData/submit_data_url_img_classify';

    }

    if(this.data.submit_url){
      data_submit_url = this.data.submit_url;
    }

    console.log('lllllllllllllllllllldata_submit_url', data_submit_url);

    var that = this;
    api.abotRequest({
      url: data_submit_url,
      method: 'post',
      data: submit_data,
      success: function (res) {

        var res_data = res.data;

        if(res.data.code == 1){
          if(!res.data.msg){
            res.data.msg = '提交成功';
          }

          wx.showModal({
            title: '提交成功',
            content: res.data.msg,
            showCancel:false,
            success(res) {
              if (res.confirm) {
                // app.call_h5browser_or_other_goto_url('/pages/welcome_page/welcome_page');
               
                wx.navigateBack({
                  delta: 1,  // 返回上一级页面。
                  success: function () {
                    console.log('成功！')
                  }
                })
              } else if (res.cancel) {
                //app.call_h5browser_or_other_goto_url('/pages/welcome_page/welcome_page');
                wx.navigateBack({
                  delta: 1,  // 返回上一级页面。
                  success: function () {
                    console.log('成功！')
                  }
                })
              }
            }
          });

          
        }
        else{
          wx.showModal({
            title: '提交失败',
            content: res_data.msg,
          })
        }

        
        
      },
    });








   
  
    
  },
  /**
 * 获取行业数据
 */
  bindIndustryChange: function (event) {

    // var fieldname = event.currentTarget.dataset.fieldname

    // var value_name = fieldname + index;
    console.log('eventeventevent',event);
    var id = event.currentTarget.dataset.id;
    
    var options = event.currentTarget.dataset.options;
    var value = event.detail.value;
    var picker_list = this.data.picker_list;

    picker_list[id] = options[value];

    this.setData({
      picker_list: picker_list
    })

  },
  /**
 * 获取日期数据
 */
  bindDateChange: function (event) {
    this.setData({
      date: event.detail.value
    })
  },


  

  /**
   * 文件上传
   */
  chooseImg: function (e) {
   
    var that = this;
    var imgList = that.data.imgList;
    var image_name = e.currentTarget.dataset.name;
    
    
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var imgItem = res.tempFilePaths[0];

        wx.uploadFile({
          url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=upload_image_file_without_user',
          filePath: imgItem,
          name: 'file',
          formData: {
            sellerid: app.get_sellerid(),
          },
          success: function (res) {

            that.setData({
              height:200,
            })

            var obj = JSON.parse(res.data);
            

            imgList[image_name] = obj.img_url;

            that.setData({
              imgList: imgList
            })
          }
        })
       
        

      }
    })

  },


  /**
   *获取扩展属性 
   */
  get_input_list_form_type_1: function(get_input_list_callback){
    //http://192.168.0.88/yanyubao_server/index.php/openapi/SupplierData/supplier_input_list
    console.log('进入  get_input_list_form_type_1');
    var userInfo = app.get_user_info();
    var userid = '';
    if (userInfo) {
      userid = userInfo.userid;
    }

    var that = this;
    
    api.abotRequest({
      url: app.globalData.http_server + 'index.php/openapi/SupplierData/supplier_input_list',
      data: {
        sellerid: app.get_sellerid(),
        userid: userid,
      },
      success: function (res) {


        var callback_data = res.data;

        typeof get_input_list_callback == "function" && get_input_list_callback(that, callback_data);


       
      },
    });
  },


  /**
   *获取会员扩展属性 
   */
  get_input_list_form_type_2: function (form_type_str, token, formid, get_input_list_callback) {
    //http://192.168.0.88/yanyubao_server/index.php/openapi/SupplierData/supplier_input_list
    console.log('进入  get_input_list_form_type_2');
    var openid = '';

    if(app.get_current_openid()){
      openid = app.get_current_openid();
    }

    var that = this;
    
    api.abotRequest({
      url: app.globalData.http_weiduke_server + 'index.php/openapi/SelfformData/get_selfform_option',
      method: 'post',
      data: {
        formid: formid,
        token: token,
        selfform_type: form_type_str, //'selfform',
        openid : openid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('resssssss',res);
        that.setData({
          submit_text: res.data.submit_text
        });

        if(res.data.logourl){
          that.setData({
            form_logourl: res.data.logourl
          });
        }

        if (res.data.intro) {
          that.setData({
            form_intro: res.data.intro
          });
        }
        
        var callback_data = res.data;
        
        typeof get_input_list_callback == "function" && get_input_list_callback(that, callback_data);
       
      },
    });
  },


  //回调
  get_input_list_callback:function(that, callback_data){
    console.log('进入回调  get_input_list_callback');
    //返回的数据不等于1 
    if (callback_data.code != 1) {
      wx.showModal({
        title: '处理失败',
        content: '获取表单数据失败！',
      })
      return;
    }


    
    var data = callback_data.data;
    
    var imgList = that.data.imgList;
   
    for (var key in data) {

      //多项选择
      if (data[key]['inputtype'] == "checkbox"){
        data[key]['options'] = data[key]['options'].split("|");
        if (data[key]['fieldvalue']){
          data[key]['fieldvalue'] = data[key]['fieldvalue'].split("|");
        }
        
        var new_options = [];
        for (var key01 in data[key]['options']){
          if (data[key]['options'][key01] == ''){
           continue;
          }
          var obj = [];
          obj.push(data[key]['options'][key01]);
         

          new_options.push(obj);
          
          data[key]['new_option'] = new_options;
          if (data[key]['fieldvalue']){
            var is_cunzai = data[key]['fieldvalue'].indexOf(data[key]['options'][key01]);

            if (is_cunzai != -1) {
              obj.push(true);

            }
          }
          

          
          
         
        }

        
      }
      console.log('data123',data);

      //省市区多级联动的渲染
      if (data[key]['inputtype'] == 'china_region') {
        that.setData({
          region: data[key]['fieldvalue'],
        })
      }

      //文件上传渲染
      if (data[key]['inputtype'] == 'file') {
        var fieldname = data[key]['fieldname'];
        imgList[fieldname] = data[key]['fieldvalue'];

        if (data[key]['fieldvalue']) {
          that.setData({
            height: 200,
          })
        }
      }

      
      that.setData({
        imgList: imgList
      })

      //如果是select  下拉框的话  就把options分隔
      if (data[key]['inputtype'] != 'select') {
        continue;
      }
      
      if (data[key]['options'] && (typeof (data[key]['options']) == 'string') && data[key]['options'].length){
        console.log('options=====>>>>>', data[key]['options']);
        data[key]['options'] = data[key]['options'].split("|");
      }
    }

    
    // =================下拉框 的 区分选择picker=======
    
    var picker_list = [];
    for (var key in data) {

      if (data[key]['inputtype'] == 'select') {
        if (data[key]['fieldvalue']) {
          var id = data[key]['id'];
          picker_list[id] = data[key]['fieldvalue'];
        } else {
          var id = data[key]['id'];
          picker_list[id] = data[key]['options'][0];
        }

      }
    }
    that.setData({
      picker_list: picker_list,
    })
    //====下拉框end====


    //前端需要循环的数据
    
    that.setData({
      supplier_input_list: data,
    })
    

    //有title 就替换掉
    if(callback_data.title){
      wx.setNavigationBarTitle({
        title: callback_data.title,
      })

      that.setData({
        current_title:callback_data.title
      });
    }

    //有content 就替换掉
    if(callback_data.content){
      WxParse.wxParse('content', 'html', callback_data.content, that, 15);
    }

  },
  // ==================回调结束==========================





  // 省市区联动选择
  bindRegionChange: function (e) {
    var region = e.detail.value['0'] + '-' + e.detail.value['1'] + '-' + e.detail.value['2'];
    this.setData({
      region: region
    })
    
  },

  checkboxChange:function(e){
    
  },


  go_to_ad_img_url:function(e){
    console.log('go_to_img_url======>>>>', e);

    var url = e.currentTarget.dataset.url;
    var that = this;
    var var_list = Object();

    app.call_h5browser_or_other_goto_url(url, var_list, 'pages_index');

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
    if(!this.data.current_title){
      this.data.current_title = this.data.current_option_list.name
    }

    if(!this.data.form_logourl){
      this.data.form_logourl = this.data.current_option_list.icon
    }

    return {
      title: this.data.current_title,
      path: 'pages/selfform/selfform?'+this.data.current_params_str, 
      imageUrl:this.data.form_logourl,
    }

  },
  onShareTimeline: function () {

    if(!this.data.current_title){
      this.data.current_title = this.data.current_option_list.name
    }

    if(!this.data.form_logourl){
      this.data.form_logourl = this.data.current_option_list.icon
    }

    
    return {
      title: this.data.current_title,
      query: this.data.current_params_str, 
      imageUrl:this.data.form_logourl
    }
  },
  onAddToFavorites: function () {
    return this.onShareTimeline();
  },
})