/**
 * @require style.css  
 */

var $ 				= require("zepto");
var api 			= require("api/api");
var smartbar		= require("ui/smartbar/smartbar");
var iscroll 		= require("ui/iscroll/views");
var loadingPage		= require("ui/loading_page/loading_page");
var productViews 	= require("product_views");

var index = {
	init: function () {

		this.ui = {};
		this.ui.wrap 			= $("#wrap");
		this.ui.divContext 		= this.ui.wrap.find(".div-context");
		
		this.smartbar = smartbar.create();

		this.createScroll();
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = {
			flag: 1,
			pageIndex: 1,
			pageSize: 10
		};

		options.success = function (e) {
			var result = e.data || {};
			var data   = result.list || [];

 			if(result.list.length > 0){ 				
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.rander(data);
	 			loadingPage.hide();
		 		return;
	 		}

	 		loadingPage.hide();
			this.iscroll.showEmpty();
		};

		options.error = function () {
			loadingPage.hide();
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();
		api.send(api.PRODUCT, "queryTransferProduct", options, this);
	},

	rander: function (list) {
		var _this = this;

		list.map(function (value, index) {
			var item = new productViews({
				data: value
			});

			_this.iscroll.appendContext(item.getElement(), true);
		});
	},

	createScroll: function (data) {
 		var _this = this;

 		this.iscroll = iscroll.create({
 			pageIndex: 1,
 			pageCount: 1,
 			pageSize: this.pageSize,
 			container: this.ui.divContext,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	}
};

loadingPage.show();
index.init();