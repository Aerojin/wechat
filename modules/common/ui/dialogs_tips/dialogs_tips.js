/**
 * @require style.css
 */
var $ 			= require("zepto");
var dialogs 	= require("ui/dialogs/dialogs");
var artTemplate = require("artTemplate");

var TIPS = {
	BUTTON_TEXT: "确定"
};

var dialogsTips = function (options) {

	this.title 		= options.title || "";
	this.message 	= options.message || "";
	this.buttonText = options.buttonText || TIPS.BUTTON_TEXT;
	this.onClose 	= options.onClose || function () {}; 
	this.onUpdate 	= options.onUpdate || function () {};

	this.init();
};

dialogsTips.prototype.init = function () {
	var _this = this;

	this.ui = {};

	this.template = {};
	this.template.context = artTemplate.compile(__inline("context.tmpl"));

	this.createDialogs();
};

dialogsTips.prototype.regEvent = function () {

	this.ui.btnSbumit.on("touchend click", $.proxy(function () {
		this.onUpdate();

		return false;
	}, this));

	this.ui.btnCancel.on("touchend click", $.proxy(function () {
		this.close();

		return false;
	}, this));
};

dialogsTips.prototype.close = function () {
	this.dialogs.close();
	this.onClose();
};

dialogsTips.prototype.createDialogs = function () {
	var _this = this;

	var context = this.template.context({
		title: this.title,
		message: this.message,
		buttonText: this.buttonText
	});

	this.dialogs = dialogs.create({
		context: context,
		onReady: function (dom) {
			
			_this.ui.btnCancel = dom.find(".btn-cancel");
			_this.ui.btnSbumit = dom.find(".btn-sbumit");

			_this.regEvent();
		}
	});
};



module.exports = { 
	create: function (options) {
		return new dialogsTips(options || {});
	}	
};
