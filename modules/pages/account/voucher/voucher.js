/**
 * @require style.css  
 */
var $ 				= require("zepto");
var pay 			= require("pay");
var api				= require("api/api");
var moneyCny 		= require("kit/money_cny");
var xnData			= require("kit/xn_data");
var validate 		= require("kit/validate");
var smartbar		= require("ui/smartbar/smartbar");
var floatFormat		= require("kit/float_format");
var backConfig		= require("ui/bank_config/bank_config");
var loading 		= require("ui/loading_button/loading_button");
var tipMessage		= require("ui/tip_message/tip_message");

var voucher = {

	STATE: {
		"lian_lian": "lianlian",
		"kuai_qian": "kuaiqian",
		"1": "lianlian",
		"2": "kuaiqian"
	},

	PAY_METHOD: {
		"lianlian": "mobile_wap",
		"kuaiqian": "quick_pay"
	},

	PAY_TYPE: {
		"lianlian": "card_front",
		"kuaiqian": "direct"
	},

	TIPS: {
		RECHARGE: "充值金额{0}元",
		SYS_ERROR: "网络异常,请稍后重试",
		MONEY_EMPTY: "请输入金额(1~999,999)",
		LIMIT: "该银行充值最高限额:单笔{0}/单日{1}/{2}"
	},


	data: {},

	isBound: false, //是否绑卡

	init: function () {
		
		this.ui = {};
		this.ui.spanBalance = $("#span-balance");
		this.ui.txtMoney 	= $("#txt-money");
		this.ui.txtInput	= $(".txt-input");
		this.ui.btnSubmit 	= $("#btn-submit");
		this.ui.cardBox 	= $("#card-box");
		this.ui.divBound	= $(".div-bound");
		this.ui.divUnBound	= $(".div-unbound");

		this.smartbar = smartbar.create();

		this.rechargeData = xnData.create({
			key: xnData.STATE.RECHARGE_KEY
		});

		this.voucherData = xnData.create({
			key: xnData.STATE.DETAULT_KEY
		});

		this.regEvent();
		this.getBindInfo(); //获取绑定信息
		this.getUserAbleBalanceJson(); //获取账户余额

		this.voucherData.clear();
	},
	regEvent: function () {
		var _this = this;

		this.ui.btnSubmit.on("tap", $.proxy(function () {
			if(this.check()){
				this.submitInfo();
			}

			return false;
		}, this));

		this.ui.txtInput.on("input", $.proxy(function () {
			this.toggleButton();
		}, this));

		this.ui.txtMoney.on("input", function () {
			$(this).val(floatFormat.toFixed($(this).val(), 2));
		}); 

	},

	getBindInfo: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result 	 = e.data || {};
			var userCard = result.userCardData;
			var cardInfo = result.bankCodeData;

			if(userCard){
				this.isBound = true;
				
				this.ui.cardBox.show();
				this.ui.divBound.show();
				this.ui.divUnBound.hide();

            	this.data.bankCode 		= userCard["bank_code"];
				this.data.name  		= userCard["user_name"];
				this.data.bankName 		= userCard["bank_name"];
				this.data.bankCardNo	= userCard["user_card_no"];
				this.data.idCardNo  	= userCard["identity_card"];
				this.data.mobile 		= userCard["user_phone_no"];
				this.state 				= this.STATE[userCard["provider"]];

				this.ui.divBound.find('.span-limit').text(this.getLimitText(cardInfo));
				this.ui.cardBox.find(".card-ico").attr({src: backConfig.getBankIco(userCard["bank_code"])});
				this.ui.cardBox.find(".card-number").text(backConfig.getCardText(userCard["user_card_no"]));

				return;
			}

			this.getUserInfo();
		};

		options.error = function (e){
			this.getUserInfo();
		};
		
		api.send(api.ACCOUNT, "getUserBindCard", options, this);
	},
	getUserInfo: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data || {};

			this.data.name  		= result["userName"];
			this.data.idCardNo  	= result["identityCard"];
			this.data.mobile 		= result["userMobile"];
			this.data.bankCardNo	= result["bankCardNo"];
			this.data.bankName 		= result["bankName"];
			this.data.bankCode 		= result["bankCode"];
			this.state 				= this.STATE[result["provider"]];

			this.ui.cardBox.show();
			this.ui.cardBox.find(".card-ico").attr({src: backConfig.getBankIco(this.data.bankCode)});
			this.ui.cardBox.find(".card-number").text(backConfig.getCardText(this.data.bankCardNo));

			if(validate.isEmpty(this.data.mobile)){
				this.getMobileByUser();
			}
		};

		options.error = function (e) {
			var result = e.data;

			tipMessage.show(result.msg || this.TIPS.SYS_ERROR, {delay: 18000});
		};

		api.send(api.USER, "getIdentityInfoByUser", options, this);
	},

	toggleButton: function () {
		var money = this.ui.txtMoney.val().trim();

		if(money.length >= 1){
			this.ui.btnSubmit.removeClass('oper-btn-gray');
			return false;
		}

		this.ui.btnSubmit.addClass('oper-btn-gray');
	},
	getUserAbleBalanceJson: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data || 0;

			this.ui.spanBalance.text(moneyCny.toFixed(result));
		};

		options.error = function (e) {

		};
		
		api.send(api.ACCOUNT, "getAbleBalance", options, this);
	},

	getMobileByUser: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data || {};

			this.data.mobile = result || "";

		};

		options.error = function (e) {

		};
		
		api.send(api.USER, "getMobileByUser", options, this);
	},

	submitInfo: function () {
		var _this = this;

		this.loading = loading(this.ui.btnSubmit);

		/*
	        *获取支付信息
	  		*@param {data} data 初始化参数集
		    *@param {String} data.apiVersion    API版本
		    *@param {String} data.userId        用户id
		    *@param {String} data.name          用户真实姓名
		    *@param {String} data.idCardNo      身份证号码
		    *@param {String} data.mobile        手机号码
		    *@param {String} data.totalAmount   充值金额
		    *@param {String} data.bankCardNo    银行卡号
		    *@param {String} data.bankCode      银行编码
		    *@param {String} data.payMethod     支付渠道 快钱(wap、app) : quick_pay 连连wap : mobile_wap 连连app : mobile_app
		    *@param {String} data.payType       支付类型 direct-快钱支付; card_front-连连支付
		    *@param {String} data.itemName      商品描述
		*/

		var data = $.extend(this.data, {
			itemName: this.TIPS.RECHARGE.format(this.ui.txtMoney.val()),
			payType: this.PAY_TYPE[this.state],
			payMethod: this.PAY_METHOD[this.state],
			totalAmount: moneyCny.toHao(this.ui.txtMoney.val()),
			returnUrl: this.rechargeData.get("redirect")
		});

		if(this.data.mobile){
			data.mobile = this.data.mobile;
		}

		if(this.isBound){
			data.isBound = this.isBound;
		}

		this.rechargeData.clear();
		this.voucherData.setData(data);
		pay[window.state || this.state].pay.call(this, this.loading);		
	},
	check: function () {
		var money = parseInt(this.ui.txtMoney.val().trim());

		if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
			return false;
		}

		if(money < 1 || money > 999999){
			tipMessage.show(this.TIPS.MONEY_EMPTY, {delay: 18000});
			return false;
		}

		return true;
	},
	getLimitText: function (result) {
		var amount 		= moneyCny.toUnit(result.record_limit_amount);
		var dayAmount 	= moneyCny.toUnit(result.day_limit_amount);
		var monthAmount = Number(result.month_limit_amount) > 0 ? moneyCny.toUnit(result.month_limit_amount) : "单月无限额";


		return this.TIPS.LIMIT.format(amount, dayAmount, monthAmount);
	}

};

voucher.init();