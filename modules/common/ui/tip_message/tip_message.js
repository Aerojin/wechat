/**
 * @require style.css
 */

var $ 			= require("zepto");
var artTemplate = require("artTemplate");

var tipMessage = {
	show: function (msg, options) {
		this.options = options || {};

		if(this.ui){
			this.close();
		}

		var template = artTemplate.compile(__inline("tip_message.tmpl"));
			template = template({
				msg: msg
			});

		this.ui = {};
		this.ui.input 	= $("input");
		this.ui.wrap 	= $(template);
		this.ui.message = this.ui.wrap.find(".div-msg");

		if(this.options.delay){
			this.timer = setTimeout($.proxy(function () {	
				this.close();
			}, this), options.delay);
		}

		this.removeBlur();
		this.ui.wrap.appendTo("body");
	},

	close: function () {
		var wrap = this.ui.wrap;

		if(this.ui){
			wrap.fadeOut(600, function () {
				wrap.remove();
			});
		}

		this.ui = null;
		
		clearTimeout(this.timer);

		if(this.options.callback){
			this.options.callback();
		}
	},

	removeBlur: function () {
		for(var i = 0; i < this.ui.input.length; i++){
			this.ui.input.get(i).blur();
		}
	}

};

module.exports = tipMessage;