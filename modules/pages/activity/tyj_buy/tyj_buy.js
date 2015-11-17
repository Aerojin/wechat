/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var artTemplate 	= require("artTemplate");
var smartbar		= require("ui/smartbar/smartbar");
var queryString 	= require("kit/query_string");
var moneyCny 		= require("kit/money_cny");
var tipMessage  	= require("ui/tip_message/tip_message");
var loading 		= require("ui/loading_button/loading_button");
var dialogsPwd 		= require("ui/dialogs_password/dialogs_password");

var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试"
};

var tyj_detail = {
	init: function () {

		this.ui = {};
		this.ui.context = $("#context");
		this.template 	= artTemplate.compile(__inline("context.tmpl"));

		this.queryString = queryString() || {};	
		this.smartbar	 = smartbar.create();

		this.getData();
	},

	regEvent: function(){
		this.ui.btnBuy.on("click", $.proxy(function(){
			this.submitBuy();
		}, this));
	},

	getData:function(){
		var options = {};

		options.data = {
			productId : this.queryString.productId
		};

		options.success = function (e) {
			var result 	= e.data || {};

			var data ={
				pname : result.productName,
				expCashId : this.queryString.expCashId,
				productId : this.queryString.productId,
				days : this.queryString.horizon,
				rate : this.queryString.fRate,
				amount : this.queryString.fAmount,
				income : this.queryString.income
			};

			this.setContext(data);

		};

		options.error = function (e) {

		};

		api.send(api.ACTIVITY, "queryExperienceCashProduct", options, this);

	},

	submitBuy:function(){
		var _this = this;

		this.showDialogsPwd(function (result) {
			_this.loading = loading(_this.ui.btnBuy);
			_this.doBuy(result);
		});
	},

	doBuy:function(pwd){
		var options = {};

		options.data = {
			userId : user.get("userId"),
			expCashId : this.queryString.expCashId,
			productId : this.queryString.productId,
			payPwd : pwd
			
		};
		
		options.success = function(e){
			var result = e.data || {};

			var bizTime 	= new Date();
			var startTime 	= this.queryString.startDate;
			var endTime 	= this.queryString.endDate;
			var amount 		= this.queryString.fAmount;
			var earnings 	= this.queryString.income;

			var data = {
				fBizTime: bizTime.format("yyyy-MM-dd"),
				fStartTime: startTime.format("yyyy-MM-dd"),
				fBackTime: endTime.format("yyyy-MM-dd"), 
				amount: amount,
				earnings: earnings
			};
			
			this.loading.close();
			window.location.href = "$root$/product/tyj_result.html?"+ $.param(data);

		};

		options.error = function(e){
			this.loading.close();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay:3000});
		};

		api.send(api.ACTIVITY, "investExperienceCash", options, this);
	},

	showDialogsPwd:function (callback) {
		var _this = this;

		if(this.dialogsPwd){
			this.dialogsPwd.close();
		}

		this.dialogsPwd = dialogsPwd.create({
			onUpdate: function (result)  {
				if(callback){
					callback(result);
				}
				_this.dialogsPwd.close();
			}
		});

	},

	setContext:function(data){
		this.ui.context.html(this.template(data));

		this.ui.btnBuy = $("#btn-buy");

		this.regEvent();
	}


};

tyj_detail.init();