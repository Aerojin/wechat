# webchat
钱罐子APP对接接口


#关于参数说明
app登录web必传参数列表
```javascript
{
    firstLevelUp: false,    //会员是否首次升级
    loginName: "13926572774",   //手机号
    memberLevel: 3, //会员等级                                
    name: "金锐", //用户姓名
    qrCode: "http:www.xn.66/84e786c7-d70c-4529-a7e2-40b74bfa69d9.jpg", //二维码
    salesman: false, //是否是业务员
    token: "961bdf51-efad-41ae-8d0c-406be89b5452", //token登录凭证
    userId: "84e786c7-d70c-4529-a7e2-40b74bfa69d9" //用户ID
}
```

#原生调H5接口
```
1.产品列表
    /pages/product/app_hqb.html    //活期宝
	/pages/product/app_float.html  //浮动产品
	/pages/product/app_fixed.html //固定产品

2.投资记录
    proType = {
        "1": "固定产品"
        "2": "浮动产品"
    };   
    /pages/account/my_invest_record.html?proType=1  
	
3.我的活期宝
    /pages/account/my_hqb.html

4.我的红包
    /pages/account/my_redpacket.html
    
5.关于我们
	/pages/agreement/about.html

6.常见问题
	/pages/agreement/faq.html
7.佣金

8.快钱充值服务协议
	/pages/agreement/kuaiqian_agreement.html

9.银行额度说明
    /pages/account/bank_list.html

10.赎回记录   
	/pages/account/hqb_ransom_record.html
	
11.产品购买	
	productId: 产品ID
	/pages/product/buy.html?productId=
	
12.picc
	/pages/agreement/picc.html
	
13.钱罐子用户服务协议
	/pages/agreement/qgz_server_protocol.html
	
14.产品购买选择红包
	productId: 产品ID
	/pages/product/my_packet.html?productId=
	
15.产品购买详情页
	productId: 产品ID
	/pages/product/buy_detail.html?productId=
	
16.消息页面
	msgId: 消息ID
	/pages/sundry/information.html?msgId=
	
17.注册
	{
		mobile: 手机号
		referrer: 推荐人号码
		userId: 用户ID
	}
	/pages/user/nw_register.html?mobile=13926572773&referrer=13926572774

18.我的优惠
	/pages/account/my_coupon.html
	
19.好友关系链红包入口
	/pages/activity/relationRedpacket/postMoney.html

20.宝箱入口
	/activity/baoxiang/index.html 

21.今日预期收益入口
	/pages/account/my_income_today.html

22.投资累计收益入口
	/pages/account/my_income_list.html

23.活期宝购买页面
	productId: 产品ID
	/pages/product/buy_detail.html?productId=

24.咨询页面
	/pages/sundry/information_app.html
```

#H5调原生API参数说明
```
{
	refresh: 0=不刷新上级页面，1=刷新上级页面
	act：是H5发给Native，希望Native在响应时原封不动回传的内容，是可选参数
	callback: 原生回调H5中js的函数名，回调参数为json字符串，见App响应
}
```

