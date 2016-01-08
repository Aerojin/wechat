/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var sliderTrans	= require("ui/slider_transition/views");
var tipMessage 	= require("ui/tip_message/tip_message");
var loadingPage	= require("ui/loading_page/loading_page");

var views = {
	
	pageSize: 99,

	init: function () {
		
		this.ui = {};
		this.ui.header  = $("#header");
		this.ui.context = $("#context");

		this.ui.btnLi 	= $("#ul-menu li");
		this.ui.element = this.ui.context.find(".ui-item");

		this.template = artTemplate.compile(__inline("context.tmpl"));

		this.getData();
		this.regEvent();		
	},

	regEvent: function () {
		var _this = this;

		this.ui.btnLi.click(function(event) {
			var index = _this.ui.btnLi.index($(this));

			_this.slider.setIndex(index);
		});
	},

	getData: function () {
		var options = {};

		options.data = {
			pageIndex: 1,
			pageSize: this.pageSize
		};

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);
			var context = this.ui.element.eq(0).find(".div-context");

			context.append(this.template({data:data}));
			this.initSlider();
			loadingPage.hide();
		};

		options.error = function (e) {
			loadingPage.hide();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 2000});
		};
		
		api.send(api.SUNDRY, "queryNewsMedia", options, this);
		
	},

	initSlider: function () {
		var _this = this;

		
		this.slider = new sliderTrans.create({
   			element: this.ui.element,
   			context: this.ui.context,
   			header: this.ui.header.height(),
   			onChange: function (index) {
   				_this.ui.btnLi.removeClass("ui-state-active");
   				_this.ui.btnLi.eq(index).addClass("ui-state-active");
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
