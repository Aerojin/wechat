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
var loadingPage		= require("ui/loading_page/loading_page");
var resultViews 	= require("result_views");

var result = {
	init: function () {
		var _this = this;

		this.ui = {};
		this.ui.wrap 		= $("#wrap");
		this.ui.btnInvest	= $("#btn-invest");
		this.ui.btnRecord 	= $("#btn-record");

		this.queryString = queryString();
		this.smartbar	 = smartbar.create();

		this.views = resultViews.create({
			investId: this.queryString.investId,
			onLoad: function (e) {
				if(e.result){
					_this.rander(e);
					return;
				}

				loadingPage.error();
			}
		});		

		this.regEvent();
	},
	rander: function (e) {
		this.ui.wrap.empty().html(e.element);

		this.showVipUpgrade();
		loadingPage.hide();
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

		this.ui.btnRecord.on("click", $.proxy(function () {
			window.location.href = "$root$/account/my_invest_record.html";
		}, this));

	},

	showVipUpgrade: function () {
		//升级VIP提示
		var memberOldLevel = Number(this.queryString.memberOldLevel);
		var memberNewLevel = Number(this.queryString.memberNewLevel);

		if(memberOldLevel != memberNewLevel && memberNewLevel > 0){
			vipUpgrade.create({
				vipLevel: memberNewLevel,
				onClose: function () {
				
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
		}
	}	
};

loadingPage.show();
result.init();