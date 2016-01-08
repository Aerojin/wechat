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
var redPacket 	= require("redpacket");

var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试",
	RED_EMPTY: "暂无可用",
	RED_NO_USABLE: "未使用",
	CURRENT_APPLY: "当前不适用",
	RED_AMOUNT: "<span class='first'>已选择使用</span> <span class='last'>“返现{0}元”</span>"
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
	
	this.redPacket = new redPacket({
		money: 0,
		productId: this.getProductId()
	});

	this.redPacket.onChange = function (data, len) {
		if(len == 0){
			_this.ui.redNumber.text(TIPS.RED_EMPTY);
			return false;
		}

		if(data){
			_this.ui.redNumber.html(TIPS.RED_AMOUNT.format(data.newMoney));
			return false;
		}

		if(this.getUse().length == 0 && _this.amount > 0){
			_this.ui.redNumber.text(TIPS.CURRENT_APPLY);

			return false;
		}

		_this.ui.redNumber.text(TIPS.RED_NO_USABLE);
	};
};

//获取模板(空函数,待子类覆盖)
views.prototype.getTemplate = function () {
	return "";
};

//产品购买
views.prototype.buyProduct = function (pwd) {
	var options = {};
	var amount 		 = this.getMoney();
	var investAmount = moneyCny.toHao(amount);
	var redId 		 = this.redPacket.getSelected().fid || "";

	options.data = {
		redId: redId,
		payPassword: pwd,
		sellChannel: "local",
		investAmount: investAmount,
		productId: this.getProductId(),
		platform: versions.getCurrentSource()		
	};

	options.success = function (e) {
		var result = e.data || {};

		var bizTime 	= new Date();
		var backTime 	= result.fEndTime.parseDate();
		var startTime 	= result.fStartTime.parseDate();
		var earnings 	= this.model.getTotalEarnings(amount);

		var data = {
			earnings: earnings,
			amount: this.getMoney(),
			investId: result.investId,
			fBizTime: bizTime.format("yyyy-MM-dd"),
			fBackTime: backTime.format("yyyy-MM-dd"),
			fStartTime: startTime.format("yyyy-MM-dd"),				
			memberOldLevel: result.memberOldLevel,
			memberNewLevel: result.memberNewLevel,
			isShowActivity: this.getIsShowActivity(),
			redAmount: this.redPacket.getSelected().newMoney || 0
		};

		this.loading.close();
		window.location.href = "$root$/product/buy_result.html?" + $.param(data);

	};

	options.error = function (e) {
		this.loading.close();
		tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 2000});
	};

	api.send(api.PRODUCT, "buyTtnProduct", options, this);
};

//获取购买金额
views.prototype.getMoney = function () {
	return 0;
};

//初始化子类UI
views.prototype.initUI = function () {
	
};

//初始化子类UI
views.prototype.getIsShowActivity = function () {
	var start 	= new Date("2015/12/07 10:00:00");
	var end   	= new Date("2015/12/19 00:00:00");

	var type 	= this.model.get("typeValue");
	var day 	= this.model.get("deadLineValue");
	var result 	= serverTime.getDateActivity(start, end);

	if(type != 104){
		return false;
	}

	if(day != 180 && day != 360){
		return false;
	}

	if(result.result){
		return true;
	}

	return false;
};

//获取产品ID
views.prototype.getProductId = function () {
	return this.getData().productId;
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

module.exports = views;