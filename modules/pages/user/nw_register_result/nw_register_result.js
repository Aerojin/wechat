/**
 * @require style.css  
 */
var $ 				= require("zepto");
var getDefaultUri	= require("kit/default_uri");

var register = {
	init: function () {

		this.ui = {};
		this.ui.btnSubmit = $("#btn-submit");

		this.regEvent();
	},

	regEvent: function () {

		this.ui.btnSubmit.on("touchstart click", $.proxy(function () {
			window.location.href = getDefaultUri();

			return false;
		}, this));
	}
};

register.init();