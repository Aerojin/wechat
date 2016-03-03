var $ 				= require("zepto");
var artTemplate 	= require("artTemplate");
var floatFormat		= require("kit/float_format");
var productViews 	= require("product_views");

var views = function (options) {
	this.model 		= options.model;
	this.earnings 	= options.earnings || "";
	this.template 	= this.getTemplate();

	this.init();
	this.initUI();
};

views.prototype = new productViews({});

views.prototype.initUI = function () {

	this.ui.txtMoney 	= this.ui.wrap.find("#txt-money");
	this.ui.btnPacket	= this.ui.wrap.find("#btn-packet");
	this.ui.investNum	= this.ui.wrap.find("#invest-num");

	this.initEvent();
};

views.prototype.initEvent = function () {
	this.ui.txtMoney.on("input", $.proxy(function () {
		var value 		= this.ui.txtMoney.val();
		var newValue	= floatFormat.toFixed(value, 0);

		this.ui.txtMoney.val(newValue);
		this.moneyChange();
		return false;
	}, this));
};

views.prototype.moneyChange = function () {
	var money = this.getMoney();
	var total = this.model.getTotalEarnings(money);

	this.ui.investNum.text(total);
	this.redPacket.setMoney(money);
};

views.prototype.getMoney = function () {
	return Number(this.ui.txtMoney.val());
};

views.prototype.getTemplate = function () {
	return artTemplate.compile(__inline("def.tmpl"));
};

module.exports = views;