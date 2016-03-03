/**
 * @require style.css
 */

var $ = require("zepto");

var masklayer = function (options) {

	this.init = function () {

		this.ui = {};
		this.ui.wrap = $(this.template);
		
		this.regEvent();
		this.setHeight();
	};

	this.regEvent = function () {
		$(window).on("resize", $.proxy(function () {
			this.reposition();
		},this));
	};

	this.setHeight = function () {
		var cliHeight = document.documentElement.clientHeight;
		var docHeight = $(document).height();
		var domheight = docHeight > cliHeight ? docHeight : cliHeight;

		this.ui.wrap.height(domheight);
	};

	this.hide = function () {
		this.ui.wrap.remove();
	};

	this.show = function (context) {
		this.context = context;
		this.ui.wrap.html(context).appendTo('body');
		this.reposition();
	};

	this.reposition = function () {
		var width = this.context.width();
		var height = this.context.height();

		var x = (document.documentElement.clientWidth - width) / 2;
		var y = (document.documentElement.clientHeight - height) / 2;

		this.context.css({
			top:  y,
			left: x
		});
	};

	this.template = '<div class="exit-mask" style="display:block;"></div>';

	this.init();
};

module.exports = masklayer;