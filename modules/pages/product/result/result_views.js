var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny 	= require("kit/money_cny");

/*
	PARENT_TYPE 产品大类
	1.固定
	2.浮动
	3.活期
	利用接口的值做映射, key所对应的是接口的值, value是转换后的值
*/
var PARENT_TYPE = {
	FIXED: 1,
	FLOAT: 2,
	HQB: 3
};

var views = function (options){
	options = options || {};

	this.investId 	= options.investId;
	this.onLoad 	= options.onLoad || function () {};

	this.init();
};

views.prototype.init = function () {
	this.getData();
};

//获取产品购买结果
views.prototype.getData = function () {
	var options = {};

	options.data = {
		investId: this.investId
	};

	options.success = function (e) {
		var result 	= e.data || {};
		var tmpl 	= this.getTemplate(result);
		var data 	= this.format(result);
		
		this.data = data;	

		this.onLoad({
			result: true,
			data: result,
			element: tmpl(data)
		});
	};

	options.error = function (e) {
		this.onLoad({
			result: false,
			data: {}
		});
	};

	api.send(api.PRODUCT, "getInvestDetailById", options, this);
};

//根据产品类型返回模板
views.prototype.getTemplate = function (data) {
	if(Number(data.parentProductType) == PARENT_TYPE.HQB){
		return artTemplate.compile(__inline("hqb.tmpl"));
	}

	return artTemplate.compile(__inline("fixed.tmpl"));
};

//数据格式化
views.prototype.format = function (data) {

	data.bizTime 	= data.investTime.parseDate().format("yyyy-MM-dd");
	data.backTime 	= data.refundDate.parseDate().format("yyyy-MM-dd");
	data.startTime 	= data.profitCalcDate.parseDate().format("yyyy-MM-dd");
	data.earnings 	= moneyCny.toYuan(data.oddProfit);
	data.amount 	= moneyCny.toYuan(data.oddPrincipal);

	return data;
};

views.prototype.getRecordUri = function () { 
	if(this.data.parentProductType == PARENT_TYPE.HQB){
		return "$root$/account/my_hqb.html";
	}

	return "$root$/account/my_invest_record.html";
};



module.exports = {
	create: function (options) {
		return new views(options || {});
	}
};