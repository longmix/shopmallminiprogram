
//获取应用实例 
var app = getApp();

//var userInfo = app.get_user_info();


//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');

Page({
  firstIndex: -1,
  data:{
    //滚动图片
    bannerItem: [],
    swiper_image_current: 0,
    //所有图片的高度  
    swiper_image_heights: [],

    xianshimiaosha:0,
    duorenpintuan:0,
    jietijiage:0,
    share: "share",
    bannerApp:true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    itemData:{},
    amount:1,
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // 属性选择
    firstIndex: -1,
    //准备数据
    //数据结构：以一组一组来进行设定
    commodityAttr:[],
    attrValueList: [],
    buys:'立即购买',
    status:''
  },

  // 弹窗
  setModalStatus: function (e) {

    var that = this;

    var userInfo = app.get_user_info();

    
    if ((!userInfo) || (!userInfo.userid)) {
      
      var last_url = null;
      var page_type = 'normal';

      if (that.data.productid) {
        last_url = '/pages/product/detail?' + that.data.options_str;
      }
      app.goto_user_login(last_url, page_type);

      return;
    }

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step();
    
    this.setData({
      animationData: animation.export()
    })

    var action_type = '';
    if(e.currentTarget.dataset.type){
      action_type = e.currentTarget.dataset.type;
    }

    if (e.currentTarget.dataset.status == 1) {
      this.setData(
        {
          showModalStatus: true,
          buys: '立即购买',
          status: '1',
          action_type : action_type
        }
      );
    }else {
      this.setData(
        {
          showModalStatus: true,
          buys: '加入购物车',
          status: '2',
          action_type: action_type
        }
      );
    }
    
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },
  // 加减
  changeNum:function  (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
        if (this.data.amount <= 1) {
            amount:1
        }else{
            this.setData({
                amount:this.data.amount - 1 
            })
        };
    }else{
        this.setData({
            amount:this.data.amount + 1
        })
    };
  },
  // 传值
  onLoad: function (option) {  

    
    console.log(option);   
    //this.initNavHeight();

    var that = this;

    app.set_option_list_str(null, app.getColor());


    var options_str = '';

    //如果当前访问者没有登录或者注册，那么分析转发过来的链接是否带有推荐者信息
    if(option.userid){
      var userInfo = app.get_user_info();

      if ((!userInfo) || (!userInfo.userid)) {
        app.set_current_parentid(options.userid);
      }
    }


    if (option.productid) {
      that.setData({
        productid: option.productid,
      });

      options_str += 'productid=' + option.productid + '&';
    }
    

    if (option.price_type){
      that.setData({
        price_type: option.price_type,
      });

      options_str += 'price_type=' + option.price_type+'&';
    }
    if (option.sharekanjia){
      that.setData({
        is_sharekanjia: option.sharekanjia,
      });

      options_str += 'sharekanjia=' + option.sharekanjia + '&';
    }
    
    if (option.jiantuanid){
      that.setData({
        jiantuanid: option.jiantuanid,
      });

      options_str += 'jiantuanid=' + option.jiantuanid + '&';
    }

    options_str = options_str.substr(0, options_str.length -1);

    console.log('options_str', options_str);

    that.setData({ options_str: options_str});


    that.loadProductDetail();

    that.loadCataXiangqing();


    //从本地读取
    setTimeout(function () {
      var option_list_str = wx.getStorageSync("option_list_str");

      console.log("获取商城选项数据：" + option_list_str + '333333333');

      if (!option_list_str) {
        return null;
      }

      var option_list = JSON.parse(option_list_str);

      if (option_list.wxa_show_kucun_xiaoliang){
        that.setData({
          wxa_show_kucun_xiaoliang: option_list.wxa_show_kucun_xiaoliang
        });
      }

    }, 1000);

  },
  goto_cart:function(){
    console.log('准备跳转到购物车');
    
    var option_list_str = wx.getStorageSync("option_list_str");

    console.log("获取商城选项数据：" + option_list_str + '44444444444444');

    if (!option_list_str) {
      return null;
    }

    var option_list = JSON.parse(option_list_str);

    if (option_list && option_list.wxa_cart_in_product_detail 
      && (option_list.wxa_cart_in_product_detail == 1)) {

      wx.navigateTo({
        url: '/pages/cart/cart',
      })

      
    }
    else{
      wx.switchTab({
        url: '/pages/cart/cart',
      })

    }

    //app.call_h5browser_or_other_goto_url('/pages/cart/cart');

  },
  myChat: function () {
    var that = this;

    var userInfo = app.get_user_info();

    if ((!userInfo) || (!userInfo.userid)) {


      var last_url = null;
      var page_type = 'normal';

      if (that.data.productid) {
        last_url = '/pages/product/detail?productid=' + that.data.productid;
      }
      app.goto_user_login(last_url, page_type);


      return;


    } else {
      var url = 'https://yanyubao.tseo.cn/Home/OnlineChat/chat.html?ensellerid=' + app.get_sellerid();

      wx.navigateTo({
        url: '../h5browser/h5browser?url=' + encodeURIComponent(url),
      });

      return;
     }
    },

  goto_shop_home: function (e){

    wx.redirectTo({
      url: '/pages/index/Liar',
    });

    return;
  },

// 商品详情数据获取
  loadProductDetail:function(){
    var that = this;
    var product_list = wx.getStorageSync('product_list');

    var userInfo = app.get_user_info();
   
    if ((!userInfo) || (!userInfo.userid)) {
      that.setData({
        colIcon: "/images/shc.png",
        colBtn: "收藏"
      })
    }
    console.log(product_list);
    wx.showLoading({
      title: '加载中...',
    })

    var data_params = {
      productid: that.data.productid,
      //'productid': '2039',
    }

    if(userInfo){
      data_params.userid = userInfo.userid;
    }

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_detail',
      method:'post',
      data: data_params,
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        //--init data 
        var code = res.data.code;
        if(code==1) {   
          var detail = res.data.data;
          //that.initProductData(data);
          var picture = detail.picture;
          that.setData({
            detail:detail,
            bannerItem: detail.picture_list,
            productid: detail.productid,
            content: res.data.data.describe,         
          });

          var attr_list = detail.attr_list

          console.log('attr_list', attr_list);
          
          if(detail.option_name){
            var option_list_arr = detail.option_name.split(' ');

           
            that.setData({
              option_list_arr: option_list_arr,
              spec1: option_list_arr[0],
            })
          }
          
          console.log('option_list_arr', option_list_arr)

          if(attr_list){
            var attr_key_arr = []
            var attr_list_arr = {}                  
            for(var i = 0; i<attr_list.length; i++){
              var arr = attr_list[i].option_name.split(' ');         
              if (attr_key_arr.indexOf(arr[0]) == -1) {
                attr_key_arr.push(arr[0]);                        
              }              
            }

            console.log('第一行：', attr_key_arr);

            for (var j=0; j < attr_key_arr.length; j++){
              var attr_arr = []
              for (var i = 0; i < attr_list.length; i++) {
                var arr = attr_list[i].option_name.split(' ');

                if ((attr_key_arr[j] == arr[0]) && arr[1]){
                  attr_arr.push(arr[1])
                }
              }
              attr_list_arr[attr_key_arr[j]] = attr_arr
            }

            console.log('最终的商品属性列表：', attr_list_arr);            

            that.setData({
              attr_list_arr: attr_list_arr,
              attr_key_arr: attr_key_arr,
              attr_list: attr_list
            })

          }

          WxParse.wxParse('content', 'html', res.data.data.describe, that, 15);

          app.set_sellerid(detail.sellersn);

        } else {
               wx.showToast({
                 title:res.data.msg,
                 icon:'none'
               })
        }
      },
      error:function(e){
        wx.showToast({
          title:'网络异常！',
          duration:2000,
        });
      },
    });

    if (userInfo){
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_favorite',
      method: 'post',
      data: {
        productid: that.data.productid,
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var code = res.data.code;
        if (code == 1) {
          that.setData({
            colIcon: "/images/shced.png",
            colBtn: "取消"
          })
        } else {
          that.setData({
            colIcon: "/images/shc.png",
            colBtn: "收藏"
          })
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
    }
  },
  loadCataXiangqing:function(){
    var that = this;
    wx.request({
      url: app.globalData.http_server +'/Yanyubao/ShopAppWxa/product_detail_youhui',
      method: 'post',
      data: {
        productid:that.data.productid,
        //'productid': '2039',
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var code = res.data.code;
        if (code >= 0) {
          var xiangqing = res.data.data;
          var cataArr = [];
          for (var i = 0; i < xiangqing.length; i++) {
            cataArr.push(xiangqing[i].youhui_type);
          }
          if (cataArr.indexOf("jietijiage")>-1){
            var cata_key = cataArr.indexOf("jietijiage");
            that.setData({
              youhui_data: xiangqing[cata_key].youhui_data,
              jietijiage:1,
            });
          }
          if (cataArr.indexOf("duorenpintuan") > -1) {
            var cata_key = cataArr.indexOf("duorenpintuan");
            console.log(cata_key);
            that.setData({ 
              pintuan_url: xiangqing[cata_key].url,
              duorenpintuan: 1,
            });
          }
          if (cataArr.indexOf("sharekanjia") > -1) {
            var cata_key = cataArr.indexOf("sharekanjia");
            console.log(cata_key);
            that.setData({
              kanjia_url: xiangqing[cata_key].url,
              sharekanjia: 1,
            });
          }
          if (cataArr.indexOf("xianshimiaosha") > -1) {
            var cata_key = cataArr.indexOf("xianshimiaosha");
            that.setData({
              miaosha_url: xiangqing[cata_key].url,
              xianshimiaosha: 1,
            });
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  cataChat:function(e){
    console.log(e); 
    console.log(e.currentTarget.id);

    var that = this;

    var userInfo = app.get_user_info();

    
    if ((!userInfo) || (!userInfo.userid)) {
      var last_url = null;
      var page_type = 'normal';

      if (that.data.productid) {
        last_url = '/pages/product/detail?productid=' + that.data.productid;
      }
      app.goto_user_login(last_url, page_type);

      return;
    }
    var cata_id = e.currentTarget.id;

    var join_flag = '?';
    if (cata_id=="pintuan"){
      if (that.data.pintuan_url.indexOf("?") != -1) {
        join_flag = '&';
      }
      var url = that.data.pintuan_url + join_flag+'click_type=Wxa'
      //var url = 'https://yanyubao.tseo.cn/Home/DuorenPintuan/jiantuan_list/productid/3969.html?click_type=Wxa'
      //var url = 'http://192.168.0.205/yanyubao_server/index.php?g=Home&m=DuorenPintuan&a=jiantuan_list&productid=318&click_type=Wxa'
                
      console.log(url);
      wx.navigateTo({
        url: '../h5browser/h5browser?url=' + encodeURIComponent(url)
      });
    } else if (cata_id == "kanjia") {
      if (that.data.kanjia_url.indexOf("?") != -1) {
        join_flag = '&';
      }
      var url = that.data.kanjia_url + join_flag +'click_type=Wxa'
      console.log(url);
      wx.navigateTo({
        url: '../h5browser/h5browser?url=' + encodeURIComponent(url)
      });
    } else if (cata_id == "miaosha") {
      if (that.data.miaosha_url.indexOf("?") != -1) {
        join_flag = '&';
      }
      var url = that.data.miaosha_url + join_flag +'click_type=Wxa'
      console.log(url);
      wx.navigateTo({
        url: '../h5browser/h5browser?url=' + encodeURIComponent(url)
      });
    }

  },
// 属性选择
  onShow: function () {
    var userInfo = app.get_user_info();

    this.setData({
      includeGroup: this.data.commodityAttr
    });
    this.distachAttrValue(this.data.commodityAttr);
    // 只有一个属性组合的时候默认选中
    // console.log(this.data.attrValueList);
    if (this.data.commodityAttr.length == 1) {
      for (var i = 0; i < this.data.commodityAttr[0].attrValueList.length; i++) {
        this.data.attrValueList[i].selectedValue = this.data.commodityAttr[0].attrValueList[i].attrValue;
      }
      this.setData({
        attrValueList: this.data.attrValueList
      }); 
    }
  },

  /* 获取数据 */
  distachAttrValue: function (commodityAttr) {
    /**
      将后台返回的数据组合成类似
      {
        attrKey:'型号',
        attrValueList:['1','2','3']
      }
    */
    // 把数据对象的数据（视图使用），写到局部内
    var attrValueList = this.data.attrValueList;
    // 遍历获取的数据
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);
        // console.log('属性索引', attrIndex); 
        // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理
          if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
          }
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue]
          });
        }
      }
    }
    // console.log('result', attrValueList)
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList: attrValueList
    });
  },
  getAttrIndex: function (attrName, attrValueList) {
    // 判断数组中的attrKey是否有该属性值
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    return i < attrValueList.length ? i : -1;
  },
  isValueExist: function (value, valueArr) {
    // 判断是否已有属性值
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    /*
    点选属性值，联动判断其他属性值是否可选
    {
      attrKey:'型号',
      attrValueList:['1','2','3'],
      selectedValue:'1',
      attrValueStatus:[true,true,true]
    }
    console.log(e.currentTarget.dataset);
    */
    var attrValueList = this.data.attrValueList;
    var index = e.currentTarget.dataset.index;//属性索引
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    if (e.currentTarget.dataset.status || index == this.data.firstIndex) {
      if (e.currentTarget.dataset.selectedvalue == e.currentTarget.dataset.value) {
        // 取消选中
        this.disSelectValue(attrValueList, index, key, value);
      } else {
        // 选中
        this.selectValue(attrValueList, index, key, value);
      }

    }
  },
  /* 选中 */
  selectValue: function (attrValueList, index, key, value, unselectStatus) {
    // console.log('firstIndex', this.data.firstIndex);
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选
      var commodityAttr = this.data.commodityAttr;
      // 其他选中的属性值全都置空
      // console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus);
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }

    // console.log('选中', commodityAttr, index, key, value);
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attrValueList[index].selectedValue = value;

    // 判断属性是否可选
    // for (var i = 0; i < attrValueList.length; i++) {
    //   for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
    //     attrValueList[i].attrValueStatus[j] = false;
    //   }
    // }
    // for (var k = 0; k < attrValueList.length; k++) {
    //   for (var i = 0; i < includeGroup.length; i++) {
    //     for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
    //       if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
    //         for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
    //           if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
    //             attrValueList[k].attrValueStatus[m] = true;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    // console.log('结果', attrValueList);
    this.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });

    var count = 0;
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) {// 第一次选中，同属性的值都可选
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
  },
  /* 取消选中 */
  disSelectValue: function (attrValueList, index, key, value) {
    var commodityAttr = this.data.commodityAttr;
    attrValueList[index].selectedValue = '';

    // 判断属性是否可选
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList
    });

    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
      }
    }
  },

  initProductData: function(data){
    data["LunBoProductImageUrl"] = [];

    var imgs = data.LunBoProductImage.split(';');
    for(let url of imgs){
      url && data["LunBoProductImageUrl"].push(app.d.hostImg + url);
    }

    data.Price = data.Price/100;
    data.VedioImagePath = app.d.hostVideo + '/' +data.VedioImagePath;
    data.videoPath = app.d.hostVideo + '/' +data.videoPath;
  },

