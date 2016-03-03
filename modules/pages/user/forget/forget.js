var $ 				= require("zepto");
var api 			= require("api/api");
var validate 		= require("kit/validate");
var queryString 	= require("kit/query_string");
var replaceMobile	= require("kit/replace_mobile");
var loading 		= require("ui/loading_button/loading_button");
var tipMessage		= require("ui/tip_message/tip_message");

var TIPS = {
	SEND: "发送",
	RETRY: "重试",
	RETRY_FORMAT: "重试({0})",
	SEND_MSG : "已发送验证码短信到号码{0}",
	CODE_EMPTY: "请输入验证码",
	IMAGE_EMPTY: "请输入图形验证码",
	MOBILE_EMPTY: "请输入手机号码",
	MOBILE_ERROR: "手机号必须是数字, 且长度为11位",	
	PASSWORD_EMPTY: "请输入新的登录密码",
	PASSWORD_LEN: "登录密码长度不能小于6位",
	CONFIRM_PWD_EMPTY: "请输入确认密码",
	PASSWORD_ERROR: "两次密码不一致,请重新输入",
	SYS_ERROR: "网络异常,请稍后重试"
};

var forget = {

	init: function () {
		this.ui = {};
		this.ui.tips 			= $("#tips");
		this.ui.txtCode			= $("#txt-code");
		this.ui.txtPassword1 	= $("#txt-password1");
		this.ui.txtPassword2	= $("#txt-password2");
		this.ui.btnSubmit 		= $("#btn-submit");
		this.ui.btnSend 		= $("#btn-send");
		this.ui.txtMobile		= $("#txt-mobile");
		this.ui.btnDisSend 		= $("#btn-dis-send");
		this.ui.txtImgCode		= $("#txt-imgCode");
		this.ui.btnCode			= $("#btn-code");

		this.queryString = queryString();
		this.ui.txtMobile.val(this.queryString.mobile || "");
		this.ui.btnCode.attr({"src": this.getImageCodeUri()});

		this.regEvent();
	},
	regEvent: function () {
		this.ui.btnSubmit.on("tap", $.proxy(function () {
			if(this.check()){
				this.loading = loading(this.ui.btnSubmit);
				this.forget();
			}

			return false;
		}, this));
		
		this.ui.btnSend.on("tap", $.proxy(function () {
			if(this.check({chechMobiel: true})){
				this.activeButton();
				this.sendCode();
			}
			return false;
		}, this));

		this.ui.btnCode.on("touchstart click", $.proxy(function () {
			this.ui.btnCode.attr({"src": this.getImageCodeUri()});

			return false;
		}, this));
	},
	forget: function () {
		var options = {};

		options.data = {
			mobile: this.ui.txtMobile.val().trim(),
			smsCode: this.ui.txtCode.val().trim(),
			newLoginPwd: this.ui.txtPassword1.val().trim()
		};

		options.success = function (e) {
			var result = e.data || {};

			this.loading.close();
			
			if(this.queryString.redirect){
				window.location.href = decodeURIComponent(this.queryString.redirect);

				return;
			}

			window.location.href = "$root$/user/login.html?mobile=" + this.queryString.mobile;
		};

		options.error = function (e) {
			var result = e.data || {};

			this.loading.close();

			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
		};

		api.send(api.USER, "resetLoginPwd", options, this);
	},
	sendCode: function () {
		var options = {};

		options.data = {
			moduleId: "RESETLOGINIMAGE",
			mobile: this.ui.txtMobile.val().trim(),
			imageCode: this.ui.txtImgCode.val().trim()
		};

		options.success = function () {
			
		};

		options.error = function (e) {
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
		};

		api.send(api.USER, "sendSmsCode", options, this);
	},
	getImageCodeUri: function () {
		var protocol = window.location.origin;
		var path 	 = "/api/wap/randomImageCode?appVersion=1&moduleId=RESETLOGINIMAGE&source=web&r={0}";

		return protocol + path.format(Math.random());
	},
	activeButton: function () {
		var number = 60;
		var mobile = replaceMobile(this.queryString.mobile);

		if(this.timer){
			clearInterval(this.timer);
		}

		this.ui.btnSend.hide();
		this.ui.tips.show().text(TIPS.SEND_MSG.format(mobile));
		this.ui.btnDisSend.show().text(TIPS.RETRY_FORMAT.format(number));

		this.timer = setInterval($.proxy(function() {
			number--;

			if(number == 0){
				clearInterval(this.timer);
				this.ui.tips.hide()
				this.ui.btnSend.show();
				this.ui.btnDisSend.hide();
			}	

			this.ui.btnDisSend.text(TIPS.RETRY_FORMAT.format(number));
		}, this), 1000);
	},
	check: function (options) {
		var code = this.ui.txtCode.val().trim();
		var mobile = this.ui.txtMobile.val().trim();
		var password1 = this.ui.txtPassword1.val().trim();
		var password2 = this.ui.txtPassword2.val().trim();
		var imgCode = this.ui.txtImgCode.val().trim();

		if(validate.isEmpty(mobile)){
			tipMessage.show(TIPS.MOBILE_EMPTY, {delay: 2000});

			return false;
		}

		if(!validate.isMobile(mobile)){
			tipMessage.show(TIPS.MOBILE_ERROR, {delay: 2000});

			return false;	
		}

		if(validate.isEmpty(imgCode)){
			tipMessage.show(TIPS.IMAGE_EMPTY, {delay: 2000});

			return false;		
		}

		if(options && options.chechMobiel){
			return true;
		}

		if(validate.isEmpty(code)){
			tipMessage.show(TIPS.CODE_EMPTY, {delay: 2000});
			return false;
		}

		if(validate.isEmpty(password1)){
			tipMessage.show(TIPS.PASSWORD_EMPTY, {delay: 2000});
			return false;
		}

		if(validate.minLength(password1, 6)){
			tipMessage.show(TIPS.PASSWORD_LEN, {delay: 2000});
			return false;
		}


		if(validate.isEmpty(password2)){
			tipMessage.show(TIPS.CONFIRM_PWD_EMPTY, {delay: 2000});
			return false;
		}

		if(password1 != password2){
			tipMessage.show(TIPS.PASSWORD_ERROR, {delay: 2000});
			return false;	
		}


		return true;
	}
};

forget.init();