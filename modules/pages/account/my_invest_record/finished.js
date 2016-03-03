var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var artTemplate = require("artTemplate");
var iscroll 	= require("ui/iscroll/views");
var tipMessage 	= require("ui/tip_message/tip_message");
var loadingPage	= require("ui/loading_page/loading_page");

var finished = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui = {};	
		this.ui.wrap 	= options.container;
		this.template  	= artTemplate.compile(__inline("context.tmpl"));

		this.proType =  options.proType;
		this.padding = options.padding;
		this.format  = options.format;

		loadingPage.show();
		this.createWaterfall();
		this.getData();
	},
	regEvent: function () {

	},

	getData: function () {
		var options = {};

		options.data = {
			status: 3,
			parentProductType: this.proType || 1,
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		}; 

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);

			loadingPage.hide();

 			if(result.list.length > 0){ 				
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({
	 				tabIndex: 2,
	 				status: 3,
	 				data: data
	 			}));
		 		return;
	 		}

			this.iscroll.showEmpty();
		};

		options.error = function () {
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();		
		api.send(api.PRODUCT, "queryUserInvestRecord", options, this);
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
		finished.init(options || {});
	}
};