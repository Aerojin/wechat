var xnData 		= require("kit/xn_data");
var validate 	= require("validate");
var defaultUri 	= require("default_uri");

/*
	设置回跳URL
	使用场景: 充值成功跳转到充值前的页面, 忘记交易密码后, 登录后等等
*/
var redirect = function () {
	var _this  	= this;
	var dataKey	= xnData.STATE.RECHARGE_KEY;
	var urlKey 	= "redirect";

	this.xnData = xnData.create({
		key: dataKey
	});

	this.set = function (url) {
		try{
			this.clear();
			this.xnData.set(urlKey, url || window.location.href);
		}catch(e){
			console && console.log(e);
		}
	};

	this.get = function () {
		var url = this.xnData.get(urlKey);

		if(!validate.isEmpty(url)){
			return url;
		}

		return defaultUri();
	};

	this.goto = function () {
		var url = this.get();

		this.clear();
		
		window.location.href = url;
	};

	this.clear = function () {
		this.xnData.clear(dataKey);
	};

	return this;
};

module.exports = redirect();