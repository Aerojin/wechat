var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var appApi 		 	= require("kit/app_api");
var xnData 			= require("kit/xn_data");
var eventFactory 	= require("base/event_factory");

var state = function (options) {

	this.isReady = false;
	this.data 	 = options.data || {};

	this.init = function () {

		this.isBindCard 		= user.get("bindCard");
		this.isSetPayPwd 		= user.get("setPayPwd");
		this.isAuthentication 	= user.get("authentication");

		this.getData();

		this.xnData = xnData.create({
			key: xnData.STATE.RECHARGE_KEY
		});
	};

	this.redirect = function (param) {
		var _this = this;
		
		eventFactory.exec({
			wap: function () {
				_this.gotoRedirect(param);
			},
			app: function () {
				window.location.href = appApi.getRecharge();
			}
		});
	};

	this.gotoRedirect = function (param) {
		param = param || {};

		//设置充值成功后, 回跳的页面;
		this.xnData.clear();
		this.xnData.set("redirect", window.location.href);

		if(!this.isSetPayPwd){
			window.location.href = "$root$/account/pay_password.html?redirect=" + this.getPayPwdRedirect() + $.param(param);
			return;
		}

		if(!this.isBindCard || !this.isAuthentication){
			window.location.href = "$root$/account/accreditation.html?" + $.param(param);
			return;
		}

		window.location.href = "$root$/account/voucher.html?" + $.param(param);
	};

	this.getPayPwdRedirect = function () {
		return encodeURIComponent(encodeURIComponent(location.href));
	};

	this.getIsBindCard = function () {
		return this.isBindCard && this.isAuthentication;
	};

	this.getData = function () {
		var options = {
			data: $.extend(this.data, {})
		};

		options.success = function (e) {
			var result = e.data || {};

			this.isReady			= true;
			this.isBindCard 		= result.isBindCard;
			this.isSetPayPwd 		= result.isSetPayPwd; 
			this.isAuthentication 	= result.isAuthentication;
		};

		options.error = function (e) {

		};

		api.send(api.USER,"getUserBindCardState", options, this);
	};


	this.init();
}

module.exports = function (options) {	
	return new state(options || {});
};