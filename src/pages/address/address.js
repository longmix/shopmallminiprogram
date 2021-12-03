//城市选择
var app = getApp();
var api = require('../../utils/api');

Page({
  data: {
    shengArr: ['请选择'],//省级数组
    shengId: [0],//省级id数组
    shiArr: ['请选择'],//城市数组
    shiId: [0],//城市id数组
    quArr: ['请选择'],//区数组
    quId: [0],
    shengIndex:0,
    shiIndex: 0,
    quIndex: 0,

    mid: 0,
    sheng:0,
    city:0,
    area:0,
    code:0,
    cartId:0,
    addressId:'',
    action: 'add',
    address_detail:'',

    
    area_province:null,
    area_city:null,
    area_district:null,
  
  },
  formSubmit: function (e) {
    var that = this;
    var adds = e.detail.value;
    var rephone =/^[1][3,4,5,6,7,8][0-9]{9}$/; 
    
    var cartId = this.data.cartId;
    var userInfo = app.get_user_info();
    if(!adds.name){
      wx.showToast({
        title:'请填写收件人'
      })
      return;
    }
    if(!rephone.test(adds.phone)) {
      wx.showToast({
        title:'请写填正确的电话号码'
      })
      return;
    }
    if(!that.data.shengIndex || !that.data.shiIndex){
      wx.showToast({
        title:'请选择省市区'
      })
      return;
    }
    if(!that.data.action){
      that.data.action = 'add';
    }

    var post_data = {
      action: that.data.action,
      checkstr: userInfo.checkstr,
      userid: userInfo.userid,
      sellerid: app.get_sellerid(),
      name: adds.name,
      mobile: adds.phone,
      area_province: that.data.area_province,
      area_city: that.data.area_city,
      area_district: that.data.area_district,
      address: adds.address,
      addressid: that.data.addressid
    };
    that.__ajax_address_save(post_data, function(response_data){
      console.log('response_data=====>>>',response_data)
      if(response_data.code==1){
        wx.showToast({
          title: '保存成功！',
          duration: 2000
        });
        setTimeout(function() {
          wx.navigateBack({
              delta: 1
          });
        }, 2000);
      }
      
    })

  },
  onShow: function () {

  },
  onLoad: function (options) {
    // app.set_option_list_str(null, app.getColor());
    console.log('address----options==', options)
    // 生命周期函数--监听页面加载
  
    var that = this;
    var userInfo = app.get_user_info();
    if ((!userInfo) || (!userInfo.userid)) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    } 
    
    
			this.data.addressid = options.addressId;
			console.log('addressid000=====>>>',this.data.addressid);

			this.data.action = options.action;
			console.log('action000===========>>>',	this.data.action)

    
      if(this.data.addressid){
				this.__get_address_item();
			}
			else{
				this.__get_china_data_list();
				
			}
			

   
  },

  __get_china_data_list:function(code02=0, data_type='province'){
    var that = this;
  
    var data_url = 'https://yanyubao.tseo.cn/openapi/ChinaListData/index';
    
    if(code02){
      data_url += '?code02='+code02;
    }
    
    //获取省级城市
    wx.request({
      url:  data_url,
      method: 'GET',
      success: function (res) {
        // success
        console.log('ChinaListData====>>>>', res.data.data);

        var city = res.data.data;
        if (res.data.code != 1) {
          return;
        }
        
        var data_arr = null;
        var data_id = null;
        
        if(data_type == 'province'){
          that.setData({
            shengArr : ['请选择'],
            shengId : [0],
   
          });
        

          data_arr = that.data.shengArr;
          data_id = that.data.shengId;
        }
        else if(data_type == 'city'){
         that.setData({
            shiArr : ['请选择'],
            shiId : [0],
            shiIndex : 0,
          });
        
          data_arr = that.data.shiArr;
          data_id = that.data.shiId;
     
        }
        else if(data_type == 'district'){
          that.setData({
            quArr : ['请选择'],
            quId : [0],
            quIndex : 0,
          });
      
          data_arr = that.data.quArr;
          data_id = that.data.quId;
         
        }
        
       
        for (var i = 0; i < res.data.data.length; i++) {
          data_arr.push(res.data.data[i].chinese);
          data_id.push(res.data.data[i].code01);
          if(data_type == 'province'){
            that.setData({
              shengArr: data_arr,
              shengId: data_id
            })
          }
          else if(data_type == 'city'){
            that.setData({
              shiArr: data_arr,
              shiId: data_id
            })
          }
          else if(data_type == 'district'){
            that.setData({
              quArr: data_arr,
              quId: data_id
            })
          }
       
          console.log('11111111111111====>>>>', res.data.data[i].chinese);
          console.log('22222222222222====>>>>', res.data.data[i].code01);
          // console.log('1111222223333333334444445555555555555====>>>>',that.data.area_province);
          // console.log('1111222223333333334444445555555555555====>>>>',that.data.area_city);
          // console.log('1111222223333333334444445555555555555====>>>>',that.data.area_district);

          if((data_type == 'province') && (that.data.area_province) ){
            if(res.data.data[i].chinese == that.data.area_province){
              var shengIndex001 = i;
              shengIndex001 ++;

              that.setData({
                shengIndex: shengIndex001

              });
              
              that.__get_china_data_list(res.data.data[i].code01, 'city');
              
              
              
            }
          }
          else if((data_type == 'city') && (that.data.area_city) ){
            if(res.data.data[i].chinese == that.data.area_city){
              var shiIndex001 = i;
              shiIndex001 ++;
              that.setData({
                shiIndex: shiIndex001

              });

              that.__get_china_data_list(res.data.data[i].code01, 'district');
            }
          }
          else if((data_type == 'district') && (that.data.area_district) ){
            if(res.data.data[i].chinese == that.data.area_district){
              var quIndex001 = i;
              quIndex001 ++;
              that.setData({
                quIndex: quIndex001

              });
            }
          }
          
          
        }
        
        console.log('this.shengArr', data_arr);
        console.log('this.shengId', data_id);
        
        
        
      },
      fail: function () {
        // fail
        uni.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  __get_address_item:function(){
    var that = this;
    
    if(!that.data.addressid){
      return;
    }
  
    var userInfo = app.get_user_info();
    if ((!userInfo) || (!userInfo.userid)) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return;
    } 
    
    var post_data = {
      action: 'get',
      addressid: that.data.addressid,
      checkstr: userInfo.checkstr,
      userid: userInfo.userid,
      sellerid: app.get_sellerid(),
    };
    console.log('8888888888888888======>>>>',that.data.addressid)
    this.__ajax_address_save(post_data, function(response_data){
      
      if(response_data.code != 1){
        return;
      }
      console.log('44444444444444444444444444444=======>>>>>>',response_data.data);
      that.data.address_detail = response_data.data;
      that.setData({
        name: that.data.address_detail.name,
        mobile: that.data.address_detail.mobile,

        //拿到地址对应id
        area_province : that.data.address_detail.area_province,
        area_city : that.data.address_detail.area_city,
        area_district : that.data.address_detail.area_district,
   
        address: that.data.address_detail.address,

      })
 
      console.log('111122222====>>>>',that.data.area_province);

      that.__get_china_data_list();
      
    });

  },

  __ajax_address_save:function(post_data, callback_function){
    var that = this;
    api.abotRequest({
      url: app.globalData.http_server + '?g=Yanyubao&m=ShopAppWxa&a=address_save',
      data: post_data,
      method: 'POST',
        success: function (res) {
        
        console.log(res);
        
        typeof callback_function == "function" && callback_function(res.data);
      }
    });
    
    
    
    
  },

  bindPickerChangeshengArr: function (e) {
    console.log(e);
  
    this.setData({
      shengIndex : e.detail.value,
    });	
    var code01 = this.data.shengIndex;
    var code03 = this.data.shengId;
    var code02 = code03[code01];
    
    var province = this.data.shengArr;
		this.setData({
      area_province :	province[code01]
    });	
		console.log('code02===>>>', code02);		
				
		console.log('当前选择的省的名字===>>>', this.data.area_province);
				
		this.__get_china_data_list(code02,'city');
  },

  bindPickerChangeshiArr: function (e) {
    console.log('eeeeeeeeeee==>>',e);
   
    this.setData({
      shiIndex : e.detail.value,
    });	
    var code01 = this.data.shiIndex;
    var code03 = this.data.shiId;
    var code02 = code03[code01];
    
    var city = this.data.shiArr;
		this.setData({
      area_city :	city[code01]
    });	
		console.log('code02===>>>', code02);		
				
		console.log('当前选择的市的名字===>>>', this.data.area_city);
	 
    this.__get_china_data_list(code02, 'district');
    
   
  },
  bindPickerChangequArr: function (e) {
    console.log('eeeeeeeeeee==>>',e);
   
    this.setData({
      quIndex : e.detail.value,
    });	
    var code01 = this.data.quIndex;
    var code03 = this.data.quId;
    var code02 = code03[code01];
    
    var district = this.data.quArr;
		this.setData({
      area_district :	district[code01]
    });	
		console.log('code02===>>>', code02);		
				
		console.log('当前选择的市的名字===>>>', this.data.area_district);
	 
  },

})