/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny	= require("kit/money_cny");
var smartbar	= require("ui/smartbar/smartbar");
var queryString = require("kit/query_string");
var agreement	= require("kit/agreement_url");
var slider 		= require("ui/slider_page/slider_page");

var buy 		= require("buy");
var complete 	= require("complete");

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

var BS2P_PROTOCOL = {
	"1161174": "$root$/agreement/bs2p_product_01.html",
	"1161175": "$root$/agreement/bs2p_product_02.html",
	"1161176": "$root$/agreement/bs2p_product_03.html",
	"1161177": "$root$/agreement/bs2p_product_04.html"
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
		this.ui.list 		= this.ui.context.find(".wrap-item");

		this.template = {};
		this.template.header  = artTemplate.compile(__inline("header.tmpl"));
		this.template.context = artTemplate.compile(__inline("context.tmpl"));

		this.smartbar = smartbar.create();
		this.queryString = queryString();

		slider.create({
			activeClass: "active",
			menu: this.ui.menu,
			list: this.ui.list,
			context: this.ui.context
		});

		buy.create({
			format: function (data) {
				return _this.format(data);
			},
			padding: this.smartbar.getHeight(),
			container: this.ui.list.eq(0),
			proType:this.queryString.proType
		});

		complete.create({
			format: function (data) {
				return _this.format(data);
			},
			padding: this.smartbar.getHeight(),
			container: this.ui.list.eq(1),
			proType:this.queryString.proType
		});

		this.getHeader();
	},

	getHeader: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result 	= e.data;
			var data = {};

			if(Number(this.queryString.proType) == 2){
				data.profitAmount  = moneyCny.toFixed(result.floatProfitAmount);
				data.productAmount = moneyCny.toFixed(result.floatProductAmount);
			}else{
				data.profitAmount  = moneyCny.toFixed(result.fixedProfitAmount);
				data.productAmount = moneyCny.toFixed(result.fixedProductAmount);
			}

			this.ui.header.html(this.template.header(data));
		};

		options.error = function () {
			
		};

		api.send(api.PRODUCT, "getProductInvest", options, this);
	},


 	format: function (data) {
 		for(var i = 0; i < data.length; i++){
 			var result  	= data[i];
 			var param 		= this.getParam(result);
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
			result.equityURL 	 = agreement.get([result.typeValue || 1]).equityUrl + "?" + param;
			result.bs2pUrl 		 = this.getBs2pUrl(result);

			if(result.typeValue == 6){
				result.equityURL = this.getBs2pEquityURL(result);
			}

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

 	getBs2pEquityURL: function (data) {
 		var type = this.getBs2pType(data);

 		return BS2P_PROTOCOL[type] || "";
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
 	}
};

my_record.init();