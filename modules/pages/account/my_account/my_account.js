/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var smartbar		= require("ui/smartbar/smartbar");
var confirm 		= require("ui/confirm/confirm");
var queryString 	= require("kit/query_string");
var moneyCny 		= require("kit/money_cny");
var bindCardState	= require("kit/bindcard_state");
var replaceMobile	= require("kit/replace_mobile");
var vipConfig 		= require("ui/vip_config/vip_config");
var tipMessage  	= require("ui/tip_message/tip_message");

var TIPS = {
	CONFIRM_EXIT: "确定要退出吗?",
	BIND_CARD_TIPS: "绑卡后才能提现, 确定要进行绑卡?"
};

var account = {
	init: function () {
		
		this.ui = {};
		this.ui.wrap 		= $("#wrap");
		this.ui.photo 		= $("#photo");
		this.ui.vipName		= $("#lbl-vipname");
		this.ui.account 	= $("#lbl-account");
		this.ui.btnExit 	= $("#btn-exit");
		this.ui.btnChange 	= $("#btn-change");
		this.ui.btnRecharge = $("#btn-recharge");
		this.ui.btnWithdraw = $("#btn-withdraw");

		this.queryString = queryString() || {};
		this.queryString.mobile = user.get("loginName");
		
		this.smartbar 	= smartbar.create();
		this.cardState 	= bindCardState({});
		
		this.regEvent();
		this.getMyAsset();
	},
	regEvent: function () {
		var _this = this;

		this.ui.btnExit.on("tap", $.proxy(function () {
			confirm(TIPS.CONFIRM_EXIT, {
				callback: function(result) {
					if(result){
						_this.logout();
					}
				}
			});

			return false;
		}, this));

		this.ui.btnChange.on("tap", $.proxy(function () {
			window.location.href = "$root$/account/change_pwd.html?" + $.param(this.queryString);

			return false;
		}, this));

		this.ui.btnWithdraw.on("tap", $.proxy(function () {
			if(_this.cardState.getIsBindCard()){
				window.location.href = "$root$/account/withdraw_deposit.html";	
				return;
			}

			confirm(TIPS.BIND_CARD_TIPS, {
				callback: function(result) {
					if(result){
						_this.cardState.redirect();
					}
				}
			});

			return false;
		}, this));

		this.ui.btnRecharge.on("tap", $.proxy(function () {
			this.cardState.redirect();
			return false 
		}, this));
	},
	logout: function () {
		var options = {};

		options.data = {
			userId: user.get("userId"),
			token: user.get("token")
		};

		options.success = function (e) {
			localStorage.clear();
			sessionStorage.clear();
			
			window.location.href = "$root$/user/login.html?" + $.param(this.queryString);
		};

		options.error = function (e) {
			user.clear();
			window.location.href = "$root$/user/login.html?" + $.param(this.queryString);
		};
		
		api.send(api.USER, "logout", options, this);
	},
	getMyAsset: function () {
		var options = {};

		options.data = {
			userId: user.get("userId")
		};

		options.success = function (e) {
			var result = e.data;

			user.set("memberLevel", result.memberLevel);

			this.ui.account.parent().show();
			this.ui.account.text(replaceMobile(user.get("loginName")));
			this.ui.vipName.text(vipConfig.getVipName(result.memberLevel));
			this.ui.wrap.find(".total").text(moneyCny.toFixed(result.totalAmount));

			//我的投资
			this.ui.wrap.find(".invest").text(moneyCny.toFixed(result.fixedProductAmount + result.floatProductAmount));
			// 活期宝
			this.ui.wrap.find(".deposit").text(moneyCny.toFixed(result.currentProductAmount));
			// 账户余额
			this.ui.wrap.find(".balance").text(moneyCny.toFixed(result.toInvestAmount));
		};

		options.error = function () {

		};
		
		api.send(api.ACCOUNT, "getUserTreasure", options, this);
	}

};

account.init();