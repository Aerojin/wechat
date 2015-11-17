var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var waterfall 	= require("ui/waterfall/waterfall");
var artTemplate = require("artTemplate");
var tipMessage 	= require("ui/tip_message/tip_message");

var buy = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui = {};	
		this.ui.wrap 	= options.container;
		this.template  	= artTemplate.compile(__inline("context.tmpl"));

		this.format  = options.format;
		this.padding = options.padding;

		this.createWaterfall();
		this.getData(options.proType);
	},
	
	getData: function (proType, format) {
		var options = {};

		options.data = {
			state: 2,
			proType: proType || "",
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		}; 

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);

 			if(result.list.length > 0){ 				
	 			this.waterfall.setPageCount(result.pageCount);
	 			this.waterfall.appendContext(this.template({
	 				state: 2,
	 				data: data
	 			}));
		 		return;
	 		}

			this.waterfall.showEmpty();
		};

		options.error = function () {
			this.waterfall.showEmpty();
		};

		this.waterfall.showLoading();		
		api.send(api.PRODUCT, "queryInvestRecords", options, this);
	},

	createWaterfall: function (data) {
 		var _this = this;

 		this.waterfall = waterfall.create({
 			selector: ".waterfall-item",
 			pageSize: this.pageSize,
 			pageIndex: 1,
 			pageCount: 1,
 			padding: this.padding,
 			container: this.ui.wrap,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	}
};

module.exports = {
	create: function (options) {
		buy.init(options || {});
	}
};