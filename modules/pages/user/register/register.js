/**
 * @require style.css  
 */
var $ 				= require("zepto");
var queryString 	= require("kit/query_string");
var registerViews 	= require("register_views");

var register = {
	init: function () {
		var _this = this;

		this.ui = {};
		this.ui.tips 			= $("#tips");
		this.ui.txtMobile		= $("#txt-mobile");
		this.ui.txtCode			= $("#txt-code");
		this.ui.txtPassword1 	= $("#txt-password1");
		this.ui.txtPassword2 	= $("#txt-password2");
		this.ui.txtRecommend 	= $("#txt-recommend");				
		this.ui.btnSubmit 		= $("#btn-submit");
		this.ui.btnSend 		= $("#btn-send");
		this.ui.btnDisSend 		= $("#btn-dis-send");
		this.ui.btnShowPass 	= $("#btn-showpass");
		this.ui.login 			= $(".a-login");
		this.ui.btnPact			= $("#btn-pact");
		

		this.queryString = queryString() || {};
		this.ui.txtMobile.val(this.queryString.mobile || "");
		this.ui.txtRecommend.val(this.queryString.referrer || "");

		this.views = new registerViews({
			param: this.queryString,
			redirect: this.queryString.redirect,
			txtCode: this.ui.txtCode,
			txtMobile: this.ui.txtMobile,
			txtPassword1: this.ui.txtPassword1,
			txtPassword2: this.ui.txtPassword2,
			txtRecommend: this.ui.txtRecommend,
			btnSubmit: this.ui.btnSubmit,
			btnSend: this.ui.btnSend,
			btnDisSend: this.ui.btnDisSend,
			btnShowPass: this.ui.btnShowPass
		});

		this.views.onCheckMobile = function (result) {
			if(result){
				_this.ui.tips.show();
			}
		};

		this.regEvent();
	},

	regEvent: function () {
		this.ui.txtMobile.on("input", $.proxy(function () {
			this.ui.tips.hide();

			var mobile = this.ui.txtMobile.val().trim();

			if(mobile.length > 0){
				this.ui.login.attr("href", "$root$/user/login.html?mobile=" + mobile);
				return;
			}

			this.ui.login.attr("href", "$root$/user/login.html");
			
		}, this));

		this.ui.btnPact.on("touchstart click", $.proxy(function () {
			var state = this.ui.btnPact.data("state");

			if(state == 1){
				this.setDisSubmit();
				this.ui.btnPact.data('state', 0);
				this.ui.btnPact.removeClass('pact-on');

				return false;
			}

			this.activateSubmit();
			this.ui.btnPact.data('state', 1);
			this.ui.btnPact.addClass('pact-on');

			return false;
		}, this));
	},

	setDisSubmit: function () {
		this.ui.btnSubmit.addClass('oper-btn-gray');
	},

	activateSubmit: function () {
		this.ui.btnSubmit.removeClass('oper-btn-gray');	
	}
};

register.init();