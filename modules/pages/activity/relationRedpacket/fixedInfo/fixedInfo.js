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
 		this.ui.baseInfo           = $(".baseInfo");
 		this.ui.moneyReferInfo     = $(".moneyReferInfo");
 		this.ui.moneyHistoryInfo   = $(".moneyHistoryInfo");
 		this.ui.historyUl          = $(".historyUl");
 		this.ui.moneyUl            = $(".moneyUl");
 		this.ui.moneyCount         = $(".moneyCount");

 		this.tmpl                  = {};
 		this.tmpl.baseInfo         = artTemplate.compile(__inline("baseInfo.tmpl"));
 		this.tmpl.moneyReferInfo   = artTemplate.compile(__inline("moneyReferInfo.tmpl"));
 		this.tmpl.moneyHistoryInfo = artTemplate.compile(__inline("moneyHistoryInfo.tmpl"));

 		this.redId                 = queryString().redId;
 		this.hbDate                = queryString().hbDate;
 		this.hbMoney               = queryString().hbMoney;

 		this.refreshPage();
 		
 	},
 	regEvent : function(){
 		this.ui.fixedGo.on("singleTap", function(){
 			window.location.href = "xiaoniuapp://showMyBalance?type=0";//定时红包只有现金
 			return false;
 		});
 	},
 	refreshPage : function(){
 		this.showBase();
 		this.queryRefer();
 		this.queryHistory();
 		this.showFloateLayer(this.ui.baseInfo,this.ui.moneyReferInfo,this.ui.moneyHistoryInfo);
 	},
 	queryRefer : function(){
 		var options = {
			data : {
				"redpaperId" : this.redId
			}
		};
		options.success = function(e){
			var result = e.data;
			result.list.length && this.showRefer(result.list);
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getFixedHbInfoRefer", options, this);
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
 	showBase : function(){
 		var baseInfo = {
 			"hbDate" : this.formatDate(this.hbDate),
 			"hbMoney" : moneyCny.toYuan(this.hbMoney,2),
 			"lit_02" : lit_02
 		};
 		this.ui.baseInfo.html(this.tmpl.baseInfo(baseInfo));

 		this.ui.fixedGo = $(".fixedGo");
 		this.regEvent();
 	},
 	showRefer : function(obj){
 		var ref = obj;
 		for(var i = 0, len = ref.length; i < len; i++){
 			ref[i].rechangeTime = ref[i].rechangeTime.substring(5,10);
 			ref[i].lit_05 = lit_05;
 		}
 		var moneyReferInfo = {
 			"refer" : ref
 		};
 		this.ui.moneyCount.text(len);
 		this.ui.moneyUl.html(this.tmpl.moneyReferInfo(moneyReferInfo));
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
 }
 fixed.init();