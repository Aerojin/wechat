var $ 				= require("zepto");
var artTemplate 	= require("artTemplate");

var buy = function (options) {

	this.data 	   	= options.data;
	this.copies 	= options.copies;
	this.container 	= options.container;
	this.onReady 	= options.onReady || this.onReady;
	this.onChange 	= options.onChange || this.onChange;

	this.init();
};

buy.prototype.init = function () {
	this.number = Number(this.copies.VALUE || 1);
	this.money 	= Number(this.copies.MONEY || 1000);
	this.amount = this.number.mul(this.money);

	this.template = {};
	this.template.context = artTemplate.compile(__inline("context_xt.tmpl"));
	this.container.html(this.template.context(this.data));

	this.ui = {};
	this.ui.btnPrev 	= this.container.find("#btn-prev");
	this.ui.btnNext 	= this.container.find("#btn-next");
	this.ui.txtCopies 	= this.container.find("#txt-copies");
	this.ui.spanMoney 	= this.container.find("#span-money");

	this.regEvent();
	this.onReady(this.container);
	this.onChange(this.amount);
};

buy.prototype.regEvent = function () {
	var _this = this;
	this.ui.btnPrev.on("click", $.proxy(function () {
		this.subtract();
	}, this));

	this.ui.btnNext.on("click", $.proxy(function () {
		this.add();
	}, this));

	this.ui.txtCopies.on("input", function () {
		var value = Number($(this).val() || 0);

		if(window.isNaN(value)){
			value = 0;
		}

		_this.change(value);
	});

	this.ui.txtCopies.blur(function () {
		var value = Number($(this).val() || 0);

		if(window.isNaN(value) || value < 1){
			value = 1;
		}

		$(this).val(value);
		_this.change(value);
	});
};

buy.prototype.add = function () {
	this.number += 1;

	this.change(this.number);
	this.ui.txtCopies.val(this.number);
};

buy.prototype.subtract = function () {
	this.number--;

	if(this.number < 1) {
		this.number = 1;
	}

	this.change(this.number);
	this.ui.txtCopies.val(this.number);
};

buy.prototype.change = function (value) {
	this.number = value;
	this.amount = this.number.mul(this.money);

	this.ui.spanMoney.text(this.amount);

	this.onChange(this.amount);
};

buy.prototype.onReady = function () {

};

buy.prototype.onChange = function () {

};

module.exports = buy; 