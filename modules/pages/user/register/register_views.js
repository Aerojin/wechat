var $ 				= require("zepto");
var validate 		= require("kit/validate");
var getDefaultUri	= require("kit/default_uri");
var replaceMobile	= require("kit/replace_mobile");
var tipMessage		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");
var registerModel	= require("register_model");

var TIPS = {
	SHOW: "显示",
	HIDE: "隐藏",
	SEND: "发送",
	RETRY: "重试",
	RETRY_FORMAT: "重试({0})",
	REG_SUCCESS: "注册成功",
	CODE_EMPTY: "请输入手机验证码",
	IMAGE_EMPTY: "请输入图形验证码",
	SEND_MSG : "已发送验证码短信到号码{0}",
	SYS_ERROR: "网络异常,请稍后重试",
	MOBILE_EMPTY: "请输入手机号码",
	MOBILE_ERROR: "手机号必须是数字, 且长度为11位",	
	PASSWORD_EMPTY: "请输入您的登录密码",
	PASSWORD_LEN: "登录密码长度不能小于6位",
	MOBILE_EXIST: "该手机号已经注册, 请直接登录"
};


var views = function (options) {
	options = options || {};

	this.oldUser 	= false;
	this.showPass 	= false;
	this.param 		= options.param || {};	
	this.redirect 	= options.redirect || false;

	this.ui = {};
	this.ui.txtCode 		= options.txtCode;
	this.ui.txtMobile 		= options.txtMobile;
	this.ui.txtPassword1 	= options.txtPassword1;
	this.ui.txtPassword2 	= options.txtPassword2;
	this.ui.txtRecommend 	= options.txtRecommend;
	this.ui.btnSubmit 		= options.btnSubmit;
	this.ui.btnSend 		= options.btnSend;
	this.ui.btnDisSend 		= options.btnDisSend;
	this.ui.btnShowPass 	= options.btnShowPass;
	this.ui.txtImgCode 		= options.txtImgCode;
	this.ui.btnCode			= options.btnCode;

	this.init();
};

views.prototype.init = function () {
	this.model = new registerModel();

	this.ui.txtMobile.val(this.param.mobile || "");	
	this.ui.txtRecommend.val(this.param.referrer || "");
	this.ui.btnCode.attr({"src": this.getImageCodeUri()});

	this.regEvent();
};

views.prototype.regEvent = function () {
	this.ui.btnSubmit.on("touchstart click", $.proxy(function () {
		if(this.check()){
			this.loading = loading(this.ui.btnSubmit);
			this.register();
		}

		return false;
	}, this));
	
	this.ui.btnSend.on("touchstart click", $.proxy(function () {
		if(this.check({checkMobile: true})){
			this.activeButton();
			
			this.checkMobile();
		}

		return false;
	}, this));

	this.ui.txtPassword1.on("input", $.proxy(function () {
		this.ui.txtPassword2.val(this.ui.txtPassword1.val());
	}, this));

	this.ui.txtPassword2.on("input", $.proxy(function () {
		this.ui.txtPassword1.val(this.ui.txtPassword2.val());	
	}, this));

	this.ui.btnShowPass.on("touchstart click", $.proxy(function () {
		if(this.showPass){
			this.showPass = false;
			this.ui.txtPassword1.show();
			this.ui.txtPassword2.hide();
			this.ui.btnShowPass.text(TIPS.SHOW);
		}else{
			this.showPass = true;
			this.ui.txtPassword1.hide();
			this.ui.txtPassword2.show();
			this.ui.btnShowPass.text(TIPS.HIDE);
		}

		return false;
	},this));

	this.ui.txtMobile.on("input", $.proxy(function () {
		this.oldUser = false;
	}, this));
	
	this.ui.btnCode.on("touchstart click", $.proxy(function () {
		this.ui.btnCode.attr({"src": this.getImageCodeUri()});

		return false;
	}, this));
};

views.prototype.sendCode = function () {
	var options = {
		mobile: this.ui.txtMobile.val().trim(),
		imageCode: this.ui.txtImgCode.val().trim()
	};

	options.success = function () {
		
	};

	options.error = function (e) {
		tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
	};

	this.model.sendCode(options, this);
};

