/**
 * @require style.css  
 */
var $ 				= require("zepto");
var user 			= require("kit/user");
var api				= require("api/api");
var validate 		= require("kit/validate");
var replaceMobile	= require("kit/replace_mobile");
var loading 		= require("ui/loading_button/loading_button");
var tipMessage		= require("ui/tip_message/tip_message");
var smartbar		= require("ui/smartbar/smartbar");

var findPay = {

	TIPS: {
		SHOW: "显示",
		HIDE: "隐藏",
		SEND: "发送",
		RETRY: "重试",
		RETRY_FORMAT: "重试({0})",
		SEND_MSG : "已发送验证码短信到号码{0}"
	},

	mobile: null,

	init: function () {

		this.ui = {};
		this.ui.tips 			= $("#tips");
		this.ui.txtCode			= $("#txt-code");
		this.ui.btnSubmit 		= $("#btn-submit");
		this.ui.btnSend 		= $("#btn-send");
		this.ui.btnDisSend 		= $("#btn-dis-send");

		smartbar.create();
		this.regEvent();
		this.activeButton();
		this.sendCode();
	},

	regEvent: function () {

		this.ui.btnSubmit.on("tap", $.proxy(function () {
			if(this.check()){
				this.loading = loading(this.ui.btnSubmit);
				this.nextStep();
			}
			
			return false;
		}, this));

		this.ui.btnSend.on("tap", $.proxy(function () {
			this.activeButton();
			
			this.sendCode();

			return false;
		}, this));

		this.ui.txtCode.on("input", $.proxy(function () {
			this.toggleButton();
		}, this));
	},

	sendCode: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			
		};

		options.error = function (e) {
			tipMessage.show(e.msg || "服务器繁忙, 请稍后重试", {delay: 2000});
		};

		api.send(api.USER, "sendSmsCodeByResetPayPwd", options, this);
	},

	activeButton: function () {
		var _this = this;
		var number = 60;
		var mobile = replaceMobile(user.get("loginName"));

		if(this.timer){
			clearInterval(this.timer);
		}
		
		this.ui.btnSend.hide();
		this.ui.tips.show().text(this.TIPS.SEND_MSG.format(mobile));			
		this.ui.btnDisSend.show().text(this.TIPS.RETRY_FORMAT.format(number));

		this.timer = setInterval(function() {
			number--;

			if(number == 0){
				clearInterval(_this.timer);
				_this.ui.tips.hide()
				_this.ui.btnSend.show();
				_this.ui.btnDisSend.hide();
			}	

			_this.ui.btnDisSend.text(_this.TIPS.RETRY_FORMAT.format(number));
		}, 1000);

	},

	nextStep: function () {
		var options = {};

		options.data = {						
			smsCode: this.ui.txtCode.val().trim()
		};

		options.success = function (e) {
			var result = e.data;

			this.loading.close();
			window.location.href = "$root$/account/findpay_password3.html?smsCode=" + result;
		};

		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || "服务器繁忙, 请稍后重试", {delay: 2000});
		};					

		api.send(api.USER, "verifySmsCodeByResetPayPwd", options, this);
	},

	toggleButton: function () {
		var code = this.ui.txtCode.val().trim();					

		if(code.length >= 4){
			this.ui.btnSubmit.removeClass('oper-btn-gray');
			return false;
		}

		this.ui.btnSubmit.addClass('oper-btn-gray');
	},


	check: function () {
		if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
			return false;
		}

		return true;
	}
};

findPay.init();