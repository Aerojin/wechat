var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny 	= require("kit/money_cny");
var serverTime 	= require("kit/server_time");
var versions 	= require("base/versions");
var dialogs 	= require("ui/dialogs/dialogs");
var redPacket 	= require("ui/redpacket/views");
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
	this.ui.btnPacket	= this.ui.wrap.find("#btn-packet");
	this.ui.btnEarnings	= this.ui.wrap.find("#btn-earnings");
	this.ui.redNumber 	= this.ui.wrap.find("#div-redNumber");

	this.buySubmit 		= buySubmit.create({
		minAmount: this.getData().buyMinMoney
	});	
	this.earnings 		= artTemplate.compile(__inline("earnings.tmpl"));
	
	this.regEvent();
	this.initRedPacket();
};

views.prototype.regEvent = function () {
	var _this = this;

	this.ui.btnEarnings.on("click", $.proxy(function () {
		this.showEarnings();
	}, this));

	this.ui.btnPacket.on("click", $.proxy(function() {
		this.redPacket.show();
	}, this));

	this.ui.btnSubmit.click($.proxy(function () {
		if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
			return false;
		}

		var amount  = this.getMoney();
		var balance = this.model.getAbleBalance(); 

		this.buySubmit.submit({
			amount: amount,
			balance: balance
		}, function (result) {
			_this.loading = loading(_this.ui.btnSubmit);
			_this.buyProduct(result);
		});

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

//显示加息
views.prototype.showEarnings = function () {
	var _this   = this;
	var amount 	= this.getMoney();
	var context = this.earnings(this.model.getEarnings(amount));

	this.dialogs = dialogs.create({
		context: context,
		onReady: function (dom) {
			dom.find(".btn-submit").on("touchstart", function () {
				_this.dialogs.close();

				return false;
			});
		}
	});
};

//初始化红包组件
views.prototype.initRedPacket = function () {
	var _this = this;
	
	if(!this.redPacket){
		this.redPacket = new redPacket({
			money: 0,
			productId: this.getProductId(),
			onLoad: function (msg) {
				_this.ui.redNumber.html(msg);
			},
			onChange: function (msg) {
				_this.ui.redNumber.html(msg);
			}
		});
	}
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
	var redId 		= this.redPacket.getSelected().fid || "";
	var investType 	= this.model.getData().investType;
	var newUserMark = this.model.getData().newUserMark;

	options.data = {
		payPassword: pwd,
		redPacketId: redId,
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
			newUserMark: newUserMark,
			investId: result.investId,
			memberOldLevel: result.memberLevelBeforeBuy,
			memberNewLevel: result.memberLevelAfterBuy,
			redAmount: this.redPacket.getSelected().newMoney || 0
		};

		this.loading.close();
		window.location.href = "$root$/product/product_result.html?" + $.param(data);

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

module.exports = views;