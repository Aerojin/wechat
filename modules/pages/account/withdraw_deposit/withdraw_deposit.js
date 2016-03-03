/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api				= require("api/api");
var moneyCny 		= require("kit/money_cny");
var validate 		= require("kit/validate");
var serverTime 		= require("kit/server_time");
var smartbar		= require("ui/smartbar/smartbar");
var floatFormat		= require("kit/float_format");
var backConfig		= require("ui/bank_config/bank_config");
var tipMessage		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");
var dialogsPwd 		= require("ui/dialogs_password/dialogs_password");

 var deposit = {
 	
 	TIPS: {
		SYS_ERROR: "网络异常,请稍后重试",
		MONEY_EMPTY: "请输入提现金额",
		MONEY_ERROR: "提现金额必须是数字且大于0",
		MONEY_ERROR1: "提现金额不能大于余额",
		DATE_TIPS: "预计{0}到账",
		DEPOSIT_TIPS1: "本月还能免费提现{0}次",
		DEPOSIT_TIPS2: "本次提现将收取{0}元手续费"
	},

 	init: function () {

 		this.ui = {};
 		this.ui.wrap 		= $("#wrap");
 		this.ui.wrapLoading = $("#wrap-loading");
		this.ui.spanBalance = $("#span-balance");
		this.ui.txtMoney 	= $("#txt-money");
		this.ui.txtInput	= $(".txt-input");
		this.ui.btnSubmit 	= $("#btn-submit");
		this.ui.spanDate	= $("#span-date");
		this.ui.cardBox 	= $("#card-box");
		this.ui.spanLimit	= $("#span-limit");

		this.setDate();
		this.getWithdrawBankCard();
 		this.getUserAbleBalanceJson();

 		this.smartbar = smartbar.create();

 		this.regEvent();
 	},

 	regEvent: function () {
		var _this = this;

		this.ui.btnSubmit.on("tap", $.proxy(function () {
			if(this.check()){
				

				this.submitInfo();
			}

			return false;
		}, this));

		this.ui.txtMoney.on("input", function () {
			$(this).val(floatFormat.toFixed($(this).val(), 2));
		});
	},

	submitInfo: function () {
		var _this = this;

		this.dialogsPwd = dialogsPwd.create({			
			onUpdate: function (result)  {
				_this.loading = loading(_this.ui.btnSubmit);

				_this.verifyPayPwd(result);
				_this.dialogsPwd.close();
			}
		});
	},

 	getUserAbleBalanceJson: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data || 0;

			
			this.balance = moneyCny.toYuan(result);
			this.ui.spanBalance.text(moneyCny.toFixed(result));
		};

		options.error = function (e) {

		};
		
		api.send(api.ACCOUNT, "getAbleBalance", options, this);
	},

	getWithdrawBankCard: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data || {};

			this.data = result;

			this.setCard(result.userCardData);
			this.setDeposit(result.userOutFee);
			
			this.ui.wrap.show();
			this.ui.wrapLoading.hide();
		};

		options.error = function (e) {

		};
		
		api.send(api.ACCOUNT, "getWithdrawBankCard", options, this);
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
				this.userWithdrawRequest();
			}
		};

		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 1800});
		};
		
		api.send(api.USER, "verifyPayPwd", options, this);
	},

	userWithdrawRequest: function () {
		var money = Number(this.ui.txtMoney.val().trim());

		var options = {
			data: {
				amount: moneyCny.toHao(money),
				name: this.data.userCardData.user_name,
				idCardNo: this.data.userCardData.identity_card
			}
		};

		options.success = function (e) {
			var result = e.data || {};
			var balance = Number(this.balance) - Number(money);

			if(this.data.userOutFee.limitTimes == 0){
				balance = balance - moneyCny.toYuan(this.data.userOutFee.fee);
			}

			var param = {
				amount: money,
				balance: balance,
				date: this.getDate(),
				card: this.data.userCardData.user_card_no,
				bankCode: this.data.userCardData.bank_code
			};



			this.loading.close();

			window.location.href = "$root$/account/withdraw_deposit_result.html?" + $.param(param);
		};

		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 1800});
		};
		
		api.send(api.ACCOUNT, "userWithdrawRequest", options, this);
	},

	check: function () {
		var money = this.ui.txtMoney.val().trim();

		if(validate.isEmpty(money)){
			tipMessage.show(this.TIPS.MONEY_EMPTY, {delay: 1800});
			return false;	
		}

		if(Number(money) <= 0 || window.isNaN(Number(money))){
			tipMessage.show(this.TIPS.MONEY_ERROR, {delay: 1800});
			return false;
		}

		if(Number(money) > Number(this.balance)){
			tipMessage.show(this.TIPS.MONEY_ERROR1, {delay: 1800});
			return false;
		}

		return true;
	},

	getDate: function () {
		var date = serverTime.getServerTime();

		if(date.getHours() > 12){
			date.setDate(date.getDate() + 1);
		}

		return date.format("yyyy-MM-dd");
	},

	setDate: function () {
		var strDate = this.getDate();
		var text = this.TIPS.DATE_TIPS.format(strDate);
		
		this.ui.spanDate.text(text);
	},

	setCard: function (data) {
		var image = backConfig.getBankIco(data["bank_code"]);
		var text  = backConfig.getCardText(data["user_card_no"]);

		this.ui.cardBox.find(".card-number").text(text);
		this.ui.cardBox.find(".card-ico").attr({src: image});
	},

	setDeposit: function (data) {
		var text = "";
		var money = moneyCny.toYuan(data.fee);
		
		if(data.limitTimes == 0){
			text = this.TIPS.DEPOSIT_TIPS2.format(money);	
		}else{
			text = this.TIPS.DEPOSIT_TIPS1.format(data.limitTimes);
		}

		this.ui.spanLimit.text(text);
	}
 };

 deposit.init();