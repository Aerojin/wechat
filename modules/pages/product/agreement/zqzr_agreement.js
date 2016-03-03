/**
 * @require zqzr_agreement.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var validate 		= require("kit/validate");
var moneyCny 		= require("kit/money_cny");
var loadingPage	    = require("ui/loading_page/loading_page");
var queryString     = require("kit/query_string");
var artTemplate     = require("artTemplate");

var zqzr_agreement = {
	init: function () {
		
		this.ui             = {};
		this.ui.nameA 		= $(".span-name-a");
		this.ui.tableId     = $("#tableId");
		this.template       = artTemplate.compile(__inline("acceptUser.tmpl"));

		this.ui.investMoney = $(".investMoney");
		this.ui.investRate  = $(".investRate");
		this.ui.productDays = $(".productDays");
		this.ui.w1          = $(".w1");
		this.ui.w2          = $(".w2");
		this.ui.w3          = $(".w3");
		this.ui.w4          = $(".w4");
		this.ui.w5          = $(".w5");
		this.ui.w6          = $(".w6");
		this.ui.y1          = $(".y1");
		this.ui.y2          = $(".y2");
		this.ui.m1          = $(".m1");
		this.ui.m2          = $(".m2");
		this.ui.d1          = $(".d1");
		this.ui.d2          = $(".d2");

		this.queryString    = queryString();

		this.param          = null;
		 if(this.queryString.transferId){
		 	this.param = {
		 		transferId : this.queryString.transferId
		 	}
		 }else if(this.queryString.investId){
		 	this.param = {
		 		investId : this.queryString.investId
		 	}
		 }

		this.param ? this.getDebtData() : loadingPage.hide();
	},
	getDebtData : function(){
		var options = {
			data: this.param
		};

		options.success = function (e) {
			var result 	= e.data;

			result.transferRecord && this.renderDebt(result);

			loadingPage.hide();
		};

		options.error = function (e) {
			loadingPage.hide();
		};

		api.send(api.PRODUCT, "getZQZRAgreementProductInfo", options, this);
	},
	renderUser : function(usernames){
		var obj = [];
		var names = [];
		for(var i = 0,len = usernames.length; i < len; i++){
			if(names.length != 0 &&  names.length % 4 == 0){
				obj.push(names);
				names = [];
			}
			names.push(usernames[i]);
		}
		if(names.length){
			obj.push(names);
		}
		this.ui.tableId.html(this.template({data : obj}));
	},
	renderDebt : function(result){
		this.renderUser(result.usernames);

		var transferRecord = result.transferRecord;
		var rate           = transferRecord.extension.finalRateDesc || 0;
		var benjin         = transferRecord.principal.plus(transferRecord.profit);
		var leftTime       = transferRecord.investPeriod.plus(-transferRecord.holdPeriod);
		var startTime      = transferRecord.startTime.substring(0,10).split("-");
		var endTime        = transferRecord.endTime.substring(0,10).split("-");

		this.ui.nameA.text(result.customerName);

		this.ui.investMoney.text(moneyCny.toFixed(transferRecord.principal));
		this.ui.investRate.text(rate);
		this.ui.productDays.text(transferRecord.investPeriod);
		this.ui.w1.text(moneyCny.toFixed(benjin));
		this.ui.w2.text(moneyCny.toFixed(transferRecord.amount));
		this.ui.w3.text(moneyCny.toFixed(transferRecord.principal));
		this.ui.w4.text(moneyCny.toFixed(transferRecord.profit));
		this.ui.w5.text(moneyCny.toFixed(transferRecord.fee));
		this.ui.w6.text(leftTime);
		this.ui.y1.text(startTime[0]);
		this.ui.y2.text(endTime[0]);
		this.ui.m1.text(startTime[1]);
		this.ui.m2.text(endTime[1]);
		this.ui.d1.text(startTime[2]);
		this.ui.d2.text(endTime[2]);
	}
};

loadingPage.show();

zqzr_agreement.init();