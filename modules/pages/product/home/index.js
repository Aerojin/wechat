/**
 * @require style.css  
 */

var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var versions 		= require("base/versions");
var urlParam    	= require("kit/query_string");
var smartbar		= require("ui/smartbar/smartbar");
var vipUpgrade		= require("ui/vip_upgrade/vip_upgrade");
var loadingPage		= require("ui/loading_page/loading_page");
var productViews 	= require("product_views");

var index = {
	init: function () {

		this.ui = {};
		this.ui.wrap 			= $("#wrap");
		this.ui.hqbContext 		= this.ui.wrap.find(".hqb-context");
		this.ui.fixedContext 	= this.ui.wrap.find(".fixed-context");

		this.queryString = urlParam();

		this.smartbar = smartbar.create();
		this.smartbar.setState("home");

		loadingPage.show();
		this.getData();
		this.showVIPDialog();
	},

	showVIPDialog: function () {
		if(user.get("firstLevelUp") && !versions.isApp()){
			user.set("firstLevelUp", false);
			vipUpgrade.create({vipLevel: user.get("memberLevel")});

			this.vipUpdate();
		}
	},

	vipUpdate: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {

		};

		options.error = function (e) {

		};

		api.send(api.USER, "firstUpgradePrompt", options, this);
	},

	getData: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data || {};

			this.renderHqb(result.currentData || {});
			this.renderFixed(result.fixedProduct || []);
			loadingPage.hide();
		};

		options.error = function () {
			
		};

		
		api.send(api.PRODUCT, "queryProductListByNew", options, this);
	},

	renderHqb: function (data) {
		var hqb = new productViews({
			data: data
		});

		this.ui.hqbContext.empty().append(hqb.getElement());
	},
	renderFixed: function (data) {
		this.ui.fixedContext.empty();

		for(var i = 0; i < data.length; i++){
			var item = new productViews({
				data: data[i]
			});

			this.ui.fixedContext.append(item.getElement());
		}
	}
};

index.init();