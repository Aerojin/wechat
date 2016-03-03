/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var queryString    	= require("kit/query_string");
var loadingPage		= require("ui/loading_page/loading_page");
var productViews 	= require("product_views");

var views = {
	init: function () {

		this.ui = {};
		this.ui.title 	= $("title");
		this.ui.context = $("#context");

		this.queryString  = queryString();

		loadingPage.show();
		this.getData();
	},

	getData: function () {
		var options = {};
		
		options.data = {
			fid: this.queryString.fid
		};

		options.success = function (e) {
			var result 	= e.data;

			var views = new productViews({
				data: result
			});

			this.ui.title.text(result.productName);
			this.ui.context.empty().append(views.getElement());
			loadingPage.hide();
		};

		options.error = function (e) {

		};

		
		api.send(api.PRODUCT, "getProductById", options, this);
	}
};

views.init();