var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var iscroll 	= require("ui/iscroll/views");
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

	regEvent:function(){
		this.ui.items.on("tap", function(){
			var link = $(this).data("link");
			window.location.href = link;

			return false;
		});

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
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template.context({data: data}));

	 			this.setContext();
		 		return;
	 		}

			this.iscroll.showEmpty();
		};

		options.error = function () {
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();		
		api.send(api.ACTIVITY, "findExperienceCashList", options, this);
	},

	setContext:function(){
		this.ui.items = this.ui.wrap.find("li");

		this.regEvent();
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
		unused.init(options || {});
	}
};