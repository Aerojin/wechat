/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var smartbar		= require("ui/smartbar/smartbar");
var confirm 		= require("ui/confirm/confirm");
var queryString 	= require("kit/query_string");
var moneyCny 		= require("kit/money_cny");
var tipMessage  	= require("ui/tip_message/tip_message");
var loadingPage		= require("ui/loading_page/loading_page");


var assets = {
	init: function () {
		
		this.ui = {};
		this.ui.wrap 	= $("#wrap");

		this.queryString = queryString() || {};
		this.queryString.mobile = user.get("loginName");
		
		loadingPage.show();
		this.smartbar 	= smartbar.create();

		this.getData();

	},

	getData: function () {
		var options = {};

		options.data = {
			userId: user.get("userId")
		};

		options.success = function (e) {
			var result = e.data;

			//账户余额
			this.ui.wrap.find(".js_balance").text(moneyCny.toFixed(result.ableBalance));
			//活期宝余额
			this.ui.wrap.find(".js_floatBalance").text(moneyCny.toFixed(result.currentProductAmount));
			//活期累计收益
			this.ui.wrap.find(".js_floatIncome").text(moneyCny.toFixed(result.currentProfitAmount));
			//投资中本金
			this.ui.wrap.find(".js_fixBalance").text(moneyCny.toFixed(result.sumInvestAmount));
			//定期累计收益
			this.ui.wrap.find(".js_fixIncome").text(moneyCny.toFixed(result.sumFixProProfit));

			loadingPage.hide();
		};

		options.error = function (e) { 
			
		};
		
		api.send(api.ACCOUNT, "getUserAssetInfo", options, this);
	}

};

assets.init();