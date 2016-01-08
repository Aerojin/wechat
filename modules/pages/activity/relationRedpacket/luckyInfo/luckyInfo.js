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
var replaceMobile   = require("kit/replace_mobile");
var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试"
};
var lit_02 = __uri("lit_02.png");
var lit_05 = __uri("lit_05.png");

var lucky = {
	init : function(){
		this.ui            = {};
		this.ui.baseInfo   = $(".baseInfo");
		this.ui.luckyUl    = $(".luckyUl");

		this.tmpl          = {};
 		this.tmpl.baseInfo = artTemplate.compile(__inline("baseInfo.tmpl"));
 		this.tmpl.luckyUl  = artTemplate.compile(__inline("luckyUl.tmpl"));

		this.redId         = queryString().redId;

		this.luckyStatus   = 0;

		this.refreshPage();
	},
	regEvent : function(){
		this.ui.luckyGo.on("singleTap", $.proxy(function(){
			//为1，表示为现金，跳转到资金明细页。否则就是红包，跳转到我的红包页
 			(this.luckyStatus == 1) ? (window.location.href = "xiaoniuapp://showMyBalance?type=0") : (window.location.href = window.location.protocol + "//mapp.xiaoniuapp.com/pages/account/my_redpacket.html");
 			return false;
 		}, this));
	},
	refreshPage : function(){
		this.queryBase();
		this.queryHistory();
		this.showFloateLayer(this.ui.baseInfo,this.ui.luckyUl);
	},
	queryBase : function(){
		var options = {
			data : {
				"friendRelationId" : this.redId
			}
		};
		options.success = function(e){
			var result = e.data;
			result.luckRedPacketReceive && this.showBase(result.luckRedPacketReceive);
		};
		options.error = function(e){
			var result = e.data;
			result.luckRedPacketReceive && this.showBase(result.luckRedPacketReceive);
		};

		api.send(api.ACTIVITY, "getLuckyHbInfo", options, this);
	},
	queryHistory : function(){
		var options = {
			data : {
				"friendRelationId" : this.redId
			}
		};
		options.success = function(e){
			var result = e.data;
			result.list.length && this.showLuckyUl(result.list);
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getLuckyHbInfoHistory", options, this);
	},
	showBase : function(obj){
		var name = obj.shartPrivacy == 1 ? "匿名好友" : (obj.shartName || obj.shartMobile);
		var base = {
			"lit_02" : lit_02,
			"hbRefer" : name,
			"hbMoney" : moneyCny.toYuan(obj.money,2),
			"status" : obj.shartRedpaperType
		};
		this.ui.baseInfo.html(this.tmpl.baseInfo(base));

		this.ui.luckyGo = $(".luckyGo");
		this.luckyStatus = obj.shartRedpaperType;
		this.regEvent();
	},
	showLuckyUl : function(obj){
		var record = obj;
		for(var i = 0,len = record.length; i < len; i++){
			var mobile = record[i].getPeopleMobile ? replaceMobile(record[i].getPeopleMobile) : "";
			var name = record[i].getPeopleName ? record[i].getPeopleName.substring(0,1) + "**" : "";
			record[i].getPeopleUnionId ? (record[i].receiveMobile = "微信好友") : ((record[i].friendPrivacy == 1) ? (record[i].receiveMobile = "匿名好友") : (record[i].receiveMobile = name || mobile));
			record[i].receiveDate = record[i].getDate.substring(5,10);
			record[i].lit_05 = lit_05;
			record[i].money = moneyCny.toYuan(record[i].redpaperMoney,2);
		}
		var lucky = {
			"luckUl" : record
		};
		this.ui.luckyUl.html(this.tmpl.luckyUl(lucky));
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
	}
};
lucky.init();