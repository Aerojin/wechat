/**
* @require style.css  
* @require register.css  
*/
/**
 * @require style.css  
 */
var $ 				= require("zepto");
var queryString 	= require("kit/query_string");
var tipMessage		= require("ui/tip_message/tip_message");
var registerViews 	= require("pages/user/register/register_views");

var TIPS = {
	MOBILE_EXIST: "该手机号已经注册, 请直接登录"
};

var register = {

	init: function () {

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
		this.ui.sliderContainer	= $("#slider-container");
		this.ui.txtImgCode		= $("#txt-imgCode");
		this.ui.btnCode			= $("#btn-code");
		
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
			btnShowPass: this.ui.btnShowPass,
			txtImgCode: this.ui.txtImgCode,
			btnCode: this.ui.btnCode
		});

		this.views.onCheckMobile = function (result) {
			if(result){
				tipMessage.show(TIPS.MOBILE_EXIST, {delay: 2000});
			}
		};

		if(this.queryString && !!Number(this.queryString.showReferrer)){
			this.ui.txtRecommend.parent().show();
		}

		this.regEvent();
	},

	regEvent: function () {

	}
};

register.init();