var $ 				= require("zepto");
var artTemplate 	= require("artTemplate");
var productViews 	= require("product_views");

var views = function (options) {
	this.model 		= options.model;
	this.earnings 	= options.earnings || "";
	this.template 	= this.getTemplate();
	this.copiesNumber = 1;

	this.init();
	this.initUI();
};

views.prototype = new productViews({});

views.prototype.initUI = function () {

	this.ui.btnPrev 	= this.ui.wrap.find("#btn-prev");
	this.ui.btnNext 	= this.ui.wrap.find("#btn-next");
	this.ui.txtCopies 	= this.ui.wrap.find("#txt-copies");
	this.ui.spanAmount 	= this.ui.wrap.find("#span-amount");
	this.ui.investNum	= this.ui.wrap.find("#invest-num");

	this.initEvent();
	this.moneyChange();	
};

views.prototype.initEvent = function () {
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

		$(this).val(value);
		_this.moneyChange(value);
	});

	this.ui.txtCopies.blur(function () {
		var value = Number($(this).val() || 0);

		if(window.isNaN(value) || value < 1){
			value = 1;
		}

		$(this).val(value);
		_this.moneyChange(value);
	});
};

views.prototype.add = function () {
	this.copiesNumber += 1;

	this.moneyChange(this.copiesNumber);
	this.ui.txtCopies.val(this.copiesNumber);
};

views.prototype.subtract = function () {
	this.copiesNumber--;

	if(this.copiesNumber < 1) {
		this.copiesNumber = 1;
	}

	this.moneyChange(this.copiesNumber);
	this.ui.txtCopies.val(this.copiesNumber);
};

views.prototype.moneyChange = function (value) {
	this.copiesNumber = value || this.copiesNumber;

	var money = this.getMoney();
	var total = this.model.getTotalEarnings(money);

	this.ui.investNum.text(total);
	this.ui.spanAmount.text(money);
	this.redPacket.setMoney(money);
};

views.prototype.getMoney = function () {
	var number = this.copiesNumber;
	var money  = this.getData().buyMinMoney;

	return number.mul(money);
};

views.prototype.getTemplate = function () {
	return artTemplate.compile(__inline("portion.tmpl"));
};

module.exports = views;