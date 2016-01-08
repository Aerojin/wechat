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
var loadingPage		= require("ui/loading_page/loading_page");


var TIPS = {
	BIND_CARD_TIPS: "绑卡后才能提现, 确定要进行绑卡?"
};

var account = {
	init: function () {
		
		this.ui = {};
		this.ui.wrap 		= $("#wrap");
		this.ui.vipimg 		= $("#vipimg");
		this.ui.hbaoFlag	= $("#js_hbao_flag");
		this.ui.btnRecharge = $("#btn-recharge");
		this.ui.btnWithdraw = $("#btn-withdraw");

		this.queryString = queryString() || {};
		this.queryString.mobile = user.get("loginName");
		
		loadingPage.show();
		this.smartbar 	= smartbar.create();
		this.cardState 	= bindCardState({});
		
		this.regEvent();
		this.getMyAsset();
		this.getUnreadFlag();

	},
	regEvent: function () {
		var _this = this;


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
	getMyAsset: function () {
		var options = {};

		options.data = {
			userId: user.get("userId")
		};

		options.success = function (e) {
			var result = e.data;

			user.set("memberLevel", result.memberLevel);
			this.ui.vipimg.attr("src", vipConfig.getVipIco(result.memberLevel || 0));

			//总收益
			this.ui.wrap.find(".js_total").text(moneyCny.toFixed(result.totalAmount));
			// 账户余额
			this.ui.wrap.find(".js_balance").text(moneyCny.toFixed(result.ableBalance));
			//今日预期收益
			this.ui.wrap.find(".js_dayIncome").text("+" + moneyCny.toFixed(result.currentDayProfit));
			//投资累积收益
			this.ui.wrap.find(".js_income").text(moneyCny.toFixed(result.sumInvestAmount));
			//活期投资今日收益
			this.ui.wrap.find(".js_floatDayIncome").text(moneyCny.toFixed(result.cProDayProfit));
			//定期投资待收收益
			this.ui.wrap.find(".js_fixIncome").text(moneyCny.toFixed(result.fixProDueProfit));
			//红包个数
			this.ui.wrap.find(".js_hbao").text(result.redPacketCount);
			//会员等级
			this.ui.wrap.find(".js_vipname").text(vipConfig.getVipName(result.memberLevel || 0));
			//提现中金额
			this.ui.wrap.find(".js_withdraw").text(moneyCny.toFixed(result.withdrawBlockedAmount));

			loadingPage.hide();
		};

		options.error = function (e) { 

		};
		
		api.send(api.ACCOUNT, "getUserAccountInfo", options, this);
	},
	getUnreadFlag: function(){
		var options = {};

		options.data = {
			userId: user.get("userId")
		};

		options.success = function (e) {
			var result = e.data || {};

			if(result.experienceMark || result.redPackMark){
				this.ui.hbaoFlag.addClass("ico-new");
			}
		};

		options.error = function (e) {

		};

		api.send(api.ACCOUNT, "getUnReadExperienceAndRedMark", options, this);
	}

};

account.init();