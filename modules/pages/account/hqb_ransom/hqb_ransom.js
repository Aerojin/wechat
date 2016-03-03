/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var validate 	= require("kit/validate");
var serverTime 	= require("kit/server_time");
var moneyCny 	= require("kit/money_cny");
var floatFormat	= require("kit/float_format");
var smartbar	= require("ui/smartbar/smartbar");
var tipMessage 	= require("ui/tip_message/tip_message");
var loading 	= require("ui/loading_button/loading_button");
var dialogsPwd  = require("ui/dialogs_password/dialogs_password");

var TIPS = {
	REDEEM_ERROR: "赎回金额不能大于可赎回余额",
	REDEEM_TIPS: "您没有可赎回余额",
	REDEEM_TIPS1: "剩余可赎回余额低于100元,需将剩余余额一并赎回",
	MONEY_TIPS: "赎回金额只能是数字",
	MONEY_ERROR: "赎回金额不能少于100",
	SYS_ERROR: "网络异常,请稍后重试"
};

var rensom = {
 	init: function () {

	 	this.ui = {};
	 	this.ui.txtMoney 	= $("#txt-money");
	 	this.ui.redeemNum 	= $("#redeem-num");
	 	this.ui.redeemDate 	= $("#redeem-date");
	 	this.ui.btnSubmit 	= $("#btn-submit");

	 	this.smartbar = smartbar.create();
		this.endDate = serverTime.getServerTime();
		
		this.endDate.setDate(this.endDate.getDate() + 1);
		this.ui.redeemDate.text(this.endDate.format("yyyy-MM-dd"));

		this.getData();
	 	this.regEvent();
 	},

 	regEvent: function () {
 		var _this = this;

 		this.ui.btnSubmit.on("tap", $.proxy(function () {
 			if(this.check()){
 				this.dialogsPwd = dialogsPwd.create({
					onUpdate: function (result)  {
						_this.dialogsPwd.close();
						_this.loading = loading(_this.ui.btnSubmit);
						
						_this.applyRedeem(result);
					}
				});
 			}
 		}, this));

 		this.ui.txtMoney.on("input", function () {
 			var value = $(this).val();

 			if(value.length > 0){
	 			$(this).val(floatFormat.toFixed($(this).val(), 2));
	 		}
 		}); 		
 	},

 	getData: function () {
 		var options = {
 			data: {}
 		};

 		options.success = function (e) {
 			var result = e.data;

 			this.redeemMoney = moneyCny.toFixed(result);
 			this.ui.redeemNum.text(this.redeemMoney);
 		};

 		options.error = function (e) {
 			this.redeemMoney = 0;
 			this.ui.redeemNum.text(0);
 		};

 		api.send(api.PRODUCT, "getCurrentRedeemableAmount", options, this); 		
 	},


 	applyRedeem: function (pwd) {
 		var options = {};
 		var amount = moneyCny.toHao(this.ui.txtMoney.val().trim());

 		options.data = {
 			productId: "",
 			amount: amount,
 			payPassword: pwd
 		};


 		options.success = function (e) {
 			var result = e.data;

 			this.loading.close();

 			var param = {
 				amount: moneyCny.toFixed(amount),
 				endDate: this.endDate.format("yyyy-MM-dd"),
 				startDate: serverTime.getServerTime().format("yyyy-MM-dd")
 			};
 			
 			window.location.href = "$root$/account/hqb_ransom_result.html?" + $.param(param);
 		};

 		options.error = function (e) {
 			this.loading.close();
 			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
 		};

 		api.send(api.PRODUCT, "applyRedeemCurrent", options, this); 	
 	},

 	check: function () {
 		var money 		= Number(this.ui.txtMoney.val().trim());
 		var redeemMoney = Number(this.redeemMoney);
 		var result 		= redeemMoney.sub(money);

 		if(validate.isEmpty(money)){
 			tipMessage.show(TIPS.MONEY_ERROR, {delay: 2000});

 			return false;
 		}

 		if(Number(money) < 100){
 			tipMessage.show(TIPS.MONEY_ERROR, {delay: 2000});

 			return false;
 		}

 		if(window.isNaN(Number(money))){
 			tipMessage.show(TIPS.MONEY_TIPS, {delay: 2000});

 			return false;
 		}

 		if(redeemMoney <= 0){
 			tipMessage.show(TIPS.REDEEM_TIPS, {delay: 2000});

 			return false;
 		}

 		if(redeemMoney < money){
 			tipMessage.show(TIPS.REDEEM_ERROR, {delay: 2000});
 			return false;
 		}

 		if( result < 100 && result > 0){
 			tipMessage.show(TIPS.REDEEM_TIPS1, {delay: 2000});
 			return false;
 		}

 		return true;
 	}
};

rensom.init();