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
var redpacket 		= require("redpacket");

var result = {
	init: function () {
		var _this = this;

		this.ui = {};
		this.ui.wrap 		= $("#wrap");
		this.ui.redBox 		= $("#red-box");
		this.ui.redNum 		= $("#red-num");
		this.ui.btnInvest	= $("#btn-invest");
		this.ui.activityBox	= $("#activity-box");
		this.ui.backTime 	= this.ui.wrap.find(".back-time");
		this.ui.startTime 	= this.ui.wrap.find(".start-time");
		this.ui.bizTime 	= this.ui.wrap.find(".biz-time");
		this.ui.amount 		= this.ui.wrap.find(".amount");
		this.ui.earnings	= this.ui.wrap.find(".earnings");

		this.queryString = queryString();

		this.ui.amount.text(this.queryString.amount);
		this.ui.bizTime.text(this.queryString.fBizTime);
		this.ui.backTime.text(this.queryString.fBackTime);
		this.ui.startTime.text(this.queryString.fStartTime);
		this.ui.earnings.text(this.queryString.earnings);


		if(Number(this.queryString.redAmount) > 0){
			this.ui.redBox.show();
			this.ui.redNum.text(this.queryString.redAmount);
		}

		this.smartbar = smartbar.create();

		//红包分享
		redpacket.create({investId: this.queryString.investId});

		//升级VIP提示
		var memberOldLevel = Number(this.queryString.memberOldLevel);
		var memberNewLevel = Number(this.queryString.memberNewLevel);

		if(memberOldLevel != memberNewLevel && memberNewLevel > 0){
			vipUpgrade.create({
				vipLevel: memberNewLevel,
				onClose: function () {
					_this.showActivity();
				}
			});

			user.set("memberLevel", memberNewLevel);

			eventFactory.exec({
				"wap": function () {

				},
				"app": function () {
					window.location.href = appApi.getVipUpgrade();
				}
			});
		}else{
			this.showActivity();
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
					window.location.href = appApi.getProductList({type: 1});
				}
			});
			
		}, this));

		$("#div-activity").find(".btn-close").on("touchstart", function () {
			$("#div-activity").hide();

			return false;
		});

		$("#div-activity").find(".btn-activity").on("touchstart", function () {
			var userId 	= user.get("userId");
			var token 	= user.get("token");
			var url 	= "https://mact.xiaoniuapp.com/activity/1212/index.html?userId={0}&token={1}";

			window.location.href = url.format(userId, token);
			return false;
		});
	},

	showActivity: function () {
		var result = this.queryString.isShowActivity;

		if(result && result.trim() == "true"){
			$("#div-activity").show();
		}
	}
};

result.init();