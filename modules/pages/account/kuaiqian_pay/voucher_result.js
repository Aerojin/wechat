var $ 				= require("zepto");
var xnData			= require("kit/xn_data");
var getDefaultUri	= require("kit/default_uri");
var backConfig		= require("ui/bank_config/bank_config");

module.exports = {
	init: function (data) {

		this.ui = {};
		this.ui.fail 	= $("#wrap-fail");
		this.ui.loading = $("#wrap-loading");
		this.ui.success = $("#wrap-success");
		this.ui.wrapBox = $(".wrap-box");
		this.ui.btnList = $("#btn-list");
		this.ui.money 	= $("#money-order");
		this.ui.card 	= $("#card-num");
		this.ui.icon 	= $("#icon-bank");
		this.ui.message = $("#fail-message");

		this.backUrl = data.returnUrl;
		this.voucherData = xnData.create({
			key: xnData.STATE.DETAULT_KEY
		});

		this.regEvent();
		this.showResult(data);

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
	showResult: function (result) {
		var _this = this;

		//var result = this.queryString;

		this.voucherData.clear();
		this.ui.wrapBox.hide();

		if(result.success == true){

			this.ui.money.text(result.amount);
			this.ui.card.text(backConfig.getCardText(result.account));
			this.ui.icon.attr({src: backConfig.getBankIco(result.bankcode)});

			this.ui.success.show();
			this.ui.loading.hide();
			return;
		}

		if(result.success == false ){
			this.ui.message.text(this.getMessage(decodeURIComponent(result.message)));
			this.ui.fail.show();
			this.ui.loading.hide();
			return;
		}
	},
	getMessage: function (msg){
		return "失败原因：{0}".format(msg || "未知错误");
	}
};