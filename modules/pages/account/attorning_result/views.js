/**
 * @require style.css  
 */
 var $ 				= require("zepto");
 var queryString 	= require("kit/query_string");
 var loadingPage	= require("ui/loading_page/loading_page");
 var appApi         = require("kit/app_api");
 var eventFactory 	= require("base/event_factory");

var views = {
	init: function () {

		this.ui        = {};
		this.ui.date1  = $(".date1");
		this.ui.date2  = $(".date2");
		this.ui.date3  = $(".date3");
		this.ui.date4  = $(".date4");
		this.ui.amount = $(".amount");
		this.ui.homeId = $("#homeId");

		this.queryString = queryString();

		this.date1 = this.queryString.date1.split(".");
		this.date2 = this.queryString.date2.split(".");

		this.ui.date1.text(this.date1[0]);
		this.ui.date2.text(this.date1[1].replace(/\-/g,":"));
		this.ui.date3.text(this.date2[0]);
		this.ui.date4.text(this.date2[1].replace(/\-/g,":"));
		this.ui.amount.text(this.queryString.amount || "");

		loadingPage.hide();
		this.regEvent();
	},
	regEvent : function(){
		this.ui.homeId.on("singleTap", function(){
			eventFactory.exec({
				wap: function () {
					window.location.href = "$root$/product/home.html";
				},
				app: function () {
					window.location.href = appApi.getProductList();
				}
			});
			return false;
		});
	}
};

loadingPage.show();
views.init();