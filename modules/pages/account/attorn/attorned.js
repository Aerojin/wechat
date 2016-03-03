var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var validate 	= require("kit/validate");
var moneyCny	= require("kit/money_cny");
var iscroll 	= require("ui/iscroll/views");

var attorned = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui       = {};
		this.ui.wrap  = options.container;
		this.menu     = options.menu;
		this.template = artTemplate.compile(__inline("attorned.tmpl"));

		this.createWaterfall();
		this.getData();
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
			
 			if(result.list && result.list.length > 0){
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({
		 				data: data
 				}));
		 		return;
	 		}

	 		this.iscroll.showEmpty();
		};

		options.error = function (e) {
			this.iscroll.showEmpty();
		};

		api.send(api.PRODUCT, "queryAttornedRecords", options, this);
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
 	},

 	format : function(data){
 		for(var i = 0; i < data.length; i++){
 			var result  	      = data[i];

 			var profitCalcDate 	  = result.profitCalcDate.parseDate();//起息日    
 			var transferTime 	  = result.transferTime.parseDate();//转让时间   
 			var refundDate 	      = result.refundDate.parseDate();//回款日       
 			result.profitCalcDate = profitCalcDate.format("yyyyMMdd");
 			result.transferTime	  = transferTime.format("yyyyMMdd");
 			result.refundDate	  = refundDate.format("yyyyMMdd");

			result.principal	  = moneyCny.toFixed(result.principal);//投资本金
			result.salesPrincipal = moneyCny.toFixed(result.salesPrincipal);//转让本金
			result.salesAmount	  = moneyCny.toFixed(result.salesAmount);//转出金额
			result.oddPrincipal	  = moneyCny.toFixed(result.oddPrincipal);//剩余本金
			result.oddProfit	  = moneyCny.toFixed(result.oddProfit);//预期剩余收益

			result.equityURL 	  = this.getEquityURL(result);//协议
			result.checkDetail    = "$root$/account/attornedDetail.html?transferId=" + result.fid;//转让详情

			data[i] = result;
 		}
 		return data;
 	},

 	getEquityURL: function (data) {
 		var result = data.featureRlt[0] || [];

 		if(validate.isEmpty(result)){
 			return {
				title: "",
				featureName: "",
				featureValue: "javascript:void(0);"
			};
 		}

 		result.featureValue += "?transferId=" + data.fid;

 		return result;
 	}

};

module.exports = {
	create: function (options) {
		attorned.init(options || {});
	}
};