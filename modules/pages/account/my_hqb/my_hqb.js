/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var artTemplate 	= require("artTemplate");
var moneyCny		= require("kit/money_cny");
var queryString 	= require("kit/query_string");
var waterfall 		= require("ui/waterfall/waterfall");
var tipMessage  	= require("ui/tip_message/tip_message");
var sliderTrans		= require("ui/slider_transition/views");
var ransomRecord    = require("hqb_ransom_record");
var holding 			= require("holding");
var finished 			= require("finished");

var myHqb = {

	buyUrl: "$root$/product/home.html",

	init: function (index) {
		var _this = this;
		
		this.ui = {};
		this.ui.header 		= $("#js_header");
		this.ui.context 	= $("#js_context");
		this.ui.btnTool 	= $("#js_btn_tool");
		this.ui.btnBuy		= $("#js_btn_buy");
		this.ui.menu        = $("#js_ul_menu li");
		this.ui.list 		= this.ui.context.find(".ui-item");
		this.template = {};
		this.template.header  = artTemplate.compile(__inline("header.tmpl"));
		this.template.context = artTemplate.compile(__inline("context.tmpl"));

		this.queryString = queryString() || {};

		this.slider = new sliderTrans.create({
			allowTouch: false,
			index: this.queryString.index || 0,
   			element: this.ui.list,
   			context: this.ui.context,
   			header: $("header").height(),
   			onChange: function (index) {
   				_this.ui.menu.removeClass("active");
   				_this.ui.menu.eq(index).addClass("active");
   			}
   		});

		
		holding.create({
			padding: this.ui.btnTool.height(),
			container: this.ui.list.eq(0)
		});

		finished.create({
			padding: this.ui.btnTool.height(),
			container: this.ui.list.eq(1)
		});


		this.getHeader();
		this.getHqb();

		this.regEvent();

	},

	regEvent: function () {
		var _this = this;
		this.ui.btnBuy.on("click", $.proxy(function () {

			window.location.href = this.buyUrl;
		}, this));


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
			var data = {
				fProfit: moneyCny.toFixed(result.totalProfit, 2),
				fMoneyAmount: moneyCny.toFixed(result.remainMoney, 2),
				fProfitYesterday: moneyCny.toFixed(result.yesterDayProfit, 2),
				fRedeemProcessMoney: moneyCny.toFixed(result.redeemProcessMoney, 2)
			};

			this.ui.header.html(this.template.header(data));
		};

		options.error = function () {
			
		};

		api.send(api.PRODUCT, "currentStatistics", options, this);
	},


	getHqb: function () {
 		var options = {};

		options.data = {

		};

		options.success = function (e) {
			var result 	= e.data || {};
			var url 	= "$root$/product/product_buy.html?fid={0}";

			this.buyUrl = url.format(result.fid);
		};

		options.error = function () {

		};

		api.send(api.PRODUCT, "getProductInfo", options, this);
 	}

};

myHqb.init();