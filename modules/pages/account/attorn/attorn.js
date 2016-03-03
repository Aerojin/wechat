
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var validate 	= require("kit/validate");
var moneyCny	= require("kit/money_cny");
var iscroll 	= require("ui/iscroll/views");

var attorn = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui       = {};
		this.ui.wrap  = options.container;
		this.template = artTemplate.compile(__inline("attorn.tmpl"));

		this.createWaterfall();
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = {
			pageSize: this.pageSize,
			pageIndex: this.pageIndex,
			isTransferable : true
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

		api.send(api.PRODUCT, "queryAttornInvestRecords", options, this);
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
 			var result  	    = data[i];
 			var fBizTime 	    = result.investTime.parseDate();//投资时间
 			var fStartTime 	    = result.profitCalcDate.parseDate();//起息时间	
 			result.fBizTime		= fBizTime.format("yyyy-MM-dd hh:mm:ss");
 			result.fStartTime	= fStartTime.format("yyyyMMdd");
			result.oddProfit	= moneyCny.toFixed(result.oddProfit);//预期收益
			result.oddPrincipal	= moneyCny.toFixed(result.oddPrincipal);//投资原始本金
			result.equityURL 	= this.getEquityURL(result);//协议
			result.submitURL    = "$root$/account/doattorn.html?investId=" + result.fid;

			if(result.transferStatus == 3){
				result.beforeDetail = "$root$/account/partTransferDetail.html?investId=" + result.fid;
			}

			data[i] = result;
 		}
 		return data;
 	},

 	getParam: function (data) {
 		var param = {};

 		param.fId 			= data.fid;
 		param.productType  	= data.productType;
 		param.productId     = data.productId;
 		param.investId      = data.fid;//兼容转让专区产品的债权转让服务协议查询时需要的接口参数

		return $.param(param);
 	},

 	getEquityURL: function (data) {
 		var result = data.featureRlt[0] || [];

 		if(validate.isEmpty(result)){
 			return {
				featureName: "",
				featureDesc: "",
				featureValue: "javascript:void(0);"
			};
 		}

 		result.featureValue += "?" + this.getParam(data);

 		return result;
 	}

};

module.exports = {
	create: function (options) {
		attorn.init(options || {});
	}
};