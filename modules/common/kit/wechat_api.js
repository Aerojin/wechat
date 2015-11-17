var $ 	= require("zepto");
var api = require("api/api");

var weChatApi = function (options) {

	this.callback = options.callback;

	this.init(options);
};

weChatApi.prototype.init = function (param) {
	var options = {};
	var url = param.url || location.href.replace(/#.+$/, '');

	options.data = {
		url: url
	};

	options.success = function (e) {
		var result = e.data;

		wx.config({
			//debug : true, //调试
			appId : result.appId,
			timestamp : result.timestamp,
			nonceStr : result.noncestr,
			signature : result.signature,
			jsApiList : ['showOptionMenu','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ']
		});

		wx.ready(function(){
			wx.onMenuShareQQ(param.data);
			wx.onMenuShareTimeline(param.data);
			wx.onMenuShareAppMessage(param.data);

			if(this.callback){
				this.callback(wx);
			}
		});

		wx.error(function (res) {
			//alert(res.errMsg);
			//console.log(res);
		});
	};

	options.error = function () {

	};

	api.send(api.USER, "weChatShare", options, this);
};

module.exports = {
	create: function (options) {
		return new weChatApi(options || {});
	}
};