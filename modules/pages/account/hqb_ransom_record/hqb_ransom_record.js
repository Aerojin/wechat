/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny 	= require("kit/money_cny");
var smartbar	= require("ui/smartbar/smartbar");
var waterfall 	= require("ui/waterfall/waterfall");

var STATE = {
	"WAIT": {
		text: "处理中",
		cls: "processing"
	},
	"WORKING": {
		text: "处理中",
		cls: "processing"
	},
	"FAIL": {
		text: "失败",
		cls: "p-fail"
	},
	"FINISH": {
		text: "已完成",
		cls: "completed"
	},
};

var ransomRecord = {
	
	pageIndex: 1,

	pageSize: 10,

	init: function () {

		this.ui = {};
		this.ui.context = $("#context");
		this.template 	= artTemplate.compile(__inline("context.tmpl"));

		this.smartbar = smartbar.create();

		this.createWaterfall();
		this.getData();
	},
	getData: function () {
		var options = {};

		options.data = {
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		}; 

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);

 			if(result.list.length > 0){ 				
	 			this.waterfall.setPageCount(result.pageCount);
	 			this.waterfall.appendContext(this.template({data: data}));
		 		return;
	 		}

			this.waterfall.showEmpty();
		};

		options.error = function () {
			this.waterfall.showEmpty();
		};

		this.waterfall.showLoading();		
		api.send(api.PRODUCT, "queryRedeemRecords", options, this);
	},

	createWaterfall: function (data) {
 		var _this = this;

 		this.waterfall = waterfall.create({
 			selector: ".waterfall-item",
 			pageSize: this.pageSize,
 			pageIndex: 1,
 			pageCount: 1,
 			container: this.ui.context,
 			padding: this.smartbar.getHeight(),
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	},

 	format: function (data) {
 		for(var i = 0, len =data.length; i < len; i++){
 			var result = data[i];

 			result.fStatusText 	= STATE[result.fStatus].text;
 			result.fStatusClass = STATE[result.fStatus].cls;
 			result.fMoneyAmount = moneyCny.toFixed(result.fMoneyAmount);
 			result.fRequestTime = result.fRequestTime.parseDate().format("yyyyMMdd");


 			data[i] = result;
 		}

 		return data;
 	}
};

ransomRecord.init();