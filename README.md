# 小程序商城源代码，含完整购物车、用户中心和订单管理

延誉商城小程序，商城源代码支持最新的微信小程序开放接口，包括使用open-data获取微信用户的头像和昵称信息等。

这个项目是小程序商城源码的下载，如果需要H5商城，请转到这个项目：[https://github.com/longmix/shopmallmobile](https://github.com/longmix/shopmallmobile)

商城的APP版本源代码下载，包括Android和iOS两个版本，最新更新请到这个查询：[http://www.abot.cn/source-code](http://www.abot.cn/source-code)

商城小程序源码包含完成的商城服务器API接口调用，只需要修改sellerid为自己的即可。最新版本的小程序源码，也可以GitHub上获取到。

`使用延誉宝小程序商城源代码，轻松搭建小程序商城，快速实现商城上线！`

## 快速入门

### 运行环境：

建议使用最新版本的小程序开发工具打开此项目。

### 查看在线演示：

![image](https://raw.githubusercontent.com/longmix/shopmallminiprogram/master/doc/gh_ef882fb581e9_258.jpg)


### 如何安装商城系统？

将src目录下的内容在小程序开发工具中运行即可，要实现一键部署安装，不需要下载源代码，直接在延誉宝网站注册账号，然后进入“CMS控制台”，绑定小程序后一键部署即可。

### 如何修改为自己的商城，并替换成自己的商品？

打开项目的主目录，找到ext.json文件，修改以下内容

```javascript
{
  "extEnable": true,
  "extAppid": "wx00d1e2843c3b3f77",
  "directCommit": false,
  "ext": {
    "name": "wechat",
    "attr": {
      "host": "open.weixin.qq.com",
      "users": [
        "user_1",
        "user_2"
      ]
    },
    "xiaochengxu_appid": "wx00d1e2843c3b3f77",
    "force_sellerid_flag": 0,
    "force_sellerid_value": "pQNNmSkaq"
  },
```

将extAppid、xiaochengxu_appid和force_sellerid_value设置为自己的即可。如何获取自己的sellerid？[在这里注册](http://www.abot.cn)，登录后即可拥有自己的sellerid。extAppid、xiaochengxu_appid是相同的，申请小程序的都可以看到。



## 商城管理员后台使用说明

如何设置自己的店铺？快速获取管理员后台的使用说明，访问：[http://www.abot.cn/1053.html](http://www.abot.cn/1053.html)

## 二次开发帮助文档

[http://www.abot.cn/yanyubao-api-shop](http://www.abot.cn/yanyubao-api-shop)

## 小程序商城预览图

![image](https://raw.githubusercontent.com/longmix/shopmallminiprogram/master/doc/shop_mall_mini_program_01.jpg)
![image](https://raw.githubusercontent.com/longmix/shopmallminiprogram/master/doc/shop_mall_mini_program_02.jpg)



