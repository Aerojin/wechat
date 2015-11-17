var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var priductFormat	= require("kit/product_format");
var waterfall 	 	= require("ui/waterfall/waterfall");
var tipMessage 		= require("ui/tip_message/tip_message");

var TIPS = {
 	DATA_LOADING: "数据加载中..."
};

var fixed = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui = {};	
		this.ui.wrap 	= options.container;
		this.template  	= artTemplate.compile(__inline("fixed_context.tmpl"));

		this.createWaterfall(options);
		this.getData();
	},
	regEvent: function () {

	},

	getData: function () {
		var options = {};

		options.data = {
			isFlow: 1,
			pageSize: this.pageSize,
			pageIndex: this.pageIndex			
		}; 

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);

 			if(result.list.length > 0){
	 			this.waterfall.setPageCount(result.pageCount);
	 			this.waterfall.appendContext(this.template({data: data}));

		 		return;
	 		}

			this.waterfall.showEmpty();
		};

		options.error = function () {
			this.waterfall.showEmpty();
		};

		this.waterfall.showLoading();		
		api.send(api.PRODUCT, "queryProductList", options, this);
	},

	createWaterfall: function (options) {
 		var _this = this;

 		this.waterfall = waterfall.create({
 			selector: ".waterfall-item",
 			pageSize: this.pageSize,
 			pageIndex: 1,
 			pageCount: 1,
 			container: this.ui.wrap,
 			padding: options.padding,
 			noScroll: options.noScroll,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	},

 	format: function (data){
 		var array = [];

 		for(var i = 0; i < data.length; i++){
 			var result = priductFormat.format(data[i]);

 			array.push($.extend(result, {
 				fixRate: data[i].fixRateDisplay,
 				productName: data[i].productName,
 				buyMinMoney: data[i].buyMinMoney,
 				awardRateFlag: data[i].awardRateFlag
 			}));
 		}

 		return array;
 	}

};

module.exports = {
	create: function (options) {
		fixed.init(options || {});
	}
};