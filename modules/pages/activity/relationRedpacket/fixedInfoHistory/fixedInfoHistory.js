/**
 * @require style.css
 */
var $ 			  	= require("zepto");
var api 		  	= require("api/api");
var artTemplate   	= require("artTemplate");
var appApi 			= require("kit/app_api");
var tipMessage	  	= require("ui/tip_message/tip_message");
var queryString     = require("kit/query_string");
var moneyCny      	= require("kit/money_cny");
var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试"
};

var lit_02 = __uri("lit_02.png");
var lit_05 = __uri("lit_05.png");

var fixed = {
 	init : function(){
 		this.ui                    = {};
 		this.ui.moneyHistoryInfo   = $(".moneyHistoryInfo");
 		this.ui.historyUl          = $(".historyUl");
 		this.ui.moneyUl            = $(".moneyUl");
 		this.ui.moneyCount         = $(".moneyCount");

 		this.tmpl                  = {};
 		this.tmpl.moneyHistoryInfo = artTemplate.compile(__inline("moneyHistoryInfo.tmpl"));

 		this.redId                 = queryString().redpaperId;

 		this.refreshPage();
 		
 	},
 	regEvent : function(){
 		this.ui.fixedGo.on("singleTap", function(){
 			window.location.href = "xiaoniuapp://showMyBalance?type=0";//定时红包只有现金
 			return false;
 		});
 	},
 	refreshPage : function(){
 		this.queryHistory();
		this.showFloateLayer(this.ui.moneyHistoryInfo);
 	},
 	queryHistory : function(){
 		var options = {
			data : {}
		};
		options.success = function(e){
			var result = e.data;
			result.list.length && this.showHistory(result.list);
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getFixedHbInfoHistory", options, this);
 	},
 	showHistory : function(obj){
 		var his = obj;
 		for(var i = 0, len = his.length; i < len; i++){
 			his[i].recevieTime = this.formatDate(his[i].recevieTime);
 			his[i].receiveMoney = his[i].receiveMoney ? (moneyCny.toYuan(his[i].receiveMoney,2) + "元现金") : "未获得";//测试下
 		}
 		var moneyHistoryInfo = {
 			"history" : his
 		};
 		this.ui.historyUl.html(this.tmpl.moneyHistoryInfo(moneyHistoryInfo));
 	},
	showFloateLayer : function(obj){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			data[i].removeClass("dn");
		};
	},
	hideFloateLayer : function(){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			data[i].addClass("dn");
		};
	},
	formatDate : function(dateString){
		var dateResult = "";
		dateString.replace(/(\d{4})-(\d{2})/g, function(a,b,c){
			dateResult = b + "年" + c + "月";
		});
		return dateResult;
	}
 };
 fixed.init();