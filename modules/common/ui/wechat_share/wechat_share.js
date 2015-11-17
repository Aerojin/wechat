/**
 * @require style.css
 */
var $ = require("zepto");

var wechatShare = {

	regEvent: function () {
		this.context.on("touchstart", $.proxy(function () {
			this.close();

			return false;
		}, this));
	},

	create: function (options) {
		this.context 	= $(tmpl);
		this.container 	= options.container || $("body");

		this.container.append(this.context);

		this.regEvent();
	},

	show: function (options) {
		options = options || {};

		if(!this.context){
			this.create(options);
		}

		if(options.callback){
			options.callback();
		}

		this.context.show();
	},

	close: function (callback) {
		this.context.hide();

		if(callback){
			callback();
		}
	}
};

var image = __uri("tip-share.png");
var tmpl  = '<div class="mask"><div class="tips-layer"><img src="{0}"></div></div>'.format(image);

module.exports = wechatShare;