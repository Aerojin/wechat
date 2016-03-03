/**
 * @require fee.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var sliderTrans	= require("ui/slider_transition/views");
var tipMessage 	= require("ui/tip_message/tip_message");
var loadingPage	= require("ui/loading_page/loading_page");
var queryString = require("kit/query_string");

var fee = {
	init : function(){
		this.ui        = {};
		this.ui.feeId  = $("#feeId");

		this.template  = artTemplate.compile(__inline("fee.tmpl"));

		this.queryString = queryString();

		this.getData();
	},
	getData : function(){
		var options = {};

		options.data = {
			investPeriod : this.queryString.investDays
		};

		options.success = function (e) {
			var result 	= e.data;
			this.render(result);
		};

		options.error = function (e) {

		};

		api.send(api.PRODUCT, "getFee", options, this);
	},
	formatData : function(result){
		var data = {};
		data.minInvestPeriod = result.list[0].minInvestPeriod;
		data.maxInvestPeriod = result.list[0].maxInvestPeriod;
		data.data = result.list;
		return data;
	},
	render : function(result){
		var data = this.formatData(result);
		data && this.ui.feeId.html(this.template(data));
		this.ui.trInfo = this.ui.feeId.find(".trInfo");

		var list = data.data;
		var d = this.queryString.hasdays;
		for(var i = 0,len = list.length; i < len; i++){
			if(d >= list[i].minHoldPeriod && d <= list[i].maxHoldPeriod){
				$(this.ui.trInfo[i]).addClass("on");
				break;
			}
		}
	}
};

fee.init();