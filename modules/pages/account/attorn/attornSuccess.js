/**
 * @require attornSuccess.css  
 */
var $ 				= require("zepto");
var queryString 	= require("kit/query_string");
var artTemplate     = require("artTemplate");
var moneyCny	    = require("kit/money_cny");

var attornSuccess = {
	init : function(){
		this.ui     = {};
		this.ui.sec = $("#sec");

		this.queryString = queryString();
		this.template = artTemplate.compile(__inline("attornSuccess.tmpl"));
		this.renderData();
	},
	renderData : function(){
		var tra = this.queryString.transTime.split(".");
		var end = this.queryString.endTime.split(".");
		var transMoney = this.queryString.transMoney;
		var backAttorn = "$root$/account/attorn.html";
		var backAttorning = "$root$/account/attorn.html?index=" + 1;
		var data = {
			transferTime : tra[0],
			trasferSecond : tra[1].replace(/\-/g,":"),
			endTime : end[0],
			endSecond : end[1].replace(/\-/g,":"),
			transMoney : moneyCny.toFixed(transMoney),
			backAttorn : backAttorn,
			backAttorning : backAttorning
		};

		this.ui.sec.html(this.template(data));
	}
};

attornSuccess.init();