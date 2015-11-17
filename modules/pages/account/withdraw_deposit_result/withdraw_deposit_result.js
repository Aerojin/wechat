/**
 * @require style.css  
 */
 var $ 				= require("zepto");
 var artTemplate 	= require("artTemplate");
var appApi 			= require("kit/app_api");
var moneyCny 		= require("kit/money_cny");
var queryString 	= require("kit/query_string");
var eventFactory 	= require("base/event_factory");
var backConfig		= require("ui/bank_config/bank_config");

 var result = {
 	init: function () {

 		this.ui = {};
 		this.ui.wrap 		= $("#wrap");
 		this.ui.wrapLoading = $("#wrap-loading");

 		this.queryString 	= queryString();
 		this.template 		= artTemplate.compile(__inline("context.tmpl"));

 		
 		this.queryString.amount = moneyCny.toDecimalStr(this.queryString.amount);
 		this.queryString.balance = moneyCny.toDecimalStr(this.queryString.balance);
 		this.queryString.backIco = backConfig.getBankIco(this.queryString.bankCode);
 		this.queryString.cardText = backConfig.getCardText(this.queryString.card);


 		this.ui.wrap.html(this.template(this.queryString));

 		this.ui.wrap.show();
 		this.ui.wrapLoading.hide();

 		this.regEvent();
 	},
 	
 	regEvent: function () {
 		this.ui.wrap.find("#btn-submit").on("click", function () {
 			eventFactory.exec({
				"wap": function () {
					window.location.href = "$root$/product/home.html";
				},
				"app": function () {
					window.location.href = appApi.getProductList({type: 3});
				}
			});
 		});
 	}

 };

 result.init();