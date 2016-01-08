var $ 		 = require("zepto");
var api 	 = require("api/api");
var user 	 = require("kit/user");

var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试"
};

var model = function (options) {
	options = options || {};

	this.param  	= options.param || {};
	this.onValidate = options.onValidate || this.onValidate;
};

model.prototype.register = function (param, context) {
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

	api.send(api.USER, "register", options, this);
};

model.prototype.sendCode = function (param, context) {
	var options = {};

	options.data = {
		mobile: param.mobile,
		moduleId: "REGISTERIMAGE",
		imageCode: param.imageCode
	};

	options.success = function (e) {
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

	api.send(api.USER, "sendSmsCode", options, this);
};

model.prototype.checkMobile = function (param, context) {
	var options = {};

	options.data = {
		account: param.mobile
	};
	
	options.success = function (e) {
		var result = e.data;

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

	api.send(api.USER, "verifyAccountState", options, this);
};

module.exports = model;