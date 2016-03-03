/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate		= require("artTemplate");
var user 			= require("kit/user");
var smartbar		= require("ui/smartbar/smartbar");
var queryString 	= require("kit/query_string");
var moneyCny 		= require("kit/money_cny");
var tipMessage  	= require("ui/tip_message/tip_message");
var loadingPage		= require("ui/loading_page/loading_page");


var income_today = { 
	init: function () {

		this.ui = {};
		this.ui.wrap 		= $("#js_wrap");
		this.template 		= artTemplate.compile(__inline("today.tmpl"));
		this.smartbar 		= smartbar.create();

		artTemplate.helper("moneyFormat", $.proxy(function(param){
			return moneyCny.toFixed(param);
		}, this));

		loadingPage.show();
		this.getData();

	},


	getData: function () {
		var options = {};

		options.data = {
			userId: user.get("userId")
		};

		options.success = function (e) {
			var result = e.data;

			var data = {};
			data.todayIncome = moneyCny.toFixed(result.currentDayProfit || 0);
			data.floatIncome = result.currentInvestProfit || {};
			data.fixIncome = result.fixInvestProfit || {};
			data.otherList = result.otherProfit || [];

			this.ui.wrap.html(this.template(data));

			loadingPage.hide();
		};

		options.error = function (e) { 

		};
		
		api.send(api.ACCOUNT, "queryCurrentDayProfit", options, this);
	}

};

income_today.init();