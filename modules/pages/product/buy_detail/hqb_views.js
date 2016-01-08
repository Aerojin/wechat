var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var moneyCny 		= require("kit/money_cny");
var versions 		= require("base/versions");
var tipMessage 		= require("ui/tip_message/tip_message");
var productViews 	= require("product_views");

var views = function (options) {
	this.model 		= options.model;
	this.template 	= this.getTemplate();

	this.init();
	this.initUI();
};

views.prototype = new productViews({});

views.prototype.initUI = function () {
	this.ui.txtMoney = this.ui.wrap.find("#txt-money");
};

views.prototype.getMoney = function () {
	return Number(this.ui.txtMoney.val());
};

views.prototype.getTemplate = function () {
	return artTemplate.compile(__inline("hqb.tmpl"));
};

views.prototype.buyProduct = function (pwd) {
	var options = {};
	var investAmount = moneyCny.toHao(this.getMoney());

	options.data = {
		productId: this.getProductId(),
		investAmount: investAmount,
		payPassword: pwd,
		platform: versions.getCurrentSource(),
		sellChannel: "local"

	};

	options.success = function (e) {
		var result = e.data;

		var bizTime 	= result.fBizTime.parseDate();
		var backTime 	= result.fBackTime.parseDate();
		var startTime 	= result.fStartTime.parseDate();

		var data = {
			investId: result.investId,
			fBizTime: bizTime.format("yyyy-MM-dd"),
			fBackTime: backTime.format("yyyy-MM-dd"),
			fStartTime: startTime.format("yyyy-MM-dd"),
			amount: this.getMoney(),
			memberOldLevel: result.memberOldLevel,
			memberNewLevel: result.memberNewLevel
		}

		this.loading.close();
		window.location.href = "$root$/product/hqb_result.html?" + $.param(data);
	};

	options.error = function (e) {
		this.loading.close();
		tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 2000});
	};


	api.send(api.PRODUCT, "buyProduct", options, this);
};

module.exports = views;