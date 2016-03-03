/**
 * @require doattorn.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var tipMessage 	= require("ui/tip_message/tip_message");
var dialogsPwd 	= require("ui/dialogs_password/dialogs_password");
var loadingPage	= require("ui/loading_page/loading_page");
var queryString = require("kit/query_string");
var validate	= require("kit/validate");
var moneyCny	= require("kit/money_cny");

var doattorn = {
	init : function(){
		this.ui            = {};
		this.ui.views      = $("#views");
  
		this.template      = artTemplate.compile(__inline("doattorn.tmpl"));
		this.queryString   = queryString();
	  
		this.investDays    = 0;

		this.getData();
	},
	regEvent : function(){
		var _this = this;

		this.ui.submitBtn.on("singleTap", $.proxy(function(){
			if(this.ui.submitBtn.hasClass("oper-btn-gray")){
				return false;
			}

			this.dialogsPwd = dialogsPwd.create({
				onUpdate: function (result)  {
					_this.applyAttorn(result);
					_this.dialogsPwd.close();
				}
			});
			return false;
		},this));
		this.ui.isAgree.on("singleTap", $.proxy(function(){
			this.ui.isAgree.hasClass("pact-on") ? this.ui.submitBtn.addClass("oper-btn-gray") : this.ui.submitBtn.removeClass("oper-btn-gray");
			this.ui.isAgree.toggleClass("pact-on");
			return false;
		},this));
		this.ui.icoUnknown.on("singleTap", $.proxy(function(){
			window.location.href = "$root$/account/fee.html?hasdays=" + this.holdPeriod + "&investDays=" + this.investDays;//持有天数
			return false;
		},this));
	},
	getData : function(){
		var options = {};

		options.data = {
			investId : this.queryString.investId
		};

		options.success = function (e) {
			var result 	= e.data;

			this.holdPeriod = result.holdPeriod;
			this.investDays = result.origInvestPeriod;

			result.principal = moneyCny.toFixed(result.principal);
			result.profit = moneyCny.toFixed(result.profit);
			result.fee = moneyCny.toFixed(result.fee);
			result.amount = moneyCny.toFixed(result.amount);

			result.equityURL = this.getEquityURL(result);//协议

			this.ui.views.html(this.template(result));

			loadingPage.hide();

			this.getTemplateDom(result);
		};

		options.error = function (e) {
			loadingPage.hide();
		};

		api.send(api.PRODUCT, "getTransferInfo", options, this);
	},
	getTemplateDom : function(result){
		this.ui.submitBtn  = this.ui.views.find("#submitBtn");
		this.ui.isAgree    = this.ui.views.find(".isAgree");
		this.ui.icoUnknown = this.ui.views.find(".icoUnknown");

		this.regEvent();
	},
	applyAttorn : function(pwd){//申请转让
		var options = {};

		options.data = {
			payPassword: pwd,
			investId : this.queryString.investId
		};

		options.success = function (e) {
			var result 	= e.data;
			var tra = result.transferTime.replace(" ",".").replace(/\:/g,"-");
			var end = result.endTime.replace(" ",".").replace(/\:/g,"-");
			var data = {
				transTime : tra,//申请转让时间
				endTime : end,//停售时间
				transMoney : result.amount//转让总价
			};
			window.location.href = "$root$/account/attornSuccess.html?" + $.param(data);
		};

		options.error = function (e) {
			tipMessage.show(e.msg, {delay: 2000});
		};

		api.send(api.PRODUCT, "applyTransfer", options, this);
	},
	getEquityURL: function (data) {
 		var result = [];

 		if(validate.isEmpty(result)){
 			return {
				title: "债权转让服务协议",
				content: "债权转让服务协议",
				redirectUrl: "$root$/agreement/zqzr_agreement.html"
			};
 		}

 		//result.redirectUrl += "?" + this.getParam(result);

 		return result;
 	}
};

loadingPage.show();

doattorn.init();