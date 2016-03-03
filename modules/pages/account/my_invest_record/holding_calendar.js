var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var artTemplate = require("artTemplate");
var iscroll 	= require("ui/iscroll/views");
var calendar 	= require("ui/calendar/calendar");
var tipMessage 	= require("ui/tip_message/tip_message");

var holding_calendar = {

	pageIndex: 1,

	pageSize: 10,

	currentData:{
		refundStartDate: "",
		refundEndDate: ""
	},

	flagDayArray : [],  //有回款的日期

	init: function (options) {

		this.ui = {};
		this.ui.wrap 	= options.container;
		this.template  	= artTemplate.compile(__inline("context.tmpl"));

		this.format  = options.format;
		this.padding = options.padding;
		this.proType = options.proType;

		this.renderCalendar();
		this.createWaterfall();
		this.setDefaultTime();
		this.getData();
	},

	setDefaultTime:function(){
		var today = new Date();
		var date = new Date(today.getFullYear(), today.getMonth()+1, 0);
		var lastDay = date.getDate();
		this.currentData.refundStartDate  = today.format("yyyy-MM-01 00:00:00");
		this.currentData.refundEndDate	  = today.format("yyyy-MM") + "-" + lastDay + " 23:59:59";
	},

	getData: function () {
		var options = {};

		options.data = $.extend(this.currentData ,{
			status: 2,
			parentProductType: this.proType || 1,
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		});

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);
			
 			if(result.list.length > 0){ 				
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({
	 					tabIndex: 1,
		 				status: 2,
		 				data: data
 				}));
		 		return;
	 		}

	 		this.iscroll.showEmpty();
		};

		options.error = function (e) {
			this.iscroll.showEmpty();
		};

		this.iscroll.showLoading();
		api.send(api.PRODUCT, "queryUserInvestRecord", options, this);
	},


	renderCalendar: function(){
		var _this = this;

		var options = {};
		options.container = null;

		options.onSelectDay = function(date){
			_this.resetWaterfall();

			//按天加载
			_this.currentData.refundStartDate = date.format("yyyy-MM-dd 00:00:00");
			_this.currentData.refundEndDate	  = date.format("yyyy-MM-dd 23:59:59");

			if(_this.flagDayArray.indexOf(date.format("yyyy-MM-dd")) == -1){
				//选中没有收益的日期时不加载数据
				_this.iscroll.showEmpty();
				return;
			}

			_this.getData();
		};

		options.onChangeMonth = function(date, isSelectedAll){
			_this.resetWaterfall();

			if(isSelectedAll){
				delete _this.currentData.refundStartDate;
				delete _this.currentData.refundEndDate;
			} else {
				//按月加载
				var d = new Date(date.getFullYear(), date.getMonth()+1, 0);
				var lastDay = d.getDate();
				_this.currentData.refundStartDate = date.format("yyyy-MM-01 00:00:00");
				_this.currentData.refundEndDate	  = date.format("yyyy-MM") + "-" + lastDay + " 23:59:59";

			}

			_this.getData();
			_this.calendar.setFlagDay(_this.flagDayArray);
		};

		this.calendar = calendar.create(options);

		this.setFlag(1);
		this.setFlag(2);
	},

	setFlag:function(flag){
		var options = {};

		options.data = {
			backDateFlag : flag //1按月,2按天
		}; 

		options.success = function (e) {
			var result 	= e.data.list || [];

 			if(result.length == 0){	
 				return; 
 			}

 			switch(flag){
 				case 1:
 					var ary = [];
	 				result.map(function(item, index){
	 					ary.push(item + "-01");
	 				});

					this.calendar.setFlagMonth(ary);
	 				break;

 				case 2:
 					this.flagDayArray = result;
 					this.calendar.setFlagDay(result);
 					break;
 			}

		};

		options.error = function (e) {
			
		};

		api.send(api.ACCOUNT, "getBackAmountDate", options, this);
	},

	resetWaterfall:function(){
		this.pageIndex = 1;
		this.iscroll.pageIndex = 1;
		this.iscroll.reloading();
	},

	createWaterfall: function (data) {
 		var _this = this;

 		this.iscroll = iscroll.create({
 			pageIndex: 1,
 			pageCount: 1,
 			pageSize: this.pageSize,
 			container: this.ui.wrap,
 			emptyText:"所选日期暂无待回款投资",
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});

 		this.iscroll.setHeader(this.calendar.html);
 	}

};

module.exports = {
	create: function (options) {
		holding_calendar.init(options || {});
	}
};