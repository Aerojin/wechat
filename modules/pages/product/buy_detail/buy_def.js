var $ 				= require("zepto");
var artTemplate 	= require("artTemplate");
var floatFormat		= require("kit/float_format");

var buy = function (options) {

	this.data 	   	= options.data;
	this.container 	= options.container;
	this.onReady 	= options.onReady || this.onReady;
	this.onChange 	= options.onChange || this.onChange;

	this.init();
};

buy.prototype.init = function () {
	this.template = {};
	this.template.context = artTemplate.compile(__inline("context.tmpl"));
	this.container.html(this.template.context(this.data));

	this.ui = {};
	this.ui.txtMoney	= this.container.find("#txt-money");

	this.regEvent();
	this.onReady(this.container);
	this.change();
};

buy.prototype.regEvent = function () {
	this.ui.txtMoney.on("input", $.proxy(function () {
		var value 		= this.ui.txtMoney.val();
		var newValue	= floatFormat.toFixed(value, 0);

		this.ui.txtMoney.val(newValue);

		this.change();

		return false;
	}, this));
};

buy.prototype.change = function () {
	var amount = Number(this.ui.txtMoney.val().trim() || 0);

	this.onChange(amount);
};

buy.prototype.onReady = function () {

};

buy.prototype.onChange = function () {

};



module.exports = buy; 