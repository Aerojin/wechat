/**
 * @require style.css  
 */
 //1：天添牛，2：指数牛，3：活期宝 4:惠房宝 5: 信托一号, 6:bs2p
var $ 				= require("zepto");
var api 			= require("api/api");
var model 			= require("product_model");
var queryString 	= require("kit/query_string");
var loadingPage		= require("ui/loading_page/loading_page");

var defaultViews 	= require("default_views");
var portionViews 	= require("portion_views");

var views = {
	init: function () {

		this.ui = {};
		this.ui.title = $("title");
		this.ui.wrap  = $("#wrap");

		this.queryString 	= queryString();
		
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = {
			fid: this.queryString.fid
		};

		options.success = function (e) {
			var result 	= e.data;
			this.model = new model(result);

			this.render();
		};

		options.error = function (e) {
			loadingPage.error();
		};

		api.send(api.PRODUCT, "getTransferProductById", options, this);
	},

	render: function () {
		var _this = this;

		this.views = this.getViews();

		this.ui.wrap.empty().append(this.views.getElement());
		loadingPage.hide();
	},

	getViews: function () {
		if(this.model.getBuyType() == 100){
			return new portionViews({
				model: this.model
			});
		}

		return new defaultViews({
			model: this.model
		});
	}
};

loadingPage.show();
views.init();