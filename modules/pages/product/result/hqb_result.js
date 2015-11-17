/**
 * @require style.css  
 */
var $ 				= require("zepto");
var user 			= require("kit/user");
var appApi 			= require("kit/app_api");
var queryString 	= require("kit/query_string");
var eventFactory 	= require("base/event_factory");
var smartbar		= require("ui/smartbar/smartbar");
var vipUpgrade		= require("ui/vip_upgrade/vip_upgrade");
var tipMessage		= require("ui/tip_message/tip_message");
var redpacket 		= require("redpacket");

var result = {
	init: function () {

		this.ui = {};
		this.ui.wrap 		= $("#wrap");
		this.ui.btnInvest	= $("#btn-invest");
		this.ui.backTime 	= this.ui.wrap.find(".back-time");
		this.ui.startTime 	= this.ui.wrap.find(".start-time");
		this.ui.bizTime 	= this.ui.wrap.find(".biz-time");
		this.ui.amount 		= this.ui.wrap.find(".amount");


		this.queryString = queryString();

		this.ui.amount.text(this.queryString.amount);
		this.ui.bizTime.text(this.queryString.fBizTime);
		this.ui.backTime.text(this.queryString.fBackTime);
		this.ui.startTime.text(this.queryString.fStartTime);

		this.smartbar = smartbar.create();

		//红包分享
		redpacket.create({investId: this.queryString.investId});

		//升级VIP提示
		var memberOldLevel = Number(this.queryString.memberOldLevel);
		var memberNewLevel = Number(this.queryString.memberNewLevel);

		if(memberOldLevel != memberNewLevel && memberNewLevel > 0){
			vipUpgrade.create({
				vipLevel: memberNewLevel
			});

			user.set("memberLevel", memberNewLevel);
			
			eventFactory.exec({
				"wap": function () {

				},
				"app": function () {
					window.location.href = appApi.getVipUpgrade();
				}
			});
		}

		this.regEvent();
	},
	regEvent: function () {
		this.ui.btnInvest.on("click", $.proxy(function () {
			eventFactory.exec({
				"wap": function () {
					window.location.href = "$root$/product/home.html";
				},
				"app": function () {
					window.location.href = appApi.getProductList({type: 3});
				}
			});
			
		}, this));
	}
};

result.init();