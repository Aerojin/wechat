var $ 				= require("zepto");
var artTemplate 	= require("artTemplate");
var floatFormat		= require("kit/float_format");
var productViews 	= require("product_views");
var tipMessage 		= require("ui/tip_message/tip_message");

var TIPS = {
	ERROR1: "购买金额不能大于剩余总额",
	ERROR2: "购买后剩余金额不足100元请重新输入金额"
};

var views = function (options) {
	this.model 		= options.model;
	this.template 	= this.getTemplate();

	this.init();
	this.initUI();
};

views.prototype = new productViews({});

views.prototype.initUI = function () {

	this.ui.txtMoney 	= this.ui.wrap.find("#txt-money");
	this.ui.investNum	= this.ui.wrap.find("#invest-num");

	this.initEvent();
};

views.prototype.initEvent = function () {
	this.ui.txtMoney.on("input", $.proxy(function () {
		var value 	= Number(this.ui.txtMoney.val());
		/*
		var max 	= this.getData().remainAmount;

		if(value > max){
			value = max;
			this.ui.txtMoney.val(value);
		}
		*/

		this.moneyChange(value);
		return false;
	}, this));
};

views.prototype.moneyChange = function () {
	var money = this.getMoney();
	var total = this.model.getTotalEarnings(money);

	this.ui.investNum.text(total);
};

views.prototype.getMoney = function () {
	return Number(this.ui.txtMoney.val());
};

views.prototype.getTemplate = function () {
	return artTemplate.compile(__inline("default.tmpl"));
};

views.prototype.check = function () {
	var money 		= this.getMoney();
	var remainMoney = this.getData().remainMoney;	
	var minAmount 	= this.getData().minInvestLimit;
	var diff 		= remainMoney - money;

	if(diff < 0){
		tipMessage.show(TIPS.ERROR1, {delay: 2000});
		return false;
	}

	if(diff > 0 && diff < minAmount){
		tipMessage.show(TIPS.ERROR2, {delay: 2000});
		return false;
	}

	return true;
}

module.exports = views;