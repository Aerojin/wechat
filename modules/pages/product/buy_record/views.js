/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var moneyCny		= require("kit/money_cny");
var queryString 	= require("kit/query_string");
var iscroll 		= require("ui/iscroll/views");
var loadingPage		= require("ui/loading_page/loading_page");

var views = {
	pageSize: 20,

	init: function () {

		this.ui = {};
		this.ui.context = $("#context");

		this.queryString 	= queryString();
		this.template 		= artTemplate.compile(__inline("context.tmpl"));

		loadingPage.show();
		this.createWaterfall();
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = {
			pageIndex: 1,
			pageSize: this.pageSize,
			productId: this.queryString.productId
		};

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);

 			if(result.list.length > 0){ 				
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({data: data}));
	 			loadingPage.hide();
		 		return;
	 		}

	 		loadingPage.hide();
			this.iscroll.showEmpty();
		};

		options.error = function (e) {
			loadingPage.hide();
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();
		api.send(api.PRODUCT, "queryProductInvest", options, this);
	},

	format: function (data) {
		data.map(function(elem, index) {
			elem.investUserName = elem.investUserName;
			elem.bizTime 		= elem.bizTime.parseDate();
			elem.investAmt 		= moneyCny.toFixed(elem.investAmt, 2);
			elem.date1 			= elem.bizTime.format("yyyy-MM-dd");
			elem.date2 			= elem.bizTime.format("hh:mm:ss");
		});

		return data;
	},

	createWaterfall: function (data) {
 		var _this = this;

 		this.iscroll = iscroll.create({
 			pageIndex: 1,
 			pageCount: 1,
 			pageSize: this.pageSize,
 			container: this.ui.context,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	}
};

views.init();