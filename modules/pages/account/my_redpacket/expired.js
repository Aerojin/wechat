var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var iscroll 	= require("ui/iscroll/views");
var artTemplate = require("artTemplate");
var tipMessage 	= require("ui/tip_message/tip_message");

var expired = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui = {};	
		this.ui.wrap 	= options.container;

		this.state  	= options.state;
		this.format 	= options.format;
		this.padding 	= options.padding;
		this.template	= options.template;

		this.createWaterfall();
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = {
			productId: "",
			status: this.state
		}; 

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || [], this.state);

 			if(data.length > 0){
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template.context({data: data}));
		 		return;
	 		}

			this.iscroll.showEmpty();
		};

		options.error = function () {
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();		
		api.send(api.ACTIVITY, "findRedPacketList", options, this);
	},

	createWaterfall: function (data) {
 		var _this = this;

 		this.iscroll = iscroll.create({
 			pageIndex: 1,
 			pageCount: 1,
 			pageSize: this.pageSize,
 			container: this.ui.wrap,
 			emptyHtml: this.template.empty,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	}
};



module.exports = {
	create: function (options) {
		expired.init(options || {});
	}
};