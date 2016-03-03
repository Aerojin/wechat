/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny 	= require("kit/money_cny");
var iscroll 	= require("ui/iscroll/views");
var smartbar	= require("ui/smartbar/smartbar");

var STATE = {
	"1": {
		text: "处理中", 
		cls: "sign-ing"
	},
	"2": {
		text: "处理中",
		cls: "sign-ing"
	},
	"3": {
		text: "已完成",
		cls: "sign-done"
	},
	"4": {
		text: "处理中",
		cls: "sign-ing"
	}
};

var finished = {
	
	pageIndex: 1,

	pageSize: 10,

	init: function (options) {
		this.ui = {};
		this.ui.wrap 	= options.container;
		this.template 	= artTemplate.compile(__inline("context_ransom.tmpl"));

		this.padding = options.padding;

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

 			if(result.list.length > 0){ 				
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({data: data}));
		 		return;
	 		}

			this.iscroll.showEmpty();
		};

		options.error = function () {
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();		
		api.send(api.PRODUCT, "queryCurrentRedeem", options, this);
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

 	format: function (data) {
 		for(var i = 0, len =data.length; i < len; i++){
 			var result = data[i];

 			result.fStatusText 	= STATE[result.status].text;
 			result.fStatusClass = STATE[result.status].cls;
 			result.fMoneyAmount = moneyCny.toFixed(result.amount);

 			result.fRequestTime = result.requestTime.parseDate().format("yyyy-MM-dd hh:mm:ss");

 			data[i] = result;
 		}

 		return data;
 	}
};

module.exports = {
	create: function (options) {
		finished.init(options || {});
	}
};