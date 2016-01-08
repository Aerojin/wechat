/**
 * @require style.css  
 */
var $ 				= require("zepto");
var pay 			= require("pay");
var api				= require("api/api");
var moneyCny 		= require("kit/money_cny");
var xnData			= require("kit/xn_data");
var validate 		= require("kit/validate");
var redirect 		= require("kit/redirect");
var smartbar		= require("ui/smartbar/smartbar");
var floatFormat		= require("kit/float_format");
var backConfig		= require("ui/bank_config/bank_config");
var loading 		= require("ui/loading_button/loading_button");
var tipMessage		= require("ui/tip_message/tip_message");
var dialogsPwd 		= require("ui/dialogs_password/dialogs_password");
var loadingPage		= require("ui/loading_page/loading_page");

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
		MIN_TIPS: "充值金额{0}元起",
		SYS_ERROR: "网络异常,请稍后重试",
		MONEY_EMPTY: "请输入金额(1~999,999)",
		MAX_TIPS: "单笔充值金额最多为{0}，请重新输入",
		LIMIT: "单笔{0}，单日限额{1}",
		CARD_INFO: "{0}（{1}）"

	},


	data: {},

	isBound: false, //是否绑卡

	minAmount: 100, //最小充值金额

	maxAmount: 50000, //默认最大单笔充值金额

	init: function () {
		
		this.ui = {};
		this.ui.pTips 		= $("#p-tips");
		this.ui.spanBalance = $("#span-balance");
		this.ui.txtMoney 	= $("#txt-money");
		this.ui.btnSubmit 	= $("#btn-submit");
		this.ui.cardBox 	= $("#card-box");
		this.ui.divBound	= $(".div-bound");
		this.ui.divUnBound	= $(".div-unbound");

		this.smartbar = smartbar.create();

		this.voucherData = xnData.create({
			key: xnData.STATE.DETAULT_KEY
		});

		loadingPage.show();
		this.regEvent(); //注册事件
		this.getBindInfo(); //获取绑定信息
		this.getUserAbleBalanceJson(); //获取账户余额

		this.voucherData.clear();
		this.toggleButton(); //初始化按钮
	},
	regEvent: function () {
		var _this = this;

		this.ui.btnSubmit.on("tap", $.proxy(function () {
			if(this.check()){
				if(this.state == this.STATE["lian_lian"]){
					this.submitInfo();

					return false;
				}

				this.showPwdDialogs();			
			}

			return false;
		}, this));

		this.ui.txtMoney.on("input", function () {
			var amount = floatFormat.toFixed($(this).val(), 2);

			$(this).val(amount);

			_this.toggleButton();
		}); 

	},

	getBindInfo: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result 	 = e.data || {};
			//var userCard = result.userCardData;
			//var cardInfo = result.bankCodeData;

			if(result){
				this.ui.cardBox.show();
				this.ui.divBound.show();
				this.ui.divUnBound.hide();

            	this.data.bankCode 		= result["bankCode"];
				this.data.name  		= result["userName"];
				this.data.bankName 		= result["bankName"];
				this.data.bankCardNo	= result["userCardNo"];
				this.data.idCardNo  	= result["identityCard"];
				this.data.mobile 		= result["userPhoneNo"];
				this.state 				= this.STATE[result["provider"]];
				this.isBound 			= !result.providerFirstPay;

				this.ui.cardBox.find('.p-limit').text(this.getLimitText(result)).show();
				this.ui.cardBox.find(".card-ico").attr({src: backConfig.getBankIco(result["bankCode"])});
				this.ui.cardBox.find(".card-info").text(this.TIPS.CARD_INFO.format(result["bankName"], backConfig.getCardText(result["userCardNo"])));

				loadingPage.hide();
				return;
			}

			this.getUserInfo();
		};

		options.error = function (e){
			this.getUserInfo();			
		};
		
		api.send(api.ACCOUNT, "getUserBindCardNew", options, this);
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
			this.ui.cardBox.find(".card-info").text(this.TIPS.CARD_INFO.format(this.data.bankName, backConfig.getCardText(this.data.bankCardNo)));

			if(validate.isEmpty(this.data.mobile)){
				this.getMobileByUser();
			}

			loadingPage.hide();
		};

		options.error = function (e) {
			var result = e.data;

			loadingPage.hide();
			tipMessage.show(result.msg || this.TIPS.SYS_ERROR, {delay: 18000});
		};

		api.send(api.USER, "getIdentityInfoByUser", options, this);
	},

	toggleButton: function () {
		var money = Number(this.ui.txtMoney.val().trim());

		if(money < this.minAmount){
			this.ui.btnSubmit.addClass("oper-btn-gray");
			this.ui.pTips.text(this.TIPS.MIN_TIPS.format(this.minAmount));

			return;
		}

		if(money > this.maxAmount){
			var amount = moneyCny.toUnit(this.maxAmount, 0, true);
			
			this.ui.btnSubmit.addClass("oper-btn-gray");
			this.ui.pTips.text(this.TIPS.MAX_TIPS.format(amount));

			return;
		}

		this.ui.pTips.text("");
		this.ui.btnSubmit.removeClass('oper-btn-gray');
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

	showPwdDialogs: function () {
		var _this = this;

		if(!this.dialogsPwd){
			this.dialogsPwd = dialogsPwd.create({			
				onUpdate: function (result)  {
					_this.dialogsPwd.showLoading();
					_this.verifyPayPwd(result);
					//_this.dialogsPwd.close();
				},
				onClose: function () {
					//_this.loading.close();
				}
			});

			return;
		}

		this.dialogsPwd.show();
	},

	verifyPayPwd: function (pwd) {
		var options = {
			data: {
				payPwd: pwd
			}
		};

		options.success = function (e) {
			var result = e.data || {};

			if(result){
				this.submitInfo();
				return;
			}

			_this.dialogsPwd.hide();
		};

		options.error = function (e) {
			this.dialogsPwd.resetValue();
			this.dialogsPwd.hideLoading();
			tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 1800});
		};
		
		api.send(api.USER, "verifyPayPwd", options, this);
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
			returnUrl: redirect.get()
		});

		if(this.data.mobile){
			data.mobile = this.data.mobile;
		}

		if(this.isBound){
			data.isBound = this.isBound;
		}

		redirect.clear();
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
		var amount 		= moneyCny.toUnit(result.recordLimitAmount);
		var dayAmount 	= moneyCny.toUnit(result.dayLimitAmount);
		var monthAmount = Number(result.monthLimitAmount) > 0 ? moneyCny.toUnit(result.monthLimitAmount) : "单月无限额";

		if(result.recordLimitAmount){
			this.maxAmount = moneyCny.toYuan(result.recordLimitAmount);
		}

		return this.TIPS.LIMIT.format(amount, dayAmount);
	}

};

voucher.init();