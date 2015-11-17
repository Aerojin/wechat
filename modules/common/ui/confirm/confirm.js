/**
 * @require style.css
 */

var $ 			= require("zepto");
var artTemplate = require("artTemplate");
var maskLayer	= require("ui/masklayer/masklayer");

var confirm = function (msg, options) {

	this.type= {
		"warn": "warn",
		"error": "fail",
		"success": "seccess"
	};

	options = options || {};
	options.type = this.type[options.type || "warn"];

	this.init = function () {

		var template =  artTemplate.compile(__inline("confirm.tmpl"));
			template = template({
				msg: msg,
				type: options.type
			});


		this.ui = {};
		this.ui.wrap 		= $(template);
		this.ui.btnCancel 	= this.ui.wrap.find(".btn-cancel");
		this.ui.btnConfirm 	= this.ui.wrap.find(".btn-confirm");

		this.regEvent();

		this.maskLayer = new maskLayer({});

		this.maskLayer.show(this.ui.wrap);
	};

	this.regEvent = function () {
		this.ui.btnConfirm.on("touchstart", $.proxy(function () {
			this.close(true);

			return false;
		}, this));


		this.ui.btnCancel.on("touchstart", $.proxy(function () {
			this.close(false);

			return false;
		}, this));
	};

	this.close = function (result) {
		this.maskLayer.hide();

		if(options.callback){
			options.callback(result);
		}
	};

	this.init();
};

module.exports = confirm;