//添加到收藏
  addFavorites:function(e){
    var that = this;

    var userInfo = app.get_user_info();

    if ((!userInfo) || (!userInfo.userid)) {

      var last_url = null;
      var page_type = 'normal';

      if (that.data.productid) {
        last_url = '/pages/product/detail?productid=' + that.data.productid;
      }
      app.goto_user_login(last_url, page_type);

      return;
    }
    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=favorite', 
      method:'post',
      data: {
        userid: userInfo.userid,
        checkstr: userInfo.checkstr,
        sellerid: app.get_sellerid(),
        productid: that.data.productid,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        //var status = res.data.code;
        var info = res.data.msg;
        if (info == "收藏成功") {
          that.setData({
            colIcon: "/images/shced.png",
            colBtn: "取消"
          })
        }
        else if (info == "取消成功") {
          that.setData({
            colIcon: "/images/shc.png",
            colBtn: "收藏"
          })
        }
        wx.showToast({
          title: info,
          icon: 'success',
          duration: 5000
        })
      },
    });
  },

  addShopCart:function(e){ //添加到购物车


    var that = this;

    var userInfo = app.get_user_info();


    if ((!userInfo) || (!userInfo.userid)) {
      console.log('没有登录，跳转到登录界面');

      var last_url = null;
      var page_type = 'normal';

      if (that.data.productid){
        last_url = '/pages/product/detail?' + that.data.options_str;
      }

    
      app.goto_user_login(last_url, page_type);

      return;
    } 

    // 弹窗

      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })

      this.animation = animation
      animation.translateY(300).step();

      this.setData({
        animationData1: animation.export()
      })



      if (e.currentTarget.dataset.status == 1) {

        this.setData(
          {
            addShopCart: true
          }
        );
      }

      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation
        })
        if (e.currentTarget.dataset.status == 0) {
          this.setData(
            {
              addShopCart: false
            }
          );
        }
      }.bind(this), 200)


    
   


    if (e.currentTarget.dataset.status == 1){

      var new_url = '../order/pay?amount=' + that.data.amount + "&productid=" + that.data.productid + "&action=direct_buy";


      if (that.data.jiantuanid) {
        //看是否独立开团
        console.log('是否独立开团：', that.data.action_type);

        if(that.data.action_type == 'dulikaituan'){
          that.data.jiantuanid = 0;
        }

        new_url = '../order/pay?amount=' + that.data.amount + "&productid=" + that.data.productid + "&action=direct_buy" + "&cuxiao_type=duorenpintuan" + '&jiantuanid=' + that.data.jiantuanid + '&price_type=' + that.data.price_type;

      } 
      else if (that.data.is_sharekanjia == 'sharekanjia') {
        new_url = '../order/pay?amount=' + that.data.amount + "&productid=" + that.data.productid + "&cuxiao_type=sharekanjia" + "&action=direct_buy";
      }


      wx.navigateTo({
        //url: '../order/pay?productid=' + "%5B%222895%22%5D",
        url: new_url,
      })

    }
    else if (e.currentTarget.dataset.status == 2){
      //加入购物车

      wx.request({
        url: app.globalData.http_server + '?g=Yanyubao&m=ShopApp&a=cart_add',
        method: 'post',
        
        data: {
          amount: that.data.amount, 
          checkstr: userInfo.checkstr,
          productid: that.data.productid,
          sellerid: app.get_sellerid(),
          userid: userInfo.userid,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.showToast({
            title: '添加成功',

          });
        },
        fail: function (e) {
          wx.showToast({
            title: '添加失败',
          });
        },
      });
    }

             
  },

  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  initNavHeight:function(){////获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bannerClosed:function(){
    this.setData({
      bannerApp:false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  clickBtn:function() {
    this.onShareAppMessage();
  },

  swiper_image_load:function(e){
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var swiper_image_heights = this.data.swiper_image_heights;
    //把每一张图片的对应的高度记录到数组里  
    swiper_image_heights[e.target.dataset.id] = imgheight;
    this.setData({
      swiper_image_heights: swiper_image_heights
    })

    console.log('11111111111111', this.data.swiper_image_heights);

  },
  swiper_image_change: function (e) {
    // console.log(e.detail.current)
    this.setData({ swiper_image_current: e.detail.current })
  },

  onShareAppMessage: function () {
    var that = this;

    var share_title = that.data.detail.name;
    if(share_title.length > 22){
      share_title = share_title.substr(0, 20) + '...';
    }

    var share_path = '/pages/product/detail?productid=' + that.data.productid + '&sellerid' + app.get_sellerid();

    var userInfo = app.get_user_info();

    if (userInfo && userInfo.userid) {
      share_path += '&userid='+userInfo.userid;
    }

    return {
      title: share_title + ' ￥' + that.data.detail.price,
      path: share_path,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  
  changeSpec:function(e){
    var value = e.currentTarget.dataset.value;
    var option_list_arr = that.data.option_list_arr;
    var attr_list = that.data.attr_list;

    for (var i = 0; i < attr_list.length; i++){
      // if (attr_list[i].option_name == ){

      // }
    }
  },

  changeSpec1:function(e){
    var that = this
    var spec1 = e.currentTarget.dataset.spec1;
    var option_list_arr = that.data.option_list_arr;
    option_list_arr[0] = spec1;

    console.log('aaaaaaaaaaaaaaaaaaa', spec1, option_list_arr)
    console.log('aaaaaaaaaaaaaaaaaaa', option_list_arr[0])



    this.setData({
      spec1: spec1,
      option_list_arr: option_list_arr
    })

    // var attr_list_arr = this.data.attr_list_arr;
    // for (var i=0; i< attr_list_arr.length; i++ ){
    //   if (attr_list_arr[i])
    // }

    if (option_list_arr.length == 1){
      this.setData({ current_spec: spec1});
      this.changeSpec2(null);
    }

  },

  changeSpec2:function(e){
    var that = this

    var spec2 = that.data.current_spec;
    var spec_str = spec2;

    if(e){
      spec2 = e.currentTarget.dataset.spec2;
    }

    var attr_list = that.data.attr_list;
    var option_list_arr = that.data.option_list_arr;

    if (!spec_str){
      spec_str = that.data.spec1 + ' ' + spec2

      option_list_arr[1] = spec2
    }

    this.setData({
      spec2: spec2,
      option_list_arr: option_list_arr
    })
    
    for (var i = 0; i < attr_list.length; i++){
      if (spec_str == attr_list[i].option_name){
        var productid = attr_list[i].productid
      }
    }

    wx.request({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=product_detail',
      method: 'post',
      data: {
        productid: productid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var code = res.data.code;
        if (code == 1) {
          var detail = res.data.data;
          //that.initProductData(data);
          var picture = detail.picture;
          that.setData({
            detail: detail,
            bannerItem: detail.picture_list,
            productid: detail.productid,
            content: res.data.data.describe,
          });

          WxParse.wxParse('content', 'html', res.data.data.describe, that, 15);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

      },
      fail:function(res){
        wx.showToast({
          title: '网络异常',
          duration: 2000
        })

      },
    })
    


  }
});

