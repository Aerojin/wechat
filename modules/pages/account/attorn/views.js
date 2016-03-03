/**
 * @require style.css  
 */
var $ 			= require("zepto");
var sliderTrans	= require("ui/slider_transition/views");
var queryString = require("kit/query_string");

var attorn      = require("attorn");
var attorning   = require("attorning");
var attorned    = require("attorned");


var views = {
	init : function(){
		var _this = this;

		this.ui              = {};
		this.ui.menu 		 = $("#ul-menu li");
		this.ui.context 	 = $("#context");
		this.ui.list 		 = this.ui.context.find(".ui-item");
		this.queryString     = queryString();

		this.slider = new sliderTrans.create({
			index : this.queryString.index,
   			element: this.ui.list,
   			context: this.ui.context,
   			header: $(".ui-header").height(),
   			onChange: function (index) {
   				_this.ui.menu.removeClass("active");
   				_this.ui.menu.eq(index).addClass("active");
   			}
   		});

		attorn.create({
			container: this.ui.list.eq(0)
		});

		attorning.create({
			container: this.ui.list.eq(1)
		});

		attorned.create({
			container: this.ui.list.eq(2)
		});

		this.regEvent();

	},
	regEvent: function () {
		var _this = this;

		this.ui.menu.click(function(event) {
			var index = _this.ui.menu.index($(this));

			_this.slider.setIndex(index);
		});
	}
};

views.init();