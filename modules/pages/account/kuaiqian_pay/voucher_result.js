var $ 				= require("zepto");
var api				= require("api/api");
var xnData			= require("kit/xn_data");
var moneyCny 		= require("kit/money_cny");
var getDefaultUri	= require("kit/default_uri");
var backConfig		= require("ui/bank_config/bank_config");

module.exports = {
	init: function (data, loadingPage) {

		this.ui = {};
		this.ui.fail 	= $("#wrap-fail");
		this.ui.success = $("#wrap-success");
		this.ui.wrapBox = $(".wrap-box");
		this.ui.btnList = $("#btn-list");
		this.ui.money 	= $("#money-order");
		this.ui.balance = $("#span-balance");
		this.ui.card 	= $("#card-num");
		this.ui.icon 	= $("#icon-bank");
		this.ui.message = $("#fail-message");

		this.backUrl = data.returnUrl;
		this.voucherData = xnData.create({
			key: xnData.STATE.DETAULT_KEY
		});

		this.regEvent();		
		this.getUserAbleBalanceJson();
		this.showResult(data, loadingPage);
	},
	regEvent: function () {
		this.ui.btnList.on("tap", $.proxy(function () {
			if(this.backUrl){
				window.location.href = this.backUrl;
				return;
			}

			window.location.href = getDefaultUri();

			return false;
		}, this));
	},

	getUserAbleBalanceJson: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data || 0;

			this.ui.balance.text(moneyCny.toFixed(result) + "元");
		};

		options.error = function (e) {

		};
		
		api.send(api.ACCOUNT, "getAbleBalance", options, this);
	},

	showResult: function (result, loadingPage) {
		var _this = this;

		//var result = this.queryString;

		this.voucherData.clear();
		this.ui.wrapBox.hide();

		if(result.success == true){

			this.ui.money.text(result.amount + "元");
			this.ui.card.text(backConfig.getCardText(result.account));
			this.ui.icon.attr({src: backConfig.getBankIco(result.bankcode)});

			this.ui.success.show();
			loadingPage.hide();
			return;
		}

		if(result.success == false ){
			this.ui.message.text(this.getMessage(decodeURIComponent(result.message)));
			this.ui.fail.show();
			loadingPage.hide();
			return;
		}
	},
	getMessage: function (msg){
		return "失败原因：{0}".format(msg || "未知错误");
	}
};