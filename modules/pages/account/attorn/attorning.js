
var $ 			= require("zepto");
var api 		= require("api/api");
var validate 	= require("kit/validate");
var iscroll 	= require("ui/iscroll/views");
var attorningItem = require("attorning_item");

var attorning = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui       = {};
		this.ui.wrap  = options.container;

		this.createWaterfall();
		this.getData();
	},

	regEvent: function () {
		var _this = this;
	},

	getData: function () {
		var options = {};

		options.data = {
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		};

		options.success = function (e) {
			var result 	= e.data;
			var data 	= result.list || [];
			
 			if(result.list.length > 0){
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.rander(data);
	 			
		 		return;
	 		}
	 		this.iscroll.showEmpty();
		};

		options.error = function (e) {
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();
		api.send(api.PRODUCT, "queryAttorningRecords", options, this);
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

 	rander: function (list) {
 		var _this = this;

 		list.map(function (value, index) {
 			var item = new attorningItem({data: value});

 			_this.iscroll.appendContext(item.getElement(), true);
 		});
 	}

};

module.exports = {
	create: function (options) {
		attorning.init(options || {});
	}
};