/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var validate 		= require("kit/validate");
var queryString 	= require("kit/query_string");
var smartbar		= require("ui/smartbar/smartbar");
var tipMessage		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");

var changePwd = {
	init: function () {
		this.ui = {};
		this.ui.txtOldPassword 	= $("#txt-old-password");
		this.ui.txtPassword1 	= $("#txt-password1");
		this.ui.txtPassword2 	= $("#txt-password2");
		this.ui.btnSubmit 		= $("#btn-submit");

		smartbar.create();
		this.queryString = queryString();

		this.regEvent();
	},
	regEvent: function () {
		this.ui.btnSubmit.on("touchstart click", $.proxy(function () {
			if(this.check()){
				this.loading = loading(this.ui.btnSubmit);
				this.changePassword();
			}

			return false;
		}, this));
	},
	changePassword: function () {
		var options = {};

		options.data = {
			oldLoginPwd: this.ui.txtOldPassword.val().trim(),
			newLoginPwd: this.ui.txtPassword1.val().trim()
		};

		options.success = function (e) {
			var result = e.data;

			tipMessage.show("密码修改成功", {delay: 2000});

			this.loading.close();
			window.location.href = "$root$/user/login.html?mobile=" + user.get("loginName");
		};

		options.error = function (e) {
			var result = e.data;

			this.loading.close();
			tipMessage.show(e.msg || "网络异常,请稍后重试", {delay: 2000});
		};

		api.send(api.USER, "modifyLoginPwd", options, this);
	},
	check: function () {
		var oldPassword = this.ui.txtOldPassword.val().trim();
		var password1 = this.ui.txtPassword1.val().trim();
		var password2 = this.ui.txtPassword2.val().trim();

		if(validate.isEmpty(oldPassword)){
			tipMessage.show("请输入原登录密码", {delay: 2000});
			return false;
		}

		if(validate.isEmpty(password1)){
			tipMessage.show("请输入新的登录密码", {delay: 2000});
			return false;
		}

		if(validate.minLength(password1, 6)){
			tipMessage.show("登录密码长度不能小于6位", {delay: 2000});

			return false;
		}

		/*
		if(password2.length <= 0){
			XN.UI.tipMessage.show("请输入确认密码", {delay: 2000});
			return false;
		}*/


		if(password1 != password2){
			tipMessage.show("两次密码不一致,请重新输入", {delay: 2000});

			return false;	
		}

		return true;
	}
};

changePwd.init();