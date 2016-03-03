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
		this.ui.tranWrap 		= $("#tran-wrap");
		this.ui.hqbContext 		= this.ui.wrap.find(".hqb-context");
		this.ui.tranContext 	= this.ui.wrap.find(".tran-context");
		this.ui.fixedContext 	= this.ui.wrap.find(".fixed-context");

		this.smartbar = smartbar.create();
		this.smartbar.setState("home");
		
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
		var options = {};

		options.data = {
			pageIndex: 1,
			pageSize: 100
		};

		options.success = function (e) {
			var result = e.data || {};

			this.rander(result.list || []);
			loadingPage.hide();
		};

		options.error = function () {
			
		};

		
		api.send(api.PRODUCT, "queryProductList", options, this);
	},

	rander: function (list) {
		var _this = this;

		this.ui.hqbContext.empty();
		this.ui.fixedContext.empty();

		list.map(function (value, index) {
			var item = new productViews({
				data: value
			});

			if(item.getData().isTransferProduct){
				_this.ui.tranWrap.show();
				_this.ui.tranContext.append(item.getElement());
			}else{
				if(item.isHqb()){
					_this.ui.hqbContext.append(item.getElement());
				}else{
					_this.ui.fixedContext.append(item.getElement());
				}				
			}			
		});
	}
};

loadingPage.show();
index.init();