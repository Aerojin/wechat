/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var moneyCny		= require("kit/money_cny");
var iscroll 		= require("ui/iscroll/views");
var loadingPage		= require("ui/loading_page/loading_page");
var tipMessage  	= require("ui/tip_message/tip_message");


var staticImgSrc = __uri("ico-rateUp.png");

var holding = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {
		
		this.ui = {};
		this.ui.wrap 	= options.container;
		this.template  	= artTemplate.compile(__inline("context.tmpl"));

		this.padding = options.padding;

		this.createWaterfall();
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = {
			status: 2,
			parentProductType: 3,
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		}; 

		options.success = function (e) {
			loadingPage.hide();

			var result 	= e.data;
			var data 	= this.format(result.list || []);

 			if(result.list.length > 0){
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({
	 				data: data,
	 				iconSrc: staticImgSrc
	 			}));
		 		return;
	 		}

			this.iscroll.showEmpty();
		};

		options.error = function () {
			loadingPage.hide();
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();
		api.send(api.PRODUCT, "queryUserInvestRecord", options, this);
	},

 	format: function (data) {
 		for(var i = 0; i < data.length; i++){
 			var result  			= data[i];
 			var fRate 				= result.rate;
 			var fProfitCalcDate 	= result.profitCalcDate.parseDate();

 			result.fRedeemAble 		= Number(result.fRedeemAble);
 			result.fRate		 	= moneyCny.toDecimalStr(fRate, 1);
 			result.fProfitCalcDate	= fProfitCalcDate.format("yyyy-MM-dd");
 			result.fPrincipal		= moneyCny.toFixed(result.oddPrincipal);
 			result.fTotalProfit		= moneyCny.toFixed(result.oddProfit);
 			result.tip 				= "可随时赎回";

 			var regRst = result.rateHint.match(/\d+(\.\d+)?\%/) || [""];
 			result.rateHint1		= regRst[0];
 			result.rateHint2		= result.rateHint.replace(result.rateHint1, "");


 			var serverDate = result.serverTime.parseDate().format("yyyy-MM-dd").parseDate();
 			var refundDate = result.refundDate.parseDate().format("yyyy-MM-dd").parseDate();

 			var spanTime = refundDate - serverDate;
 			var spanDay  = spanTime / 1000 / 3600 / 24;

 			if(spanDay > 0){
 				result.tip = "{0}天后可赎回".format(spanDay);
 			}

 			data[i] = result;
 		}

 		return data;
 	},
	
 	createWaterfall: function (data) {
 		var _this = this;

 		this.iscroll = iscroll.create({
 			pageIndex: 1,
 			pageCount: 1,
 			pageSize: this.pageSize,
 			container: this.ui.wrap,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	}
};

loadingPage.show();
module.exports = {
	create: function (options) {
		holding.init(options || {});
	}
};