/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var keyboard		= require("ui/keyboard/keyboard");
var smartbar		= require("ui/smartbar/smartbar");
var confirm 		= require("ui/confirm/confirm");
var queryString 	= require("kit/query_string");
var tipMessage		= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");

var payPassword = {
	STATE: {
		STEP1: "step1",
		STEP2: "step2"
	},

	state: "step1",

	init: function () {
		var _this = this;

		this.ui = {};			
		this.ui.password 		= $("#ul-password");
		this.ui.btnSubmit 		= $("#btn-next");
		this.ui.tips 			= $("#tips");

		this.queryString = queryString();
		this.smartbar 	 = smartbar.create();

		this.keyboard = new keyboard({
			onChange: function (value) {
				_this[_this.state].change.call(_this, value);
			}
		});

		this.regEvent();
	},
	regEvent: function () {	

		this.ui.password.on("tap", $.proxy(function () {
			this.keyboard.show();
			return false;
		}, this));

		this.ui.btnSubmit.on("tap", $.proxy(function () {
			this.keyboard.hide();
			if(this[this.state].check.call(this)){
				this.loading = loading(this.ui.btnSubmit);
				this[this.state].update.call(this);
			}

			return false;
		}, this));
	},
	step1: {
		render: function () {
			this.state = this.STATE.STEP1;
		},
		change: function (value) {
			this.ui.btnSubmit.addClass('oper-btn-gray');
			this.ui.password.find("li").removeClass('z-on');

			for(var i = 0; i < value.length; i++){
				this.ui.password.find("li").eq(i).addClass('z-on');
			}

			if(value.length == 6){
				this.ui.btnSubmit.removeClass('oper-btn-gray');
			}
		},
		check: function () {
			if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
				return false;
			}

			return true;
		},
		update: function () {
			this.password1 = this.keyboard.getValue();

			this.state = this.STATE.STEP2;
			this[this.state].render.call(this);
		}
	},
	step2: {
		render: function () {
			this.loading.close();
			this.keyboard.resetValue();						
			this.ui.password.find("li").removeClass('z-on');
			this.ui.btnSubmit.addClass('oper-btn-gray').text("完成");

			this.ui.tips.text("请再次确认交易密码");
		},
		change: function (value) {
			this[this.STATE.STEP1].change.call(this, value);
		},
		check: function () {
			if(this.ui.btnSubmit.hasClass('oper-btn-gray')){
				return false;
			}

			if(this.password1 != this.keyboard.getValue()){
				tipMessage.show("两次密码不一致", {delay: 2000});

				return false;
			}

			return true;
		},
		update: function () {
			var options = {};

			options.data = {
				payPwd: this.keyboard.getValue()
			};

			options.success = function (e) {
				
				this.loading.close();
				user.set("setPayPwd", true); //交易密码设置成功后处理
				
				if(this.queryString.redirect){
					window.location.href = decodeURIComponent(this.queryString.redirect);

					return;
				}

				window.location.href = "$root$/account/my_account.html?" + $.param(this.queryString);
			};

			options.error = function (e) {
				this.loading.close();
				tipMessage.show(e.data.msg || "服务器繁忙, 请稍后重试", {delay: 2000});
			};
			
			api.send(api.USER, "setPayPassword", options, this);
		}

	}

};

payPassword.init();