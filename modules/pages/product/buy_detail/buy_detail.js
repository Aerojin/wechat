/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var moneyCny		= require("kit/money_cny");
var artTemplate 	= require("artTemplate");
var versions 		= require("base/versions");
var queryString 	= require("kit/query_string");
var dialogs 		= require("ui/dialogs/dialogs");
var smartbar		= require("ui/smartbar/smartbar");
var buySubmit		= require("ui/buy_submit/buy_submit");
var tipMessage 		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");

var model  		= require("model");
var buyXt  		= require("buy_xt");
var buyDef 		= require("buy_def");
var redPacket 	= require("redpacket");

var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试",
	RED_TIPS: "兑换{0}元红包需单笔投资满{1}元以上",
	RED_USABLE: "{0}个可用",
	RED_AMOUNT: "<span class='first'>已选择使用</span> <span class='last'>“返现{0}元”</span>",
	RED_EMPTY: "暂无可用",
	RED_NO_USABLE: "未使用",
	CURRENT_APPLY: "当前不适用"
};

var detail = {
	
	data: {},

	init: function () {

		this.ui = {};
		this.ui.wrap 		= $("#wrap");
		this.ui.header 		= $("#header");
		this.ui.context 	= $("#context");		
		this.ui.title 		= $(document).find("title");
		
		this.buySubmit 		= buySubmit.create();
		this.queryString 	= queryString();
		this.smartbar 		= smartbar.create();

		this.template = {};
		this.template.header 	= artTemplate.compile(__inline("header.tmpl"));
		this.template.earnings	= artTemplate.compile(__inline("tips_earnings.tmpl"));

		this.initRedPacket();
		this.getData();
	},
	regEvent: function () {
		var _this = this;
		
		this.ui.btnSubmit.on("click", function () {
			_this.buy();
		});

		this.ui.btnPacket.on("click", function () {
			_this.redPacket.show();
			return false;
		});

		this.ui.btnRecharge.on("click", $.proxy(function () {
			this.buySubmit.gotoRecharge();
			return false;
		}, this));

		this.ui.btnEarnings.on("click", $.proxy(function () {
			this.showEarnings();
			return false;	
		}, this));

		this.ui.btnPact.on("click", function () {
			_this.toggleServive($(this));					
		});
	},

	getData: function () {
		var options = {};

		options.data = {
			productId: this.getProductId()
		};

		options.success = function (e) {
			var result 	= e.data;

			if(result.productName){
				this.ui.title.text(result.productName);
			}

			this.model = new model({
				data: result
			});

			this.showContext();
			this.ui.header.html(this.template.header(this.model.getData()));
		};

		options.error = function (e) {

		};

		api.send(api.PRODUCT, "queryProductById", options, this);
	},

	showContext: function () {
		var _this = this;
		var options = {
			data: this.model.getData(),
			copies: this.model.getCopies(),
			container: this.ui.context
		};

		options.onReady = function (context) {

			_this.ui.btnPacket		= context.find("#btn-packet");
			_this.ui.btnEarnings	= context.find("#btn-earnings");
			_this.ui.btnRecharge 	= context.find("#btn-recharge");
			_this.ui.investNum		= context.find("#invest-num");
			_this.ui.btnSubmit		= context.find("#btn-submit");
			_this.ui.btnPact		= context.find(".btn-pact");
			_this.ui.redNumber 		= context.find("#div-redNumber");

			_this.regEvent();
		};

		options.onChange = function (money) {
			_this.amount = money;
			_this.redPacket.setMoney(money);
			_this.ui.investNum.text(_this.model.getTotalEarnings(money));
		};

		switch(this.model.getType()) {
			case 5:
				this.buyObject = new buyXt(options);
				break;
			case 502:
				this.buyObject = new buyXt(options);
				break;
			default:
				this.buyObject = new buyDef(options);
				break;
		}
	},

	buy: function () {
		var _this 	= this;
		var amount  = Number(this.amount);
		var balance = this.model.getAbleBalance();

		if(this.ui.btnSubmit.hasClass("oper-btn-gray")){
			return false;
		}

		this.buySubmit.submit({
			amount: amount,
			balance: balance
		}, function (result) {
			_this.loading = loading(_this.ui.btnSubmit);
			_this.buyTtnProduct(result);
		});
	},
	buyTtnProduct: function (pwd) {
		var options = {};
		var redId = this.redPacket.getSelected().fid || "";
		var investAmount = moneyCny.toHao(this.amount);

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

			var earnings 	= this.model.getTotalEarnings(this.amount);
			var isActivity 	= this.model.getData().awardRateSetting.length > 0 ? 1 : 0;

			var data = {
				amount: this.amount,
				earnings: earnings,
				isActivity: isActivity,
				investId: result.investId,
				fBizTime: bizTime.format("yyyy-MM-dd"),
				fBackTime: backTime.format("yyyy-MM-dd"),
				fStartTime: startTime.format("yyyy-MM-dd"),				
				memberOldLevel: result.memberOldLevel,
				memberNewLevel: result.memberNewLevel,
				redAmount: this.redPacket.getSelected().newMoney || 0
			};

			this.loading.close();
			window.location.href = "$root$/product/buy_result.html?" + $.param(data);

		};

		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
		};

		api.send(api.PRODUCT, "buyTtnProduct", options, this);
	},

	showEarnings: function () {
		var _this   = this;
		var context = this.template.earnings(this.model.getEarnings(this.amount));

		this.dialogs = dialogs.create({
			context: context,
			onReady: function (dom) {
				dom.find(".btn-submit").on("touchstart", function () {
					_this.dialogs.close();

					return false;
				});
			}
		});
	},
	toggleServive: function ($this) {
		var _this = this;
		var state = Number($this.data("state"));

		if(state){
			$this.data("state", 0);
			$this.removeClass("pact-on");
		}else{
			$this.data("state", 1);
			$this.addClass("pact-on");			
		}

		this.ui.btnSubmit.removeClass("oper-btn-gray");

		$.each(this.ui.btnPact, function () {
			var state = Number($(this).data("state"));

			if(state == 0){
				_this.ui.btnSubmit.addClass("oper-btn-gray");
			}
		});
	},

	getProductId: function () {
		return this.queryString.productId;
	},

	initRedPacket: function () {
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
	}
};

detail.init();