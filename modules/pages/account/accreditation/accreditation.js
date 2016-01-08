/**
 * @require style.css  
 */
 var $ 				= require("zepto");
 var api			= require("api/api");
 var xnData			= require("kit/xn_data");
 var validate 		= require("kit/validate");
 var select 		= require("ui/select/select");
 var idCardValidate	= require("kit/idcard_validate");
 var queryString 	= require("kit/query_string");
 var moneyCny 		= require("kit/money_cny");
 var redirect 		= require("kit/redirect");
 var smartbar		= require("ui/smartbar/smartbar");
 var backConfig		= require("ui/bank_config/bank_config");
 var loading 		= require("ui/loading_button/loading_button");
 var tipMessage		= require("ui/tip_message/tip_message");
 var loadingPage	= require("ui/loading_page/loading_page");
 var pay 			= require("pages/account/voucher/pay");

var TIPS = {
	SAVE_SUCCESS: "保存成功",
	RECHARGE: "充值金额{0}元",
	IDCARD_ERROR: "身份证格式错误",
	SYS_ERROR: "网络异常,请稍后重试",
	LIMIT_TIPS: "该银行充值最高限额: 单笔{0}/单日{1}/{2}"
};

var accreditation = {

	data: {},

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

	minAmount: 1,

	init: function () {

		this.ui = {};
		this.ui.cardForm 	= $("#card-form");
		this.ui.txtName 	= $("#txt-name");
		this.ui.txtIdCard 	= $("#txt-idcard");
		this.ui.txtCard 	= $("#txt-card");
		this.ui.txtAmount	= $("#txt-amount");
		this.ui.txtInput 	= $(".txt-input");
		this.ui.btnSave		= $("#btn-save");
		this.ui.divLimit  	= $("#div-limit");

		this.ui.divSelect 	= $("#div-select");
		this.ui.divCard 	= $("#div-card");
		this.ui.btnCancel 	= $("#btn-cancel");

		this.smartbar 	 = smartbar.create();
		this.voucherData = xnData.create({
			key: xnData.STATE.DETAULT_KEY
		});
		
		this.regEvent();
		this.getBank();
		this.getIdentityInfoByUser();
	},
	regEvent: function () {
		var _this = this;

		this.ui.btnSave.on("touchstart click", $.proxy(function () {
			if(this.check()){

				this.loading = loading(this.ui.btnSave);
				this.improveIdentityInfo();
			}

			return false;
		}, this));


		this.ui.txtInput.on("input", function () {
			_this.toggleButton();
		});

		this.ui.txtCard.on("change", $.proxy(function () {
			this.checkAccount();
		}, this));

		this.ui.txtCard.on("input", $.proxy(function () {
			var value = this.ui.txtCard.val().trim();
				value = value.replace(/(\d{4})/ig, "$1  ");

			if(value.length > 0){
				this.ui.divCard.show().text(value);
				return;
			}

			this.ui.divCard.hide();
		}, this));
	},

	check: function () {
		var card = this.ui.txtIdCard.val().trim();

		if(this.ui.btnSave.hasClass('oper-btn-gray')){
			return false;
		}

		if(!idCardValidate(card)){
			tipMessage.show(TIPS.IDCARD_ERROR, {delay: 2000});
			return false;
		}

		return true;
	},

	toggleButton: function () {
		var name = this.ui.txtName.val().trim();
		var card = this.ui.txtCard.val().trim();
		var idCard = this.ui.txtIdCard.val().trim();
		var amount = Number(this.ui.txtAmount.val().trim());

		if(name.length >= 2 && card.length >= 15 && idCard.length >= 18 && amount >= this.minAmount){
			this.ui.btnSave.removeClass('oper-btn-gray');
			return false;
		}

		this.ui.btnSave.addClass('oper-btn-gray');
	},
	getIdentityInfoByUser: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data;
				result.userName = result.userName.replace(/\d+/g,'');

			this.data.name  		= result["userName"];
			this.data.idCardNo  	= result["identityCard"];
			this.data.mobile 		= result["userMobile"];
			this.data.bankCardNo	= result["bankCardNo"];
			this.data.bankName 		= result["bankName"];
			this.data.bankCode 		= result["bankCode"];
			this.state 				= this.STATE[result["provider"]];

			this.toggleButton();
			this.setDataByUI(result);

			//实名认证后,姓名,身份证不能修改
			if(result.authentication){
				this.ui.txtName.attr("readonly", "readonly");
				this.ui.txtIdCard.attr("readonly", "readonly");
			}

			if(validate.isEmpty(this.data.mobile)){
				this.getMobileByUser();
			}

			loadingPage.hide();
		};

		options.error = function (e) {
			loadingPage.hide();
			this.toggleButton();
		};

		api.send(api.USER,"getIdentityInfoByUser", options, this);
	},

	improveIdentityInfo: function () {
		var options = {};

		options.data = {
			name: this.ui.txtName.val().trim(),
			idCardNo: this.ui.txtIdCard.val().trim(),
			bankCardNo: this.ui.txtCard.val().trim(),
			bankName: this.select.getSelected().bank_name,
			bankCode: this.select.getSelected().bank_code
		};

		options.success = function (e) {
			var result = e.data;

			this.data.bankCardNo	= options.data["bankCardNo"];
			this.data.bankName 		= options.data["bankName"];
			this.data.bankCode 		= options.data["bankCode"];
			
			this.submitInfo();
		};


		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 1800});
		};

		api.send(api.USER,"improveIdentityInfo", options, this);
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

	checkAccount: function () {
		var options = {};

		options.data = {
			//uid: XN.User.getData().uid,
			bankCardNo: this.ui.txtCard.val().trim()
		};

		options.success = function (e) {
			var result = e.data;
			var cardInfo = result["cardInfoData"];

			this.select.setDefaultKey("bank_code", cardInfo["bank_code"]);
		};

		options.error = function (e) {
			//console.log("error", e);
		};

		api.send(api.ACCOUNT, "getBankCardInfo", options, this);
	},

	setSelect: function (bankCode) {
		var _this = this;

		if(!this.select){
			this.timer = window.setTimeout(function () {
				_this.setSelect(bankCode);
			}, 50);

			return;
		}

		this.select.setDefaultKey("bank_code", bankCode);
	},

	initSelect: function (result) {
		var _this = this;
		var options = {
			data: result,
			container: this.ui.divSelect
		};

		this.select = new select(options);

		this.select.onChange = function (obj) {
			_this.data.bankcode = obj.bank_code;
		};
	},

	getBank: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data;

			for(var i = 0; i < result.list.length; i++){
				result.list[i].text = result.list[i].bank_name;
			}

			this.initSelect(result.list);
		};

		options.error = function (e) {
			tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 2000});
		};

		api.send(api.ACCOUNT, "queryBankList", options, this);
	},

	setDataByUI: function(result) {
		if(!validate.isEmpty(result.userName)){
			this.ui.txtName.val(result.userName);	
		}

		if(!validate.isEmpty(result.identityCard)){
			this.ui.txtIdCard.val(result.identityCard);	
		}

		if(!validate.isEmpty(result.bankCardNo)){
			this.ui.txtCard.val(result.bankCardNo);	
		}

		if(!validate.isEmpty(result.bankCode)){
			this.setSelect(result.bankCode);
		}

		this.ui.divLimit.text(this.getLimitText(result)).show();
	},

	submitInfo: function () {
		var _this = this;
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
			isBound: false,
			itemName: TIPS.RECHARGE.format(this.ui.txtAmount.val()),
			payType: this.PAY_TYPE[this.state],
			payMethod: this.PAY_METHOD[this.state],
			totalAmount: moneyCny.toHao(this.ui.txtAmount.val()),
			returnUrl: redirect.get()
		});

		if(this.data.mobile){
			data.mobile = this.data.mobile;
		}

		redirect.clear();
		this.voucherData.setData(data);
		pay[window.state || this.state].pay.call(this, this.loading);		
	},

	getLimitText: function (result) {
		var amount 		= moneyCny.toUnit(result.recordLimitAmount);
		var dayAmount 	= moneyCny.toUnit(result.dayLimitAmount);
		var monthAmount = Number(result.monthLimitAmount) > 0 ? moneyCny.toUnit(result.monthLimitAmount) : "单月无限额";

		if(result.recordLimitAmount){
			this.maxAmount = moneyCny.toYuan(result.recordLimitAmount);
		}

		return TIPS.LIMIT_TIPS.format(amount, dayAmount, monthAmount);
	}

};

loadingPage.show();
accreditation.init();