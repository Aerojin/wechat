/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var appApi 		 	= require("kit/app_api");
var moneyCny		= require("kit/money_cny");
var validate 		= require("kit/validate");
var artTemplate		= require("artTemplate");
var serverTime 		= require("kit/server_time");
var eventFactory 	= require("base/event_factory");
var queryString 	= require("kit/query_string");
var priductFormat	= require("kit/product_format");
var smartbar		= require("ui/smartbar/smartbar");
var tipMessage 		= require("ui/tip_message/tip_message");

var buy = {
	init: function () {

		this.ui = {};
		this.ui.context   		= $("#context");		
		this.ui.title 			= $(document).find("title");
		
		//this.smartbar 		= smartbar.create();
		this.queryString 	= queryString();
		this.template  	 	= artTemplate.compile(__inline("context.tmpl"));

		this.getData();
	},

	regEvent: function () {
		this.ui.btnSubmit.on("click", $.proxy(function () {

			window.location.href = "$root$/product/buy_detail.html?productId={0}".format(this.queryString.productId);

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
	},

	getData: function () {
		var options = {};

		options.data = {
			productId: this.queryString.productId
		};

		options.success = function (e) {
			var result 	= e.data;
			var info 	= priductFormat.format(result);
			var data 	= this.format(result, info);
			
			this.setContext(data);
		};

		options.error = function (e) {

		};

		api.send(api.PRODUCT, "queryProductById", options, this);
	},
	format: function (data, info) {
		var result 	= {};

		result.buyTime 			= {};	
		result.isLogin 			= user.isLogin();
		result.status  			= Number(data.status);
		result.fixRate 			= data.fixRateDisplay;
		result.flowMinRate 		= data.flowMinRateDisplay;
		result.flowMaxRate 		= data.flowMaxRateDisplay;
		result.bottom 			= 0;//this.smartbar.getHeight();
		result.promotionText 	= (data.promotionText || "").trim();
		result.buyMinMoney 		= moneyCny.toYuan(data.buyMinMoney);
		result.remaMoney 		= moneyCny.toYuan(data.remaMoney);
		result.buyTotalMoney 	= moneyCny.toYuan(data.buyTotalMoney);
		result.isCollect 		= Number(data.isCollect);
		result.collectEndTime 	= data.collectEndTime;
		result.strBeginDate 	= data.strBeginDate;
		result.strEndDate 		= data.strEndDate;
		result.productName		= data.productName;
		result.cBuyMaxMoney 	= moneyCny.toYuan(data.cBuyMaxMoney);
		result.userAvailable 	= moneyCny.toYuan(data.userAvailableMoney);

		if(data.productRule){
			var start 	= data.productRule.startBuyTime;
			var end 	= data.productRule.endBuyTime;

			result.endBuyTime	= end.parseDate();
			result.startBuyTime = start.parseDate();
			result.buyTime 		= serverTime.getDateActivity(start, end);
		}
		
		if (data.isSellOut) {
			result.remaMoney = 0;
		}

		return $.extend(info, result);
	},

	setContext: function (data) {
		if(data.productName){
			this.ui.title.text(data.productName);
		}

		this.ui.context.html(this.template(data));

		this.ui.btnSubmit = $("#btn-submit");		
		this.ui.btnLogin  = $("#btn-login");

		this.regEvent();
	}
};

buy.init();