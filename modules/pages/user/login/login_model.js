var $ 		 = require("zepto");
var api 	 = require("api/api");
var user 	 = require("kit/user");
var validate = require("kit/validate");

var TIPS = {
	MOBILE_EMPTY: "请输入手机号码",
	MOBILE_ERROR: "手机号必须是数字, 且长度为11位",	
	SYS_ERROR: "网络异常,请稍后重试",
	PASSWORD_EMPTY: "请输入您的登录密码"
};

var model = function (options) {
	options = options || {};

	this.param  	= options.param || {};
	this.onValidate = options.onValidate || this.onValidate;
};

model.prototype.login = function (param, context) {
	var options = {
		data: $.extend(this.param, param.data)
	};

	options.success = function (e) {
		user.setData(e.data);
		
		if(param.success){
			param.success.call(context || this, e.data);
		}
	};

	options.error = function (e) {
		e.msg = e.msg || TIPS.SYS_ERROR;

		if(param.error){
			param.error.call(context || this, e);
		}
	};

	api.send(api.USER, "login", options, this);
};

model.prototype.check = function (account, loginPwd) {
	var mobile 	 = account.trim();
	var password = loginPwd.trim();

	if(validate.isEmpty(mobile)){
		this.onValidate(TIPS.MOBILE_EMPTY);

		return false;
	}

	if(!validate.isMobile(mobile)){
		this.onValidate(TIPS.MOBILE_ERROR);

		return false;	
	}

	if(validate.isEmpty(password)){
		this.onValidate(TIPS.PASSWORD_EMPTY);
		return false;
	}

	return true;
};

model.prototype.onValidate = function () {

};


module.exports = model;