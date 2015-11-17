/**
 * @require style.css  
 */
var $ 				= require("zepto");
var user 			= require("kit/user");
var appApi 			= require("kit/app_api");
var queryString 	= require("kit/query_string");
var eventFactory 	= require("base/event_factory");
var smartbar		= require("ui/smartbar/smartbar");

var result = {
	init: function () {

		this.ui = {};
		this.ui.wrap 		= $("#wrap");
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


		if(Number(this.queryString.isActivity)){
			this.ui.activityBox.show();
		}

		this.smartbar = smartbar.create();

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
	}
};

result.init();