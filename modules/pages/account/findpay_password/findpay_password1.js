/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api				= require("api/api");
var validate 		= require("kit/validate");
var queryString 	= require("kit/query_string");
var idCardValidate 	= require("kit/idcard_validate");
var loading 		= require("ui/loading_button/loading_button");
var tipMessage		= require("ui/tip_message/tip_message");
var smartbar		= require("ui/smartbar/smartbar");

var findPay = {
	init: function () {

		this.ui = {};
		this.ui.txtName 	= $("#txt-name");
		this.ui.txtCard 	= $("#txt-card");
		this.ui.txtInput 	= $(".txt-input");
		this.ui.btnSubmit	= $("#btn-submit");

		this.queryString = queryString();

		smartbar.create();
		this.regEvent();
		this.toggleButton();
	},

	regEvent: function () {
		var _this = this;

		this.ui.btnSubmit.on("tap", $.proxy(function () {
			if(this.check()){
				this.loading = loading(this.ui.btnSubmit);
				this.checkUserIdAndName();
			}

			return false;
		}, this));

		this.ui.txtInput.on("input", $.proxy(function () {
			this.toggleButton();
		}, this));
	},

	check: function () {
		var card = this.ui.txtCard.val().trim();

		if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
			return false;
		}

		if(!idCardValidate(card)){
			tipMessage.show("身份证格式错误", {delay: 2000});
			return false;
		}

		return true;
	},

	toggleButton: function () {
		var name = this.ui.txtName.val().trim();
		var card = this.ui.txtCard.val().trim();

		if(name.length >= 2 && card.length >= 18){
			this.ui.btnSubmit.removeClass('oper-btn-gray');
			return false;
		}

		this.ui.btnSubmit.addClass('oper-btn-gray');
	},

	checkUserIdAndName: function () {
		var options = {

		};

		options.data = {
			name: this.ui.txtName.val().trim(),
			idCardNo: this.ui.txtCard.val().trim()
		};

		options.success = function (e) {
			var result = e.data;

			this.loading.close();

			window.location.href = "$root$/account/findpay_password2.html";
		}; 

		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || "服务器繁忙, 请稍后重试", {delay: 2000});
		};

		api.send(api.USER, "verifyIdentityInfo", options, this);
	}
};

findPay.init();