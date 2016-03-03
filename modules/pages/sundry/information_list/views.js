/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var sliderTrans	= require("ui/slider_transition/views");
var tipMessage 	= require("ui/tip_message/tip_message");
var loadingPage	= require("ui/loading_page/loading_page");
var iscroll 		= require("ui/iscroll/views");

var views = {
	


	init: function (options) {
		
		this.ui = {};
		this.ui.header  = $("#header");
		this.ui.context = $("#context");
		this.ui.wrap 	= $("#context").find(".ui-item");
		this.pageIndex =  1,
		this.pageSize = 10,
		this.ui.element = this.ui.context.find(".ui-item");

		this.template = artTemplate.compile(__inline("context.tmpl"));

		this.getData();
		this.createWaterfall();
	},

	regEvent: function () {
		var _this = this;
	},

	getData: function () {
		var options = {};

		options.data = {
			pageIndex: this.pageIndex,
			pageSize: this.pageSize
		};

		options.success = function (e) {

			loadingPage.hide();
			/*/var result 	= e.data;
			var data 	= this.format(result.list || []);
			var context = this.ui.element.eq(0).find(".div-context");*/
			var result 	= e.data;
			var data 	= this.format(result.list || []);

			if(result.list.length > 0){
				this.iscroll.setPageCount(result.pageCount);
				this.iscroll.appendContext(this.template({data: data}));
				return;
			}
			/*context.append(this.template({data:data}));*/
			this.iscroll.showEmpty();

		};

		options.error = function (e) {
			loadingPage.hide();
			tipMessage.show(e.msg, {delay: 2000});
		};
		//this.iscroll.showLoading();
		api.send(api.SUNDRY, "queryNewsMedia", options, this);
		
	},

	initSlider: function () {
		var _this = this;
	},
	createWaterfall:function(data){
		var _this = this;
		this.iscroll = iscroll.create({
			pageIndex: 1,
			pageCount: 1,
			pageSize: this.pageSize,
			container: this.ui.wrap,
			onLoad: function (pageIndex) {
				_this.pageIndex = pageIndex;
				_this.getData();
			}
		});
	},

	format: function (data) {
		data.map(function (value, index) {
			value.createTime 	= value.createTime.parseDate();
			value.date 			=  value.createTime.format("yyyy-MM-dd");
		});

		return data;
	}
};

loadingPage.show();
views.init();
