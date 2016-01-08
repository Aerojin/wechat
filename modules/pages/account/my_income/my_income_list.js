/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate		= require("artTemplate");
var user 			= require("kit/user");
var smartbar		= require("ui/smartbar/smartbar");
var queryString 	= require("kit/query_string");
var moneyCny 		= require("kit/money_cny");
var waterfall 		= require("ui/waterfall/waterfall");
var tipMessage  	= require("ui/tip_message/tip_message");
var loadingPage		= require("ui/loading_page/loading_page");


var income_list = { 

	pageIndex: 1,

	pageSize: 10000,

	currentData:{
		lastDate:new Date().format("yyyy-MM-dd")
	},

	init: function () {

		this.ui = {};
		this.ui.container 	= $("#container");
		this.ui.spanIncome	= $("#span-income");
		this.template 		= artTemplate.compile(__inline("list.tmpl"));
		this.smartbar 		= smartbar.create();

		artTemplate.helper("moneyFormat", $.proxy(function(param){
			return moneyCny.toFixed(param);
		}, this));

		loadingPage.show();

		this.createWaterfall();
		this.getData();

	},

	getData: function () {
		var _this = this;
		var options = {};

		options.data = {
			userId: user.get("userId"),
			profitDate: this.currentData.lastDate
		};

		options.success = function (e) {
			var result = e.data;
			var data   = this.format(result || {});

			loadingPage.hide();

			if(data.sumProfit == 0){
				this.waterfall.setPageCount(1);
				this.waterfall.showEmpty();
				return;
			}

			//请求无数据但有日期
			if(this.pageIndex < 5 && data.recInvestEndDate){
				this.getData();
				return;
			}

			//无数据
			if(!data.recInvestEndDate && !data.currentInvestProfit && !data.fixInvestProfit && !data.otherProfit){
				this.waterfall.setPageCount(1);
				this.waterfall.hideLoading();
				return;
			}

			this.ui.spanIncome.text(moneyCny.toFixed(data.sumProfit));

			if(data.currentInvestProfit || data.fixInvestProfit || data.otherProfit){
	 			this.waterfall.appendContext(this.template(data));
	 		} else {
	 			this.waterfall.setLoading(false);
	 		}
		};

		options.error = function (e) { 

			this.waterfall.showEmpty();
		};
		
		this.waterfall.showLoading();
		api.send(api.ACCOUNT, "querySumProfit", options, this);
	},

	format:function(data){
		data.profitList = data.profitList || {};
		data.currentInvestProfit = data.profitList.currentInvestProfit;
		data.fixInvestProfit 	 = data.profitList.fixInvestProfit;
		data.otherProfit 		 = data.profitList.otherProfit;
		data.recInvestEndDate 	 = data.profitList.recInvestEndDate;

		//取日期
		if(data.recInvestEndDate){
			//无数据，返回最近有数据的时间
			data.datetime = data.recInvestEndDate;
			this.currentData.lastDate = data.datetime.parseDate().format("yyyy-MM-dd");
		} else {
			//有数据
			data.datetime = this.currentData.lastDate;
			this.currentData.lastDate = data.datetime.parseDate().addDate(-1).format("yyyy-MM-dd");
		}

		data.datetime = data.datetime.parseDate().format("yyyy-MM-dd");

		if(data.datetime == new Date().format("yyyy-MM-dd")){
			data.datetime = "今天";
		}

		return data;
	},


	createWaterfall: function (data) {
 		var _this = this;
 		var padding = this.smartbar.getHeight() + 15;

 		this.waterfall = waterfall.create({
 			selector: ".waterfall-item",
 			pageSize: this.pageSize,
 			pageIndex: 1,
 			pageCount: this.pageSize,
 			padding: padding,
 			container: this.ui.container,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	},



};

income_list.init();