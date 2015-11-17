/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var versions 		= require("base/versions");
var validate 		= require("kit/validate");
var urlParam    	= require("kit/query_string");
var appApi 		 	= require("kit/app_api");
var eventFactory 	= require("base/event_factory");
var smartbar		= require("ui/smartbar/smartbar");
var slider 			= require("ui/slider_page/slider_page");
var vipUpgrade		= require("ui/vip_upgrade/vip_upgrade");

var hqb 	= require("hqb");
var fixed 	= require("fixed");
var floats 	= require("float");

var home = {
	init: function () {

		this.ui = {};
		this.ui.btnBuy 		= $("#btn-buy");
		this.ui.context 	= $("#context");
		this.ui.menu 		= $("#ul-menu li");
		this.ui.list 		= this.ui.context.find(".wrap-item");

		this.queryString 	= urlParam();

		slider.create({
			activeClass: "active",
			menu: this.ui.menu,
			list: this.ui.list,
			context: this.ui.context,
			index: this.queryString.index
		});

		this.smartbar = smartbar.create();
		this.smartbar.setState("home");

		hqb.create({
			container: this.ui.list.eq(0)
		});

		fixed.create({
			padding: this.getPadding(),
			container: this.ui.list.eq(1)
		});

		floats.create({
			padding: this.getPadding(),
			container: this.ui.list.eq(2)
		});

		this.regEvent();
		this.showVIPDialog();
	},

	regEvent: function () {

		this.ui.btnBuy.on("click", $.proxy(function () {
			eventFactory.exec({
				wap: function () {
					window.location.href = "$root$/user/login.html";
				},
				app: function () {
					window.location.href = appApi.getLogin();
				}
			});

			return false;
		}, this));
	},

	getPadding: function () {
		 return this.smartbar.getHeight();
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
	}

};

home.init();