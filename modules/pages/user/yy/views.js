/**
 * @require style.css  
 */
 var $ 				= require("zepto");
var getDefaultUri	= require("kit/default_uri");
var queryString 	= require("kit/query_string");
var sliderBar 		= require("ui/slider_bar/slider_bar");
var tipMessage		= require("ui/tip_message/tip_message");
var registerViews 	= require("pages/user/register/register_views");

var register = {
	init: function () {
		var _this = this;

		this.ui = {};
		this.ui.txtMobile		= $("#txt-mobile");
		this.ui.txtCode			= $("#txt-code");
		this.ui.txtPassword1 	= $("#txt-password1");
		this.ui.txtPassword2 	= $("#txt-password2");
		this.ui.txtRecommend 	= $("#txt-recommend");				
		this.ui.btnSubmit 		= $("#btn-submit");
		this.ui.btnSend 		= $("#btn-send");
		this.ui.btnDisSend 		= $("#btn-dis-send");
		this.ui.btnShowPass 	= $("#btn-showpass");
		this.ui.btnPact			= $("#btn-pact");
		this.ui.tipDialogs 		= $("#tip-dialogs");
		this.ui.txtImgCode		= $("#txt-imgCode");
		this.ui.btnCode			= $("#btn-code");

		/*yy3_register*/
		this.ui.btnClose	 	= $("#btn-close");
		this.ui.divReg	 		= $("#div-reg");
		this.ui.btnShowReg	 	= $("#btn-showReg");

		/*yy2_register*/
		this.ui.btnMenu	 		= $("#btn-menu");
		this.ui.sliderContainer	= $("#slider-container");

		this.queryString = queryString() || {};

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
			btnShowPass: this.ui.btnShowPass,
			txtImgCode: this.ui.txtImgCode,
			btnCode: this.ui.btnCode
		});

		this.views.onCheckMobile = function (result) {
			if(result){
				tipMessage.show("该号码已注册，请直接登录", {delay: 2000});
			}
		};

		this.regEvent();
		this.createSlider();
	},

	regEvent: function () {
		this.ui.btnPact.on("touchstart click", $.proxy(function () {
			var state = this.ui.btnPact.data("state");

			if(state == 1){
				this.setDisSubmit();
				this.ui.btnPact.data('state', 0);
				this.ui.btnPact.removeClass('hover');

				return false;
			}

			this.activateSubmit();
			this.ui.btnPact.data('state', 1);
			this.ui.btnPact.addClass('hover');

			return false;
		}, this));

		this.ui.btnShowReg.on("click", $.proxy(function () {
			this.ui.divReg.show();
		}, this));

		this.ui.btnClose.on("click", $.proxy(function () {
			this.ui.divReg.hide();
		}, this));
	},

	setDisSubmit: function () {
		this.ui.btnSubmit.addClass('oper-btn-gray');
	},

	activateSubmit: function () {
		this.ui.btnSubmit.removeClass('oper-btn-gray');	
	},

	createSlider: function () {
		var data  = [];
		var _this = this;

		if(this.ui.sliderContainer.length > 0){
			data.push({
				src: __uri("/views/images/yy/banner1.jpg")
			});

			data.push({
				src: __uri("/views/images/yy/banner2.jpg")
			});

			data.push({
				src: __uri("/views/images/yy/banner3.jpg")
			});

			this.slider = new sliderBar.create({
				data: data,
				container: this.ui.sliderContainer
			});

			this.slider.onChange = function (index) {
				_this.ui.btnMenu.find("li").removeClass("selected");
				_this.ui.btnMenu.find("li").eq(index).addClass("selected");			
			};
		}
	}
};

register.init();