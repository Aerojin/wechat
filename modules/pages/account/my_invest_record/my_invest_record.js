/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny	= require("kit/money_cny");
var validate 	= require("kit/validate");
var smartbar	= require("ui/smartbar/smartbar");
var queryString = require("kit/query_string");
var sliderTrans	= require("ui/slider_transition/views");

var holding 			= require("holding");
var holding_calendar	= require("holding_calendar");
var finished 			= require("finished");

var DATE_UNIT = {
	"1": "天",
	"2": "月"
};

var BS2P = {
	"6S16G": "1161174",
	"6S64G": "1161175",
	"6SPLUS16G": "1161176",
	"6SPLUS64G": "1161177"
};

var my_record = {
	
	pageIndex: 1,

	pageSize: 10,

	init: function () {
		var _this = this;

		this.ui = {};
		this.ui.header 		= $("#header");
		this.ui.context 	= $("#context");
		this.ui.menu 		= $("#ul-menu li");
		this.ui.list 		= this.ui.context.find(".ui-item");


		this.template = {};
		this.template.header  = artTemplate.compile(__inline("header.tmpl"));
		this.template.context = artTemplate.compile(__inline("context.tmpl"));

		this.smartbar = smartbar.create();
		this.queryString = queryString();

		/*
		sliderTrans.create({
			activeClass: "active",
			menu: this.ui.menu,
			list: this.ui.list,
			context: this.ui.context,
			allowTouch: false
		});
*/

		this.slider = new sliderTrans.create({
   			element: this.ui.list,
   			context: this.ui.context,
   			header: $("header").height(),
   			onChange: function (index) {
   				_this.ui.menu.removeClass("active");
   				_this.ui.menu.eq(index).addClass("active");
   			}
   		});

		
		holding.create({
			format: function (data) {
				return _this.format(data);
			},
			padding: this.smartbar.getHeight() + 5,
			container: this.ui.list.eq(0),
			proType:this.queryString.proType
		});

		holding_calendar.create({
			format: function (data) {
				return _this.format(data);
			},
			padding: this.smartbar.getHeight() + 5,
			container: this.ui.list.eq(1), 
			proType:this.queryString.proType
		});

		finished.create({
			format: function (data) {
				return _this.format(data);
			},
			padding: this.smartbar.getHeight() + 5,
			container: this.ui.list.eq(2),
			proType:this.queryString.proType
		});
		

		this.regEvent();
		this.getHeader();
	},

	regEvent: function () {
		var _this = this;

		this.ui.menu.click(function(event) {
			var index = _this.ui.menu.index($(this));

			_this.slider.setIndex(index);
		});
	},


	getHeader: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result 	= e.data;
			var data = {};

			data.fixTotal 	= moneyCny.toFixed(result.sumDueBackAmount);
			data.fixIncome 	= moneyCny.toFixed(result.sumFixProProfit);
			data.fixAmount 	= moneyCny.toFixed(result.sumInvestAmount);

			this.ui.header.html(this.template.header(data));
		};

		options.error = function () {
			
		};

		api.send(api.ACCOUNT, "getFixProductProfitInfo", options, this);
	},


 	format: function (data) {
 		for(var i = 0; i < data.length; i++){
 			var result  	= data[i];
 			var fEndTime 	= result.fEndTime.parseDate();
 			var fBizTime 	= result.fBizTime.parseDate();
 			var fStartTime 	= result.fStartTime.parseDate();			

 			result.fEndTime		 = fEndTime.format("yyyyMMdd");
 			result.fBizTime		 = fBizTime.format("yyyy-MM-dd hh:mm:ss");
 			result.fStartTime	 = fStartTime.format("yyyyMMdd");
	 		result.deadLineValue = result.deadLineValue;
			result.deadLineType  = DATE_UNIT[result.deadLineType];
			result.fProfit		 = moneyCny.toFixed(result.fProfit);
			result.fInvestAmt	 = moneyCny.toFixed(result.fInvestAmt);
			result.equityURL 	 = this.getEquityURL(result);
			result.bs2pUrl 		 = this.getBs2pUrl(result);

			data[i] = result;
		}

		return data;
 	},

 	getBs2pUrl: function (data) {
 		if(data.typeValue == 6){
 			var url = "http://www.189eshop.cn:6685/catentry/catentryDetail.action?recCode=01552048&recStaff=yangj18&catentryClass=Component&catentryId={0}&systemId=MINI_WAP&storeId=15718";

			return url.format(this.getBs2pType(data));
		}

		return "";
 	},

 	getBs2pType: function (data) {
 		var pName = data.productName.toLocaleLowerCase();

 		if(pName.indexOf("plus") > -1){
			if(pName.indexOf("16g") > -1){
				return BS2P["6SPLUS16G"];
			}else{
				return BS2P["6SPLUS64G"];
			}
		}else{
			if(pName.indexOf("16g") > -1){
				return BS2P["6S16G"];
			}else{
				return BS2P["6S64G"];
			}
		}
 	},

 	getParam: function (data) {
 		var param = {};

 		param.fId 			= data.fId;
 		param.typeValue  	= data.typeValue;

		return $.param(param);
 	},

 	getEquityURL: function (data) {
 		var result = data.productAd;

 		if(validate.isEmpty(result)){
 			return {
				title: "收益权转让协议",
				content: "收益权转让协议",
				redirectUrl: "javascript:void(0);"
			};
 		}

 		result.redirectUrl += "?" + this.getParam(data);

 		return result;
 	}
};

my_record.init();