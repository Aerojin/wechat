/**
 * @require style.css  
*/
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var moneyCny		= require("kit/money_cny");
var smartbar		= require("ui/smartbar/smartbar");
var waterfall 		= require("ui/waterfall/waterfall");
var loadingPage		= require("ui/loading_page/loading_page");

 var record = {
 	
 	pageIndex: 1,

	pageSize: 10,

 	init: function () {
 		
 		this.ui = {};
		this.ui.header 		= $("#header");
		this.ui.context 	= $("#context");

		this.template = {};
		this.template.context = artTemplate.compile(__inline("context.tmpl"));

		loadingPage.show();
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
			var result = e.data;
			var amount = moneyCny.toFixed(result, 2)

			this.ui.header.find(".span-amount").text(amount);
			loadingPage.hide();
		};

		options.error = function () {
			
		};

		api.send(api.ACCOUNT, "getAbleBalance", options, this);
 	},

 	getData: function () {
		var options = {};

		options.data = {
			transType: "",
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
		api.send(api.ACCOUNT, "queryUserBalanceLogByPage", options, this);
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
 			var date = value.transDate.parseDate();

 			value.transDate 	= date.format("yyyy-MM-dd hh:mm:ss");
 			value.transAmount 	= moneyCny.toFixed(value.transAmount, 2);
 		});

 		return data;
 	}

 };

 record.init();