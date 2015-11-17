/**
 * @require style.css  
 */
var $ 			= require("zepto");
var queryString = require("kit/query_string");
var loginViews  = require("login_views");

var login = {
	init: function () {
		this.ui = {};
		this.ui.txtMobile 	= $("#txt-mobile");
		this.ui.txtPassword = $("#txt-password");
		this.ui.btnSubmit 	= $("#btn-submit");
		this.ui.btnForget 	= $("#btn-forget");
		this.ui.btnRegister	= $("#btn-register");

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
		this.ui.btnRegister.on("click", $.proxy(function () {
			var data = $.extend(this.queryString, {
				mobile: this.ui.txtMobile.val()
			});

			window.location.href = "$root$/user/register.html?" + $.param(data);
		}, this));

		this.ui.btnForget.on("click", $.proxy(function () {
			window.location.href = "$root$/user/forget.html?mobile=" + this.ui.txtMobile.val();
		}, this));
	}
};

login.init();