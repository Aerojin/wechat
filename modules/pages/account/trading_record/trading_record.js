/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var moneyCny		= require("kit/money_cny");
var waterfall 		= require("ui/waterfall/waterfall");
var smartbar		= require("ui/smartbar/smartbar");

 var record = {
 	
 	pageIndex: 1,

	pageSize: 10,

 	init: function () {
 		
 		this.ui = {};
		this.ui.header 		= $("#header");
		this.ui.context 	= $("#context");

		this.template = {};
		this.template.header  = artTemplate.compile(__inline("header.tmpl"));
		this.template.context = artTemplate.compile(__inline("context.tmpl"));

		this.smartbar = smartbar.create();
		this.createWaterfall();

		this.getData();
		this.getHeader();
 	},

 	getHeader: function () {
 		var options = {
 			data: {}
 		};

		options.success = function (e) {
			var result 	= e.data;
			
			result.outingAmount 	= moneyCny.toFixed(result.outingAmount, 2);
			result.outTotalAmount	= moneyCny.toFixed(result.outTotalAmount, 2);
			
			this.ui.header.html(this.template.header(result));
		};

		options.error = function () {
			
		};

		api.send(api.ACCOUNT, "getWithdrawSummary", options, this);
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
		api.send(api.ACCOUNT, "queryWithdrawLog", options, this);
	},

	createWaterfall: function (data) {
 		var _this = this;
 		var padding = this.smartbar.getHeight() + 10;

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
 		data.map(function (value, index) {
 			var date = value.bisTime.parseDate();

 			value.status 		= Number(value.status);
 			value.bisTime 		= date.format("yyyy-MM-dd hh:mm:ss");
 			value.totalAmount 	= moneyCny.toFixed(value.totalAmount, 2);
 		});

 		return data;
 	}

 };

 record.init();