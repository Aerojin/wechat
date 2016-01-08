/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var smartbar		= require("ui/smartbar/smartbar");
var confirm 		= require("ui/confirm/confirm");
var queryString 	= require("kit/query_string");
var tipMessage  	= require("ui/tip_message/tip_message");

var TIPS = {
	CONFIRM_EXIT: "确定要退出吗?"
};

var setting = {
	init: function () {
		
		this.ui = {};
		this.ui.btnLogout 		= $("#btn-logout");
		this.ui.btnGoAccount	= $("#btn-goAccount");
		this.ui.btnChangePwd 	= $("#btn-changePwd");
		this.ui.btnGoGuide 	    = $("#btn-goGuide");

		this.queryString = queryString() || {};
		this.queryString.mobile = user.get("loginName");
		
		this.smartbar 	= smartbar.create();
		
		this.regEvent();
	},
	regEvent: function () {
		var _this = this;

		this.ui.btnLogout.on("tap", $.proxy(function () {
			confirm(TIPS.CONFIRM_EXIT, {
				callback: function(result) {
					if(result){
						_this.logout();
					}
				}
			});

			return false;
		}, this));

		this.ui.btnGoAccount.on("tap", $.proxy(function () {

			tipMessage.show("敬请期待", {delay: 2000});
			return false;
			
			this.smartbar.setState("account");
			window.location.href = "$root$/account/my_account.html";

			return false;
		}, this));

		this.ui.btnChangePwd.on("tap", $.proxy(function () {
			window.location.href = "$root$/account/change_pwd.html?" + $.param(this.queryString);

			return false;
		}, this));

		this.ui.btnGoGuide.on("tap", $.proxy(function () {
			window.location.href = "$root$/activity/guide/index.html";

			return false;
		}, this));

	},
	logout: function () {
		var options = {};

		options.data = {
			userId: user.get("userId"),
			token: user.get("token")
		};

		options.success = function (e) {
			localStorage.clear();
			sessionStorage.clear();
			
			window.location.href = "$root$/user/login.html?" + $.param(this.queryString);
		};

		options.error = function (e) {
			user.clear();
			window.location.href = "$root$/user/login.html?" + $.param(this.queryString);
		};
		
		api.send(api.USER, "logout", options, this);
	}

};

setting.init();