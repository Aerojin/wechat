var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var waterfall 	= require("ui/waterfall/waterfall");
var artTemplate = require("artTemplate");
var tipMessage 	= require("ui/tip_message/tip_message");

var unused = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui = {};	
		this.ui.number = options.number;
		this.ui.wrap   = options.container;


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
			userId : user.get("userId"),
			status : this.state
		}; 

		options.success = function (e) {
			var result 	= e.data || {};
			var data 	= this.format(result.list || [], this.state);

 			if(data.length > 0){
 				this.ui.number.text(data.length);
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
		api.send(api.ACTIVITY, "findExperienceCashList", options, this);
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
		unused.init(options || {});
	}
};