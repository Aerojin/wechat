/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var smartbar		= require("ui/smartbar/smartbar");
var artTemplate 	= require("artTemplate");
var moneyCny 		= require("kit/money_cny");

var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试"
};

var bankList = {
	init: function () {

		this.ui = {};
		this.ui.blankList 	= $("#bank-list");
		this.ui.tBody 		= this.ui.blankList.find(".tbody");

		this.template = {};
		this.template.context = artTemplate.compile(__inline("context.tmpl"));

		this.getBankList();
	},
	renderBody: function (result) {
		var body = [];	

		for(var i = 0; i < result.length; i++){
			var remark = result[i].remark || "";
			var bankName = result[i].bank_name;
			var limitText = this.getLimitText({
				amount: result[i].record_limit_amount,
				dayAmount: result[i].day_limit_amount,
				monthAmount: result[i].month_limit_amount
			});

			body.push(this.template.context({
				remark: remark,
				bankName: bankName,
				limitText: limitText
			}));
		}

		this.ui.tBody.html(body.join("\n"));
	},
	getBankList: function () {
		var options = {
			data: {}
		};


		options.success = function (e) {
			var result = e.data;

			this.renderBody(result.list || []);
		};

		options.error = function (e) {
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
		};
		
		api.send(api.ACCOUNT, "queryBankList", options, this);
	},
	getLimitText: function (data) {
		var amount = moneyCny.toUnit(data.amount) ;
		var dayAmount = moneyCny.toUnit(data.dayAmount);
		var monthAmount = Number(data.monthAmount) > 0 ? moneyCny.toUnit(data.monthAmount) : "单月无限额";

		return "{0}元/{1}元/{2}".format(amount, dayAmount, monthAmount);
	}

};

bankList.init();