#H5调原生API
```
1.登录
	xiaoniuapp://login
	
2.充值
	xiaoniuapp://recharge
	
3.设置交易密码
	xiaoniuapp://setPayPassword
	
4.忘记交易密码
	xiaoniuapp://forgotPayPassword
	
5.交易选择红包
	redirect: 返回url;
	xiaoniuapp://back?redirect=
	
6.显示产品列表
	type = {
		1: "固定收益"
		2: "浮动收益"
		3: "活期宝"
	}
	xiaoniuapp://showProductList?type=	
	
7.VIP升级接口
	xiaoniuapp://upgrade
	
8.返回我的活期宝
	xiaoniuapp://backToMyHuoQiBao
	
9.显示资金明细
	xiaoniuapp://showMyBalance?type=
	type = {
		0: "所有明细"
		1: "充值"
		2: "提现"
		3: "投资"
		4: "回款"
		5: "提现失败回充"
		6: "红包返现"
	}
	
10.忘记交易密码
	xiaoniuapp://setPayPassword

11.返回上一级页面
	xiaoniuapp://back?refresh=	
	refresh = {
		0: "不刷新上级页面"
		1: "刷新上级页面"
	}
	
12.去绑卡
	xiaoniuapp://bindCard

13.复制信息到剪贴板
	xiaoniuapp://copy?copyInfo=
	copyInfo: 待复制的信息，原生把此信息复制到剪贴板即可

14.关注微信公众号
	xiaoniuapp://fellowWechat?wechatId=
	wechatId: 微信公众号id，按现在app侧边栏的方式处理关注微信公众号

15.获取当前手机的基本信息
	入参
	{
		act：是H5发给Native，希望Native在响应时原封不动回传的内容，是可选参数
		callback: 原生回调H5中js的函数名，回调参数为json字符串，见App响应
	}
	
	返回：
	{
		code: 0,           //成功=0，未知错误=1，在msg里描述失败原因
		msg: "",
		data: {
			udid:”fdakfs-fdfd-fd-fdfdf-fd-fddf”,		 // 设备唯一标识
			platform:”ios”,	 // 设备平台（ios 或android）
			network:”wifi”, 	 // 网络类型,none指无网络，wifi指wifi环境，cellular指蜂窝移动数据
			systemVersion:”7.1”,	// 系统版本号
			deviceType:””,			// 设备类型，如iphone5
			act: “”        // 请求中的act参数，原样返回，如果请求中没传act，则此响应也没有act
		}
	}	
	
	xiaoniuapp://getBaseInfo?act=&callback=
	
16.微信分享
	入参
	{
		type：1=朋友圈，2=微信好友，0=让用户选择
		icon：分享icon的url
		title：标题
		desc：描述
		link：链接（适用于网页分享）
		imgUrl：分享的图片url（适用于图片分享，分享时，link和imgUrl二选一）
		act：是H5发给Native，希望Native在响应时原封不动回传的内容，是可选参数
		callback: 原生回调H5中js的函数名，回调参数为json字符串，见App响应
	}
	
	返回
	{
		code: 0,           //成功=0，未知错误=1，取消分享=2，在msg里描述失败原因
		msg: "",
		data: {
			act: ""        // 请求中的act参数，原样返回，如果请求中没传act，则此响应也没有act
		}
	}

	xiaoniuapp://wechatShare?type=&appid=&icon=&title=&desc=&link=&imgUrl=&act=&callback=
	
17.发送短信
	入参
	{
		act：是H5发给Native，希望Native在响应时原封不动回传的内容，是可选参数
		callback: 原生回调H5中js的函数名，回调参数为json字符串，见App响应
		to：接收短信的手机号码
		content：短信内容
	}
	
	返回
	{
		code: 0,           //成功=0，未知错误=1，用户取消=2，在msg里描述失败原因
		msg: “”,
		data: {
			act: “”        // 请求中的act参数，原样返回，如果请求中没传act，则此响应也没有act
		}
	}

	
	xiaoniuapp://sendSMS?act=&callback=&to=&content=
	
18.获取手机通讯录
	入参
	{
		act：是H5发给Native，希望Native在响应时原封不动回传的内容，是可选参数
		callback: 原生回调H5中js的函数名，回调参数为json字符串，见App响应
	}
	
	返回
	{
		code: 0,           //成功=0，未知错误=1，用户取消=2，在msg里描述失败原因
		msg: "",
		data: {
			act: ""        // 请求中的act参数，原样返回，如果请求中没传act，则此响应也没有act
		}
	}
	
	xiaoniuapp://syncAddressBook?act=&callback=

19.请求注册
	入参
	{
		act：是H5发给Native，希望Native在响应时原封不动回传的内容，是可选参数
		callback: 原生回调H5中js的函数名，回调参数为json字符串，见App响应
	}
	
	返回
	{
		code: 0,          //成功=0，未知错误=1，取消注册=2，在msg里描述失败原因
		msg: "",
		data: {
			userId: "",
			token: "",    
			loginName:"",		// 登录账号
			act: ""        // 请求中的act参数，原样返回，如果请求中没传act，则此响应也没有act
		}
	}
	
	xiaoniuapp://register?act=&callback=
	
20.显示首页
	xiaoniuapp://showHome
	
21.显示我的财富页面
	xiaoniuapp://showMyTreasure
	
22.显示消息中心
	xiaoniuapp://showMessageCenter?type=
	type = {
		0: 公告
		1: 我的消息
	}
	
23.显示在线客服
	xiaoniuapp://showOnlineService

24.拨打电话
	xiaoniuapp://phoneCall?phone=
	{phone:电话号码}

25.去提现
	xiaoniuapp://tixian

26.去密码管理
	xiaoniuapp://passwordManagement
```
