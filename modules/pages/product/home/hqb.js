var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var moneyCny 		= require("kit/money_cny");
var validate 		= require("kit/validate");
var artTemplate 	= require("artTemplate");
var versions 		= require("base/versions");
var appApi 		 	= require("kit/app_api");
var serverTime 		= require("kit/server_time");
var floatFormat		= require("kit/float_format");
var eventFactory 	= require("base/event_factory");
var buySubmit		= require("ui/buy_submit/buy_submit");
var tipMessage		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");

var TIPS = {
	RECHARGE: "充值",
	RECHARGE_FAIL: "充值失败",
	MIN_AMOUNT: "购买金额100元起",
	PAY_ERROR: "可用余额不足, 请先充值!",
	SYS_ERROR: "网络异常,请稍后重试",
	AMOUNT_ERROR: "购买金额只能是数字"
};

var hqb = {

	load: [],

	minAmount: 100,

	init: function (options) {

		this.ui = {};	
		this.ui.wrap 	= options.container;
		this.ui.header 	= this.ui.wrap.find("#hqb-header");
		this.ui.context = this.ui.wrap.find("#hqb-context");

		this.data = {};
		this.template = {};
		this.template.header  = artTemplate.compile(__inline("hqb_header.tmpl"));
		this.template.context = artTemplate.compile(__inline("hqb_context.tmpl"));

		if(user.isLogin()){
			this.buySubmit = buySubmit.create({
				data: {
					isLoginRedirect: true
				}
			});
		}
		
		this.queryProductInfo();
	},

	regEvent: function () {
		var _this = this;
		this.ui.btnBuy.on("click", $.proxy(function () {
			_this.buy();
			
			return false;
		}, this));

		this.ui.btnLogin.on("click", $.proxy(function () {			
			eventFactory.exec({
				wap: function () {
					window.location.href = "$root$/user/login.html";
				},
				app: function () {
					window.location.href = appApi.getLogin();
				}
			});
			return false;
		}, this));

		this.ui.btnRecharge.on("click", $.proxy(function () {
			this.buySubmit.gotoRecharge();
			return false;
		}, this));

		this.ui.txtMoney.on("input", function () {
			$(this).val(floatFormat.toFixed($(this).val(), 2));
		}); 
	},

	queryProductInfo: function () {
		var options = {};

		options.data = {

		};

		options.success = function (e) {
			var result = e.data;

			var html = this.template.header({
				showEleven: this.isShowEleven(),
				flowMinRate: result.flowMinRateDisplay,
				flowMaxRate: result.flowMaxRateDisplay,
				remaMoney: moneyCny.toYuan(result.remaMoney, 0),
				isSellOut: this.getIsSellOut(result.remaMoney)
			});

			this.productId = result.productId;
			this.render(result, "product");
			this.ui.header.html(html);
		};

		options.error = function () {

		};

		api.send(api.PRODUCT, "queryProductInfo", options, this);
	},

	render: function (result, key) {
		this.data = result;

		var data = result;
		var balance = moneyCny.toYuan(data.ableBalance || 0);

		var context = this.template.context({
			balance: balance,
			isLogin: user.isLogin(),
			remaMoney: data.remaMoney,
			isSellOut: this.getIsSellOut(data.remaMoney),
			fbuyBalance: moneyCny.toYuan(data.fbuyBalance, 0),
			fPurchaseMaximum: moneyCny.toYuan(data.fPurchaseMaximum, 0)
		});

		this.ui.context.html(context);

		this.ui.btnBuy 		= this.ui.context.find("#btn-buy");
		this.ui.txtMoney 	= this.ui.context.find("#txt-money");
		this.ui.btnLogin	= this.ui.context.find("#btn-login");
		this.ui.btnRecharge = this.ui.context.find("#btn-recharge");

		this.regEvent();
		
	},
	buy: function () {
		var _this 	= this;
		var amount  = Number(this.ui.txtMoney.val());
		var balance = moneyCny.toYuan(this.data.ableBalance || 0);

		this.buySubmit.submit({
			amount: amount,
			balance: balance
		}, function (result, dialogs) {
			_this.loading = loading(_this.ui.btnBuy);
			_this.buyHqb(result);
		});		
	},
	buyHqb: function (pwd) {
		var options = {};
		var investAmount = moneyCny.toHao(this.ui.txtMoney.val().trim());

		options.data = {
			productId: this.productId,
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
				amount: moneyCny.toYuan(investAmount),
				memberOldLevel: result.memberOldLevel,
				memberNewLevel: result.memberNewLevel
			}

			this.loading.close();

			window.location.href = "$root$/product/hqb_result.html?" + $.param(data);
		};

		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
		};


		api.send(api.PRODUCT, "buyProduct", options, this);
	},

	getIsSellOut: function (remaMoney) {
		return moneyCny.toYuan(remaMoney) < 100;
	},

	isShowEleven: function () {
		var start = new Date("2015/11/01 00:00:00");
		var end   = new Date("2015/11/14 00:00:00");
		var result = serverTime.getDateActivity(start, end);
		
		return result.isStart && !result.isEnd;
	}

};

module.exports = {
	create: function (options) {
		hqb.init(options || {});
	}
};