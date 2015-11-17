/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var validate 		= require("kit/validate");
var artTemplate 	= require("artTemplate");
var smartbar		= require("ui/smartbar/smartbar");
var queryString 	= require("kit/query_string");
var moneyCny 		= require("kit/money_cny");
var tipMessage  	= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");


var tyj_detail = {

	totalDay :  360,

	init: function () {
		
		this.ui = {};
		this.ui.context  = $("#context");

		this.template 	 = artTemplate.compile(__inline("context.tmpl"));
		this.queryString = queryString() || {};

		this.getData();
	},

	regEvent:function(data){

		delete data.productName;

		this.ui.btnSubmit.on("tap", $.proxy(function(){
			window.location.href = "$root$/activity/tyj_buy.html?{0}".format($.param(data));
		}, this));

	},

	getData:function(){
		var options = {};

		options.data = {
			productId : this.queryString.productId
		};

		options.success = function (e) {
			var result 	= this.format(e.data || {});

			this.setContext(result);
		};

		options.error = function (e) {

		};

		api.send(api.ACTIVITY, "queryExperienceCashProduct", options, this);
	},

	format:function(data){
		var startDate 	= null;
		var endDate   	= null;
		var income 		= null;
		var fExpCash 	= null;
		var rate 		= null;

		var result = $.extend(data, {
			expCashId : this.queryString.expCashId,
			expCash : this.queryString.expCash
		});

		startDate = new Date();
		endDate   = new Date();
		startDate.setDate(startDate.getDate() + 1);
		endDate.setDate(startDate.getDate() + Number(result.horizon));

		startDate = startDate.format("yyyy-MM-dd");
		endDate   = endDate.format("yyyy-MM-dd");

		if(Number(result.rate) > 0){
			rate = Number(result.rate).toFixed(2);
		}

		if(Number(result.expCash) > 0){
			fExpCash = moneyCny.toYuan(result.expCash).toFixed(2);
		}

		income = this.getIncome(rate, fExpCash, result.horizon);

		result.expCashId 	= result.expCashId;
		result.startDate 	= startDate;
		result.endDate 		= endDate;
		result.horizon 		= result.horizon || 0;
		result.fRate 		= rate;
		result.productName  = result.productName;
		result.fAmount		= fExpCash;
		result.income 		= income.toFixed(2);

		return result;
	},

	getIncome:function (rate, amount, days) {
		var money = Number(amount || 0);
		var rate  = Number(days).mul(Number(rate));
		var earnings = rate.div(Number(this.totalDay));

		return Math.floor(earnings * money) / 100;
	},

	setContext:function(data){
		this.ui.context.html(this.template(data));

		this.ui.btnSubmit = $("#btn-submit");

		this.regEvent(data);
	}


};

tyj_detail.init();