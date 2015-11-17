/**
 * @require style.css  
 */
var $ 				= require("zepto");
var queryString 	= require("kit/query_string");
var getDefaultUri	= require("kit/default_uri");
var loading 		= require("ui/loading_button/loading_button");
var tipMessage		= require("ui/tip_message/tip_message");
var loginViews 		= require("pages/user/login/login_views");

var login = {
	init: function () {

		this.ui = {};
		this.ui.txtMobile 	= $("#txt-mobile");
		this.ui.txtPassword = $("#txt-password");
		this.ui.btnSubmit 	= $("#btn-submit");
		this.ui.btnForget 	= $("#btn-forget");
		this.ui.ad 			= $("#img-ad");

		this.queryString = queryString();
		this.ui.txtMobile.val(this.queryString.mobile || "");

		this.views = new loginViews({
			param: this.queryString,
			redirect: this.queryString.redirect,
			btnSubmit: this.ui.btnSubmit,
			txtMobile: this.ui.txtMobile,
			txtPassword: this.ui.txtPassword
		});

		this.regEvent();
	},

	regEvent: function () {
		this.ui.btnForget.on("click", $.proxy(function () {
			window.location.href = "$root$/user/forget.html?mobile=" + this.ui.txtMobile.val();
		}, this));
	}
};

login.init();