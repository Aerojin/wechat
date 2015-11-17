/**
 * @require style.css
 */
var $ = require("zepto");

var dialogs = function (options) {

	this.container 	= options.container || $("body");
	this.context 	= options.context || "";
	this.button 	= options.button || "";
	this.onReady 	= options.onReady || "";

	this.init();
};

dialogs.prototype.init = function () {
	var _this = this;

	this.ui = {};
	this.ui.wrap 		= $(__inline("context.tmpl"));
	this.ui.context 	= this.ui.wrap.find('.dialogs-context');

	this.ui.context.html(this.context);
	this.container.append(this.ui.wrap);

	this.onReady(this.getElement());
};


dialogs.prototype.getElement = function () {
	return this.ui.wrap;
};

dialogs.prototype.getContext = function () {
	return this.ui.context;
};

dialogs.prototype.close = function () {
	this.ui.wrap.remove();
};

dialogs.prototype.show = function () {
	this.init();
};

module.exports = { 
	create: function (options) {
		return new dialogs(options || {});
	}	
};