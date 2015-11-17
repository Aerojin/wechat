/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var moneyCny		= require("kit/money_cny");
var appApi 			= require("kit/app_api");
var eventFactory 	= require("base/event_factory");
var waterfall 		= require("ui/waterfall/waterfall");
var smartbar		= require("ui/smartbar/smartbar");
var tipMessage  	= require("ui/tip_message/tip_message");

var myHqb = {

	pageIndex: 1,

	pageSize: 10,

	init: function () {
		
		this.ui = {};
		this.ui.header 		= $("#header");
		this.ui.context 	= $("#context");
		this.ui.btnTool 	= $("#btn-tool");
		this.ui.btnBuy		= $("#btn-buy");

		this.template = {};
		this.template.header  = artTemplate.compile(__inline("header.tmpl"));
		this.template.context = artTemplate.compile(__inline("context.tmpl"));

		this.smartbar = smartbar.create();
		this.ui.btnTool.css({
			bottom: this.smartbar.getHeight()
		});
		this.createWaterfall();

		this.getData();
		this.getHeader();

		this.regEvent();
	},

	regEvent: function () {
		this.ui.btnBuy.on("click", $.proxy(function () {
			eventFactory.exec({
				"wap": function () {
					window.location.href = "$root$/product/home.html";
				},
				"app": function () {
					window.location.href = appApi.getProductList({type: 3});
				}
			});
			
		}, this));
	},

	getHeader: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result 	= e.data;
			var data = {
				fProfit: moneyCny.toFixed(result.fProfit, 2),
				fMoneyAmount: moneyCny.toFixed(result.fMoneyAmount, 2),
				fProfitYesterday: moneyCny.toFixed(result.fProfitYesterday, 2)
			};

			this.ui.header.html(this.template.header(data));
		};

		options.error = function () {
			
		};

		api.send(api.PRODUCT, "assetQuery", options, this);
	},

	getData: function () {
		var options = {};

		options.data = {
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		}; 

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);

 			if(result.list.length > 0){ 				
	 			this.waterfall.setPageCount(result.pageCount);
	 			this.waterfall.appendContext(this.template.context({data: data}));
		 		return;
	 		}

			this.waterfall.showEmpty();
		};

		options.error = function () {
			this.waterfall.showEmpty();
		};

		this.waterfall.showLoading();		
		api.send(api.PRODUCT, "queryInvestRecordsByHqb", options, this);
	},

	createWaterfall: function (data) {
 		var _this = this;
 		var padding = this.smartbar.getHeight() + this.ui.btnTool.height();

 		this.waterfall = waterfall.create({
 			selector: ".waterfall-item",
 			pageSize: this.pageSize,
 			pageIndex: 1,
 			pageCount: 1,
 			padding: padding,
 			container: this.ui.context,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	},

 	format: function (data) {
 		for(var i = 0; i < data.length; i++){
 			var result  		= data[i];
 			var fYields 		= Number(result.fYields) * 100;
 			var fInterestTime 	= result.fInterestTime.parseDate();

 			result.fRedeemAble 		= Number(result.fRedeemAble);
 			result.fYields		 	= moneyCny.toDecimalStr(fYields, 1);
 			result.fInterestTime	= fInterestTime.format("yyyyMMdd");
 			result.fPrincipalLeft	= moneyCny.toFixed(result.fPrincipalLeft);
 			result.fProfitDueIn		= moneyCny.toFixed(result.fProfitDuein);

 			data[i] = result;
 		} 

 		return data;
 	}

};

myHqb.init();