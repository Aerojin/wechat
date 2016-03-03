var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny 	= require("kit/money_cny");
var serverTime 	= require("kit/server_time");
var versions 	= require("base/versions");
var dialogs 	= require("ui/dialogs/dialogs");
var buySubmit	= require("ui/buy_submit/buy_submit");
var tipMessage 	= require("ui/tip_message/tip_message");
var loading 	= require("ui/loading_button/loading_button");

var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试"
};

var views = function (options) {
	this.model 		= options.model || {};
	this.template 	= this.getTemplate();
	this.TIPS 		= TIPS;
};

views.prototype.init = function () {

	this.ui = {};
	this.ui.wrap 		= $(this.template(this.getData()));	
	this.ui.btnSubmit 	= this.ui.wrap.find("#btn-submit");
	this.ui.btnRecharge = this.ui.wrap.find("#btn-recharge");
	this.ui.btnPact		= this.ui.wrap.find(".btn-pact");

	this.buySubmit 		= buySubmit.create({
		minAmount: this.getData().buyMinMoney
	});	
	
	this.regEvent();
};

views.prototype.regEvent = function () {
	var _this = this;

	this.ui.btnSubmit.click($.proxy(function () {
		if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
			return false;
		}

		if(this.check()){
			var amount  = this.getMoney();
			var balance = this.model.getAbleBalance(); 

			this.buySubmit.submit({
				amount: amount,
				balance: balance
			}, function (result) {
				_this.loading = loading(_this.ui.btnSubmit);
				_this.buyProduct(result);
			});
		}

	}, this));

	this.ui.btnRecharge.click($.proxy(function () {
		this.buySubmit.gotoRecharge();
	}, this));

	this.ui.btnPact.click(function () {
		var index = Number($(this).data("index"));

		_this.model.setProtocol(index);
	});

	this.model.onPotocolChange = function (index, checked) {
		if(checked){
			_this.ui.btnPact.eq(index).addClass("pact-on");
		}else{
			_this.ui.btnPact.eq(index).removeClass("pact-on");
		}

		if(_this.model.getProtocolChecked()){
			_this.ui.btnSubmit.removeClass('oper-btn-gray');
		}else{
			_this.ui.btnSubmit.addClass('oper-btn-gray');
		}
	};
};

//获取模板(空函数,待子类覆盖)
views.prototype.getTemplate = function () {
	return "";
};

//产品购买
views.prototype.buyProduct = function (pwd) {
	var options = {};
	var amount 		= this.getMoney();
	var principal 	= moneyCny.toHao(amount);
	var investType 	= this.model.getData().investType;

	options.data = {
		payPassword: pwd,
		redPacketId: "",
		sellChannel: "local",
		principal: principal,
		investType: investType,
		quotient: this.getQuotient(),
		productId: this.getProductId(),
		platform: versions.getCurrentSource()		
	};

	options.success = function (e) {
		var result = e.data || {};

		var data = {
			redAmount: 0,
			investId: result.investId,
			memberOldLevel: result.memberLevelBeforeBuy,
			memberNewLevel: result.memberLevelAfterBuy			
		};

		this.loading.close();
		window.location.href = "$root$/product/transfer_result.html?" + $.param(data);

	};

	options.error = function (e) {
		this.loading.close();
		tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 2000});
	};

	api.send(api.PRODUCT, "buyProduct", options, this);
};

//获取购买金额
views.prototype.getMoney = function () {
	return 0;
};

//初始化子类UI
views.prototype.initUI = function () {
	
};

//获取产品ID
views.prototype.getProductId = function () {
	return this.getData().fid;
};

//获取Dom
views.prototype.getElement = function () {
	return this.ui.wrap;
};

//获取数据
views.prototype.getData = function () {
	if(!this.data){
		this.data = this.model.getData();
	}

	return this.data;
};

//获取产品购买份数, 默认是0
views.prototype.getQuotient = function () {
	return 0;
};

//数据效验
views.prototype.check = function () {
	return true;
};

module.exports = views;