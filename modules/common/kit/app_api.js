/*
	参数说明
	{	
		redirect: 跳转URL
		refresh: 0=不刷新上级页面，1=刷新上级页面
		act：是H5发给Native，希望Native在响应时原封不动回传的内容，是可选参数
		callback: 原生回调H5中js的函数名，回调参数为json字符串，见App响应
	}

	1.登录
	xiaoniuapp://login
	2.充值
		xiaoniuapp://recharge
	3.设置交易密码
		xiaoniuapp://setPayPassword
	4.忘记交易密码
		xiaoniuapp://forgotPayPassword
	5.交易选择红包
		refresh ={
			0: 不刷新上级页面
			1: 刷新上级页面
		};
		xiaoniuapp://back?refresh=
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

*/
var URL = {
	LOGIN: "xiaoniuapp://login",
	PAY_PWD: "xiaoniuapp://setPayPassword",
	FORGET_PAY_PWD: "xiaoniuapp://forgotPayPassword",
	BACK: "xiaoniuapp://back",
	RECHARGE: "xiaoniuapp://recharge",
	PRODUCT_LIST: "xiaoniuapp://showProductList",
	VIP_UPGRADE: "xiaoniuapp://upgrade",
	BACK_HQB: "xiaoniuapp://backToMyHuoQiBao",
	WECHAT_SHARE: "xiaoniuapp://wechatShare"
};

module.exports = {
	getUrl : function (key) {
		if(URL[key]){
			return URL[key];
		}

		return URL.LOGIN;
	},

	getLogin: function (param) {
		var key = "LOGIN";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getBack: function (param) {
		var key = "BACK";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getRecharge: function (param) {
		var key = "RECHARGE";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getPayPassword: function (param) {
		var key = "PAY_PWD";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getForgetPayPassword: function (param) {
		var key = "FORGET_PAY_PWD";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getProductList: function (param) {
		var key = "PRODUCT_LIST";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getVipUpgrade: function (param) {
		var key = "VIP_UPGRADE";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getBackHqb: function (param) {
		var key = "BACK_HQB";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},

	getShareApi: function (param) {
		var key = "WECHAT_SHARE";
		var url = this.getUrl(key);

		return this.handleParam(url, param);
	},
	

	handleParam: function (url, param) {
		if(param){
			return url + "?" + $.param(param);
		}

		return url;
	}
};