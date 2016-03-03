/**
 * @require style.css  
 */
var $ 				= require("zepto");
var appApi 			= require("kit/app_api");
var queryString 	= require("kit/query_string");
var eventFactory 	= require("base/event_factory");
var smartbar		= require("ui/smartbar/smartbar");

var ransomResult = {
	init: function () {

		this.ui = {};
		this.ui.wrap 		= $("#wrap");
		this.ui.btnBack 	= $("#btn-back");
		this.ui.amount 		= this.ui.wrap.find(".amount");
		this.ui.endDate 	= this.ui.wrap.find(".end-date");
		this.ui.startDate 	= this.ui.wrap.find(".start-date");
		
		this.queryString = queryString();

		this.ui.amount.text(this.queryString.amount || 0);
		this.ui.endDate.text(this.queryString.endDate || "");
		this.ui.startDate.text(this.queryString.startDate || "");
		
		this.smartbar = smartbar.create();

		this.regEvent();
	},

	regEvent: function () {
		this.ui.btnBack.on("click", function () {
			window.location.href = "$root$/account/my_hqb.html";
			/*
			eventFactory.exec({
				"wap": function () {
					window.location.href = "$root$/account/my_hqb.html";
				},
				"app": function () {
					window.location.href = appApi.getBackHqb();
				}
			});
			*/
		});
	}
};

ransomResult.init();