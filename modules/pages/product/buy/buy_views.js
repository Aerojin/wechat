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
		var funName = this.getFunName();

		options.data = {
			productId: this.queryString.productId
		};

		options.success = function (e) {
			var result 	= e.data;

			var hqb = new productViews({
				data: result
			});

			this.ui.title.text(result.productName);
			this.ui.context.empty().append(hqb.getElement());
			loadingPage.hide();
		};

		options.error = function (e) {

		};

		
		api.send(api.PRODUCT, funName, options, this);
	},

	getFunName: function () {
		if(Number(this.queryString.typeValue) == 3){
			return "queryProductInfo";
		}

		return "queryProductById";
	}
};

views.init();