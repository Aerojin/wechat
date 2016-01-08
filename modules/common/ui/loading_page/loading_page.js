var $ = require("zepto");

var loadingPage = function (options) {
	this.padding 	= options.padding || 0;
	this.container 	= options.container || $("body");

	this.init();
};

loadingPage.prototype.init = function () {

	this.ui = {};
	this.ui.html 	 = $('html');
	this.ui.template = __inline("context.tmpl");
};

loadingPage.prototype.getElement = function () {
	if(!this.ui.wrap){
		this.ui.wrap = $(this.ui.template);

		var height 	= document.documentElement.clientHeight;
		var width 	= document.documentElement.clientWidth;

		this.ui.wrap.css({
			width: width,
			height: height
		});

		this.ui.wrap.on("touchstart", function () {
			return false;
		});
	}

	return this.ui.wrap;
};

loadingPage.prototype.show = function () {
	this.showScroll();
	this.container.append(this.getElement());
};

loadingPage.prototype.hide = function () {
	this.hideScroll();
	this.getElement().remove();
};

loadingPage.prototype.showScroll = function () {
	 this.ui.html.css({'overflow-y': 'hidden'});
};

loadingPage.prototype.hideScroll = function () {
	 this.ui.html.css({'overflow-y': 'auto'});
};

module.exports = {
	show: function () {
		this.getPage().show();
	},

	hide: function () {
		this.getPage().hide();
	},

	getPage: function () {
		if(!this.loadingPage){
			this.loadingPage = new loadingPage({});
		}

		return this.loadingPage;
	}
};