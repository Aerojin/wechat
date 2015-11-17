var bindCardState 	= require("kit/bindcard_state");
var confirm 		= require("ui/confirm/confirm");
var tipMessage 		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");
var dialogsPwd 		= require("ui/dialogs_password/dialogs_password");

var TIPS = {
	RECHARGE_FAIL: "支付失败",
	MIN_AMOUNT: "购买金额{0}元起",
	PAY_ERROR: "可用余额不足, 请先充值!",
	SYS_ERROR: "网络异常,请稍后重试",
	AMOUNT_ERROR: "购买金额必须是数字"
};

var buy = function (options) {

	this.cardState 	= bindCardState(options);
	this.minAmount 	= options.minAmount || 100;
};

buy.prototype.submit = function (data, callback) {
	var _this = this;

	if(window.isNaN(data.amount)){
		tipMessage.show(TIPS.AMOUNT_ERROR, {delay: 2000});

		return false;
	}

	if(data.amount < this.minAmount){
		tipMessage.show(TIPS.MIN_AMOUNT.format(this.minAmount), {delay: 2000});

		return false;
	}

	if(data.balance < data.amount){
		confirm(TIPS.PAY_ERROR, {callback: function (result){
			if(result){
				_this.gotoRecharge();
			}
		}});

		return;
	}

	this.showDialogsPwd(callback);
};

buy.prototype.showDialogsPwd = function (callback) {
	var _this = this;

	if(this.dialogsPwd){
		this.dialogsPwd.close();
	}

	this.dialogsPwd = dialogsPwd.create({
		onUpdate: function (result)  {
			if(callback){
				callback(result);
			}
			_this.dialogsPwd.close();
		}
	});

};

buy.prototype.gotoRecharge = function () {	
	this.cardState.redirect();
};




module.exports = {
	create: function (options) {
		return new buy(options || {});
	}
};