views.prototype.activeButton = function () {
	var _this = this;
	var number = 60;
	var mobile = replaceMobile(this.ui.txtMobile.val().trim());

	if(this.timer){
		clearInterval(this.timer);
	}
	
	this.ui.btnSend.hide();					
	this.ui.btnDisSend.show().text(TIPS.RETRY_FORMAT.format(number));

	this.timer = setInterval(function() {
		number--;

		if(number == 0){
			clearInterval(_this.timer);							
			_this.ui.btnSend.show();
			_this.ui.btnDisSend.hide();
		}	

		_this.ui.btnDisSend.text(TIPS.RETRY_FORMAT.format(number));
	}, 1000);
};

views.prototype.register = function () {
	var options = {};

	options.data = $.extend(this.param, {
		smsCode: this.ui.txtCode.val(),
		account: this.ui.txtMobile.val().trim(),
		referrer: this.ui.txtRecommend.val().trim(),
		loginPwd: this.ui.txtPassword1.val().trim(),
		referrerUId: this.param.userId
	});


	if($.fn.cookie("keyword")){
		options.data.keyword = decodeURIComponent($.fn.cookie("keyword"));
	}

	if($.fn.cookie("regChannel")){
		options.data.regChannel = $.fn.cookie("regChannel");
	}

	options.success = function (result) {
		this.loading.close();
		tipMessage.show(TIPS.REG_SUCCESS, {delay: 2000});

		this.onSuccess(result);		
	};

	options.error = function (e) {
		this.loading.close();
		tipMessage.show(e.msg, {delay: 2000});
	};

	this.model.register(options, this);
};

views.prototype.checkMobile = function () {
	var options = {
		mobile: this.ui.txtMobile.val().trim()
	};
	
	options.success = function (result) {
		if(!result){
			this.oldUser = true;
			//this.ui.tips.show();
		}else{
			this.oldUser = false;
			this.sendCode();
		}

		this.onCheckMobile(this.oldUser);
	};

	options.error = function (e) {
		tipMessage.show(e.msg, {delay: 2000});
	};

	this.model.checkMobile(options, this);
};

views.prototype.getRedirect = function (obj) {
	var path 	= "";
	var param 	= "";
	var url 	= decodeURIComponent(this.redirect);

	if(url.indexOf("?") > -1){
		param 	= url.substring(url.indexOf("?") + 1);
		path 	= url.substring(0, url.indexOf("?"));

		return  path + "?" + param + "&" + $.param(obj);
	}

	return url + "?" + $.param(obj);
};

views.prototype.checkImageCode = function () {
	if(!this.ui.txtImgCode || !this.ui.btnCode){
		return false;
	}

	var imgCode = this.ui.txtImgCode.val().trim();

	return validate.isEmpty(imgCode);
};

views.prototype.getImageCodeUri = function () {
	var protocol = window.location.origin;
	var path 	 = "/api/wap/randomImageCode?appVersion=1&moduleId=REGISTERIMAGE&source=web&r={0}";

	return protocol + path.format(Math.random());
};

views.prototype.check = function (options) {
	var code = this.ui.txtCode.val().trim();
	var mobile = this.ui.txtMobile.val().trim();
	var password = this.ui.txtPassword1.val().trim();

	if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
		return false;
	}

	if(validate.isEmpty(mobile)){
		tipMessage.show(TIPS.MOBILE_EMPTY, {delay: 2000});

		return false;
	}

	if(!validate.isMobile(mobile)){
		tipMessage.show(TIPS.MOBILE_ERROR, {delay: 2000});

		return false;	
	}

	if(this.checkImageCode()){
		tipMessage.show(TIPS.IMAGE_EMPTY, {delay: 2000});

		return false;		
	}
	

	if(this.oldUser){
		this.onCheckMobile(this.oldUser);
		tipMessage.show(TIPS.MOBILE_EXIST, {delay: 2000});

		return false;
	}

	if(options && options.checkMobile){				
		return true;
	}			

	if(validate.isEmpty(password)){
		tipMessage.show(TIPS.PASSWORD_EMPTY, {delay: 2000});
		return false;
	}

	if(validate.minLength(password, 6)){
		tipMessage.show(TIPS.PASSWORD_LEN, {delay: 2000});

		return false;
	}

	if(validate.isEmpty(code)){
		tipMessage.show(TIPS.CODE_EMPTY, {delay: 2000});
		return false;
	}		

	return true;
};

views.prototype.complete = function (result) {
	if(this.param.isDownload){
		window.location.href = "$root$/sundry/download_v2.html";
		return;
	}
	
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

views.prototype.onCheckMobile = function () {

};

views.prototype.onSuccess = function (result) {
	this.complete(result);
};


module.exports = views;
