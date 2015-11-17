/**
 * @require style.css  
 */
var $ 				= require("zepto");
var queryString 	= require("kit/query_string");
var sliderBar 		= require("ui/slider_bar/slider_bar");
var registerViews 	= require("pages/user/register/register_views");

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
		this.ui.ad 				= $("#img-ad");
		this.ui.sliderContainer	= $("#slider-container");

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
		this.createSlider();
	},

	regEvent: function () {

		this.ui.txtMobile.on("input", $.proxy(function () {
			this.ui.tips.hide();

			var mobile = this.ui.txtMobile.val().trim();

			if(mobile.length > 0){
				this.ui.login.attr("href", "$root$/user/nw_login.html?mobile=" + mobile);
				return;
			}

			this.ui.login.attr("href", "$root$/user/nw_login.html");
			
		}, this));
	},

	createSlider: function () {
		var data = [];

		data.push({
			src: __uri("/views/images/nw/nw_register1.png")
		});

		data.push({
			src: __uri("/views/images/nw/nw_register3.png")
		});

		this.slider = new sliderBar.create({
			data: data,
			container: this.ui.sliderContainer
		});			
	}
};

register.init();