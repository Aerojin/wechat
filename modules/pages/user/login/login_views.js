var getDefaultUri	= require("kit/default_uri");
var tipMessage		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");
var loginModel 		= require("login_model");

var views = function (options) {
	
	this.param 		= options.param || {};
	this.redirect 	= options.redirect || false;

	this.ui = {};
	this.ui.txtMobile 	= options.txtMobile;
	this.ui.txtPassword = options.txtPassword;
	this.ui.btnSubmit 	= options.btnSubmit;

	this.init();
};

views.prototype.init = function () {

	this.model = new loginModel();
	this.model.onValidate = function (msg) {
		tipMessage.show(msg, {delay: 2000});
	};

	this.regEvent();
};

views.prototype.regEvent = function () {
	this.ui.btnSubmit.on("touchstart click", $.proxy(function () {
		var account  = this.ui.txtMobile.val().trim();
		var loginPwd = this.ui.txtPassword.val().trim();
		
		if(this.model.check(account, loginPwd)){
			this.loading = loading(this.ui.btnSubmit);
			this.login(account, loginPwd);
		}
		return false;
	}, this));
};

views.prototype.login = function (account, loginPwd) {
	var options = {};
		
	options.data = $.extend(this.param, {
		account: account,
		loginPwd: loginPwd
	});

	options.success = function (result) {
		this.loading.close();

		if(this.redirect){
			window.location.href = this.getRedirect({
				userId: result.userId,
				token: result.token,
				mobile: result.loginName
			});
			return;
		}

		/*change 已关联跳转至产品首页*/
		window.location.href = getDefaultUri();
	};

	options.error = function (result) {
		this.loading.close();
		tipMessage.show(result.msg, {delay: 2000});
	};

	this.model.login(options, this);
};

views.prototype.getRedirect = function (param) {
	return decodeURIComponent(this.redirect) + "?" + $.param(param);
};

module.exports = views;