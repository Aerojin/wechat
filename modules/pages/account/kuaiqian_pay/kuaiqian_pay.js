/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api				= require("api/api");
var moneyCny		= require("kit/money_cny");
var xnData			= require("kit/xn_data");
var validate 		= require("kit/validate");
var voucherResult  	= require("voucher_result");
var queryString 	= require("kit/query_string");
var loading 		= require("ui/loading_button/loading_button");
var tipMessage		= require("ui/tip_message/tip_message");
var loadingPage		= require("ui/loading_page/loading_page");

var kuaiqianPay = {

	TIPS: {
		SEND: "发送",
		RETRY: "重试",
		RETRY_FORMAT: "重试({0})"
	},

	init: function () {

		this.ui = {};
		this.ui.tip 			= $("#p-tip");
		this.ui.txtCode 		= $("#txt-code");
		this.ui.txtMobile 		= $("#txt-mobile");
		this.ui.chkAgree 		= $("#chk-agree");
		this.ui.btnSubmit 		= $("#btn-submit");
		this.ui.btnSendCode 	= $("#btn-sendCode");
		this.ui.wrapBin			= $("#wrap-bind");
		this.ui.btnDisSend 		= $("#btn-dis-send");
		this.ui.btnAgreement 	= $("#btn-agreement");
		this.ui.txtInput		= $(".txt-input");
		
		this.voucherData = xnData.create({
			key: xnData.STATE.DETAULT_KEY
		});

		this.queryString = this.voucherData.getData();

		this.regEvent();
		this.ui.tip.html(this.getText());

		if(this.queryString.isBound){
			this.step3();
		}else{
			loadingPage.hide();
		}
	},
	regEvent: function () {
		this.ui.btnSendCode.on("tap", $.proxy(function () {
			if(this.check(true)){
				this.step1();
				this.activeButton();
			}

			return false;
		}, this));

		this.ui.btnSubmit.on("tap", $.proxy(function () {
			if(this.check()){
				this.loading = loading(this.ui.btnSubmit);
				this.step2();
			}

			return false;
		}, this));

		this.ui.chkAgree.on("tap", $.proxy(function () {
			if(this.ui.chkAgree.hasClass('pact-on')){
				this.ui.chkAgree.removeClass('pact-on');
				this.ui.btnSubmit.addClass('oper-btn-gray');
			}else{
				this.ui.chkAgree.addClass('pact-on');
				this.ui.btnSubmit.removeClass('oper-btn-gray');
			}

			return false;
		}, this));

		this.ui.btnAgreement.on("tap", $.proxy(function (){
			window.location.href = "$root$/agreement/kuaiqian_agreement.html";

			return false;
		}, this));
	},
	step1: function () {
		var options = {
			data: this.queryString
		};

		options.data.mobile = this.ui.txtMobile.val();

		options.success = function (e) {
			this.queryString.inRecordNo = e.data;
		};

		options.error = function (e) {
			this.ui.btnSendCode.show();
			this.ui.btnDisSend.hide();
			tipMessage.show(e.msg || "网络异常,请稍后重试", {delay: 2500});
		};

		api.send(api.ACCOUNT, "firstPaySendSms", options, this);
	},
	step2: function () {
		var options = {
			data: this.queryString
		};

		options.data.mobile = this.ui.txtMobile.val();	
		options.data.validCode = this.ui.txtCode.val();

		options.success = function (e) {
			var result = e.data;

			var data = {
				success: true,
				amount: moneyCny.toFixed(options.data.totalAmount),
				bankcode: options.data.bankCode,
				account: options.data.bankCardNo,
				returnUrl: this.queryString.returnUrl,
			};
			
			voucherResult.init(data, loadingPage);
		};

		options.error = function (e) {
			var data = {
				success: false,
				message: encodeURIComponent(e.msg)
			};

			this.loading.close();
			voucherResult.init(data, loadingPage);
		};
		
		api.send(api.ACCOUNT, "firstBindCardPay", options, this);		
	},
	step3: function () {
		var options = {
			data: this.queryString
		};

		options.success = function (e) {
			var data = {
				success: true,
				amount: moneyCny.toFixed(options.data.totalAmount),
				bankcode: options.data.bankCode,
				account: options.data.bankCardNo,
				returnUrl: this.queryString.returnUrl,
			};

			voucherResult.init(data, loadingPage);
		};

		options.error = function (e) {
			var data = {
				success: false,
				message: encodeURIComponent(e.msg)
			};

			voucherResult.init(data, loadingPage);
		};
		
		api.send(api.ACCOUNT, "directPay", options, this);
	},
	check: function (sendCode) {
		var mobile = this.ui.txtMobile.val().trim();
		var code = this.ui.txtCode.val().trim();

		if(this.ui.btnSubmit.hasClass('oper-btn-gray') && !sendCode){
			return false;
		}

		if(validate.isEmpty(mobile)){
			tipMessage.show("请输入银行预留手机号", {delay: 2500});
			return false;
		}

		if(!validate.isMobile(mobile)){
			tipMessage.show("请输入有效的手机号", {delay: 2500});
			return false;	
		}

		if(sendCode){
			return true;
		}


		if(validate.isEmpty(code)){
			tipMessage.show("请输入短信验证码", {delay: 2500});
			return false;
		}

		return true;
	},
	getText: function () {
		var card = this.queryString.bankCardNo;
		var bankName = this.queryString.bankName;
		var money = moneyCny.toFixed(this.queryString.totalAmount);
		var name = decodeURIComponent(this.queryString.name);
		var text = "使用{0}尾号为{1}的{2}<br />充值 <span class='text-red'>{3}元</span>";

		card = card.substring(card.length - 4);
		name = "*{0}".format(name.substring(1));

		return text.format(name, card, bankName, money);
	},
	activeButton: function () {
		var _this = this;
		var number = 60;

		if(this.timer){
			clearInterval(this.timer);
		}

		this.ui.btnSendCode.hide();
		this.ui.btnDisSend.show().text(this.TIPS.RETRY_FORMAT.format(number));

		this.timer = setInterval(function() {
			number--;

			if(number == 0){
				clearInterval(_this.timer);
				_this.ui.btnSendCode.show();
				_this.ui.btnDisSend.hide();
			}	

			_this.ui.btnDisSend.text(_this.TIPS.RETRY_FORMAT.format(number));
		}, 1000);
	} 
};

loadingPage.show();
kuaiqianPay.init();