var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var artTemplate = require("artTemplate");
var iscroll 	= require("ui/iscroll/views");
var tipMessage 	= require("ui/tip_message/tip_message");

var holding = {

	pageIndex: 1,

	pageSize: 10,

	currentData: {
		proType:""		//产品类型 (1/固定产品,2/浮动产品)
	},

	init: function (options) {

		this.ui = {};
		this.ui.wrap 	= options.container;
		this.template  	= artTemplate.compile(__inline("context.tmpl"));

		this.format  = options.format;
		this.padding = options.padding;

		this.currentData.proType = options.proType || "";

		this.createWaterfall();
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = $.extend(this.currentData, {
			state: 2,
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		});

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);
			
 			if(result.list.length > 0){
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({
		 				state: 2,
		 				data: data
 				}));
		 		return;
	 		}

	 		this.iscroll.showEmpty();
		};

		options.error = function (e) {
			this.iscroll.showEmpty();
		};

		api.send(api.PRODUCT, "queryInvestRecords", options, this);
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

module.exports = {
	create: function (options) {
		holding.init(options || {});
	}
};