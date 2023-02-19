# 通版商城：小程序商城源代码，含完整购物车、用户中心和订单管理

## 1 项目主页

项目的设置和使用说明发布在这里：

[https://yanyubao.tseo.cn/Supplier/ShopWxaMgr/index/setting_type/wxa_memo.html](https://yanyubao.tseo.cn/Supplier/ShopWxaMgr/index/setting_type/wxa_memo.html)

需要注册才能查看，使用手机号码登录即可。

## 2 问题与交流

使用上的问题和疑问，请用微信扫码查看其他开发者的提问和回复记录，也可以在文章末尾写留言。

<img src="http://www.tseo.cn/wp-content/uploads/2020/04/9be115d08294dd9f1eb588d52d662dde.png" width="150px">




## 3 关联项目

**延誉宝商城小程序**，商城源代码支持最新的微信小程序开放接口，包括使用open-data获取微信用户的头像和昵称信息等。

这个项目是小程序商城源码的下载，如果需要H5商城，请转到这个项目：
[https://github.com/longmix/shopmallmobile](https://github.com/longmix/shopmallmobile)

**商城的APP版本**源代码下载，包括Android和iOS两个版本，最新更新请到这个查询：
[http://www.abot.cn/source-code](http://www.abot.cn/source-code)

**商城小程序源码**包含完成的商城服务器API接口调用，只需要修改sellerid为自己的即可。最新版本的小程序源码，也可以GitHub上获取到。

`使用延誉宝小程序商城源代码，轻松搭建小程序商城，快速实现商城上线！`

## 4 快速入门

### 4.1 运行环境：

建议使用最新版本的小程序开发工具打开此项目。

### 4.2 查看在线演示：

[https://cms.weiduke.com/Wap/Index/index/token/vupytb1523940880.shtml](https://cms.weiduke.com/Wap/Index/index/token/vupytb1523940880.shtml)

以上网址为行业和案例汇总，选择进入小程序部分即可。

### 4.3 费用和价格

小程序源代码开源免费，修改和二次开发本本项目代码不需要支付任何授权费用。电商SaaS云可以根据需要选购，基础的698元年费基本可以满足日常的商城小程序运营需求。

具体的费用清单请在以下网址查看：

[http://www.abot.cn/yanyubaovip](http://www.abot.cn/yanyubaovip)

如果需要个性化报价，请使用智能报价系统，尽量不要联系在线客服 :)

[https://yanyubao.tseo.cn/Home/Supplier/price_sheet/ensellerid/pQNNmSkaq.html](https://yanyubao.tseo.cn/Home/Supplier/price_sheet/ensellerid/pQNNmSkaq.html)


### 4.4 如何安装商城系统？

#### 4.4.1 基于第三方平台部署（不需要任何开发）

要实现一键部署安装，不需要下载源代码，直接在延誉宝官网 **www.abot.cn** 注册账号，然后进入“CMS控制台”，绑定小程序后一键部署即可。（新用户需要支付99元的控制台使用费）

#### 4.4.2 独立部署（需要开发）

将src目录下的内容在小程序开发工具中运行即可，在微信小程序开发工具中修改代码，快速修改方式如下。

#### 4.4.3 如何修改为自己的商城，并替换成自己的商品？

打开项目的主目录，找到app.js文件，修改以下内容

```javascript
App({
  globalData:{
	  
   xiaochengxu_appid: 'wx00d1e2843c3b3f77', 
   shop_name:'又一个通版商城',
   default_sellerid: 'pQNNmSkaq', 
   
   force_sellerid: 1, 
   token:'inkqzh1493969716',
   sellerid: '',
   version_number: "1.2.0",
   kefu_telephone:"021-31128716",
   kefu_qq:"537086268",
   kefu_website:"www.abot.cn",
   kefu_gongzhonghao:"延誉宝",
   
   http_weiduke_server: 'https://cms.weiduke.com/',
   http_server: 'https://yanyubao.tseo.cn/',
   userInfo: {}
  },
```

1、将xiaochengxu_appid换成自己小程序Appid。

2、将shop_name改成自己的商城名称（小程序名称）。

3、default_sellerid换成自己的延誉宝商户编号。


如何获取自己的default_sellerid？[在这里 http://www.abot.cn 注册](http://www.abot.cn)，登录后即可拥有自己的default_sellerid。

其他的配置项都是客服信息等，请根据需要替换。

```
小程序的request合法域名请填写 *cms.weiduke.com* 和 *yanyubao.tseo.cn* ，
这两个域名都支持https，不需要再申请SSL证书。
如果需要定位和地图服务，还需要增加合法域名：*api.map.baidu.com*
```

#### 4.4.4 源代码目录结构

如下图，主要的功能代码在pages这个目录下。

![image](https://yanyubao.tseo.cn/uploads/sucai/shopmall_wxa_source_code_dir_list.png)

## 5 商城管理员后台使用说明

如何设置自己的店铺？快速获取管理员后台的使用说明，访问：[http://www.abot.cn/1053.html](http://www.abot.cn/1053.html)

## 6 二次开发帮助文档

在小程序的开发环境直接运行项目，通过调试器的网络控制台，可以随时查看即时的API请求接口和对应的参数。

如果现有代码提供的API接口请求不能满足项目开发需求，还可以参考以下API文档：

[http://www.abot.cn/yanyubao-api-shop](http://www.abot.cn/yanyubao-api-shop)

## 7 小程序商城预览图

![image](https://yanyubao.tseo.cn/uploads/sucai/shop_mall_mini_program_01.jpg)
![image](https://yanyubao.tseo.cn/uploads/sucai/shop_mall_mini_program_02.jpg)

## 8 模板选项和控制后台

开发过程中，尽可能保留服务器端推送的控制选项，这样可以在小程序发布后通过SaaS云控制台灵活调整小程序的内容。控制台截图如下：

![image](https://yanyubao.tseo.cn/uploads/sucai/shopmall_controller.png)


## 9 最新的小程序案例

### 9.1 小程序案例：

**[查看最近更新的小程序案例项目](https://yanyubao.tseo.cn/Home/Index/shop_hot_wxa_case/ensellerid/pQNNmSkaq?action=get_img_list)**


<img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx00d1e2843c3b3f77&path=pages%2Fyanyubao%2Fmodule_list&shortcode=pQNNmSkaq" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx00d1e2843c3b3f77&path=pages%2Fyanyubao%2Fmodule_list&shortcode=pQNNmSkaq" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxf0a7dd07b216e7c4&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx7f658980cc77be7a&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxe6565fced2f812da&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxa3bb810150eaa329&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx5c5ad69478ea55a5&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxe90a0f1df9f0cd3d&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx28ad86a01f2b8686&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx09f56729751245de&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxc9b249cf21550a8c&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx1308ed8ca5a77034&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxd8a071b9d01db5ad&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx5893c44fedf68232&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx3e00d15b00da5215&path=pages%2Findex%2FLiar&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxed9ef6b2c82742ce&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx00d1e2843c3b3f77&path=pages%2Findex%2FLiar&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxe58e345fe4196a7b&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxfe3d1545c88bfa44&path=pages%2Findex%2FLiar&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx00cf4388d2842342&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxf6afadf27189c7c1&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx1a6eb6e5b95d488a&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx3b4958c4ec41868f&path=pages%2Findex%2FLiar&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx080c94bac3e99d28&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxd4ab638ad39a3fe4&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx3cccd82499cf0482&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx8a3688b534df1fb3&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxf8d9a6d164fada19&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxda39e611e5af29d5&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx4b5776869b963bd4&path=pages%2Findex%2FLiar&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx428612e03dc50b42&path=pages%2Findex%2FLiar&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx3b96d83a469ad710&path=pages%2Findex%2FLiar&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxa53828c279fb3f9e&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wx6576af86ad5d4804&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxaf4e11b6b105b270&path=pages%2Findex%2Findex&shortcode=" width="150"><img src="https://yanyubao.tseo.cn/openapi/SupplierInfo/getwxacodeunlimit?appid=wxfc3ddf7ac2c59963&path=pages%2Findex%2Findex&shortcode=" width="150">

