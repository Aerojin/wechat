/**
 * @require attornedDetail.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny	= require("kit/money_cny");
var validate 	= require("kit/validate");
var queryString = require("kit/query_string");

var attornedDetail = {

	init: function () {
		this.ui          = {};
		this.ui.view     = $("#view");
		this.template    = artTemplate.compile(__inline("attornedDetail.tmpl"));
		this.queryString = queryString();
		this.getData();
	},

	getData: function () {
		var options = {
			data: {
				transferId : this.queryString.transferId
			}
		};

		options.success = function (e) {
			var result 	          = e.data.transferRecord;

			var profitCalcDate 	  = result.profitCalcDate.parseDate();//起息日    
 			var transferTime 	  = result.transferTime.parseDate();//转让时间   
 			var refundDate 	      = result.refundDate.parseDate();//回款日       
 			result.profitCalcDate = profitCalcDate.format("yyyy/MM/dd");
 			result.transferTime	  = transferTime.format("yyyy/MM/dd");
 			result.refundDate	  = refundDate.format("yyyy/MM/dd");

 			result.profit 	      = moneyCny.toFixed(result.profit);
 			result.salesProfit 	  = moneyCny.toFixed(result.salesProfit);
 			result.fee            = moneyCny.toFixed(result.fee);
			result.principal	  = moneyCny.toFixed(result.principal);//投资本金
			result.salesPrincipal = moneyCny.toFixed(result.salesPrincipal);//转让本金
			result.salesAmount	  = moneyCny.toFixed(result.salesAmount);//转出金额
			result.oddPrincipal	  = moneyCny.toFixed(result.oddPrincipal);//剩余本金
			result.oddProfit	  = moneyCny.toFixed(result.oddProfit);//预期剩余收益

			this.ui.view.html(this.template(result));
		};

		options.error = function () {
			
		};

		api.send(api.PRODUCT, "getAttornedDetail", options, this);
	}
};

attornedDetail.init();