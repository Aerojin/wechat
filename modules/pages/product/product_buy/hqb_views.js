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

module.exports = views;