/**
 * @require style.css
 */
var $ 			  	= require("zepto");
var api 		  	= require("api/api");
var tipMessage	  	= require("ui/tip_message/tip_message");
var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试",
	SYS_SUCCESS : "设置成功"
};
 var secret = {
 	init : function(){
 		this.ui          = {};
 		this.ui.shutdown = $(".shutdown");
 		this.ui.startup  = $(".startup");
 		this.ui.buttonP1 = $(".buttonP1");
 		this.ui.buttonP2 = $(".buttonP2");

 		this.refreshPage();
 		this.regEvent();
 	},
 	regEvent : function(){
 		this.ui.buttonP1.on("touchstart", $.proxy(function(){
 			this.updateSecret(1);
 			return false;
 		},this));
 		this.ui.buttonP2.on("touchstart", $.proxy(function(){
 			this.updateSecret(2);
 			return false;
 		},this));
 	},
 	refreshPage : function(){
 		var options = {
			data : {}
		};
		options.success = function(e){
			var resultData = e.data;
			var state = (resultData == "Y" ? 1 : 0);
 			state ? this.setShow() : this.setHide();
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};
		api.send(api.ACTIVITY, "getSecretInfo", options, this);//需要在api中增加请求
 	},
 	showFloateLayer : function(){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			data[i].removeClass("dn");
		};
	},
	hideFloateLayer : function(){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			data[i].addClass("dn");
		};
	},
	setShow : function(){
		this.showFloateLayer(this.ui.startup);
 		this.hideFloateLayer(this.ui.shutdown);
	},
	setHide : function(){
		this.showFloateLayer(this.ui.shutdown);
 		this.hideFloateLayer(this.ui.startup);
	},
	updateSecret : function(setState){
		(setState == 1) ? this.setShow() : this.setHide();
		var state = {"secretFlag" : "N"};
		(setState == 1) && (state = {"secretFlag" : "Y"});
 		//向后台发送打开请求
 		var options = {
			data : state
		};
		options.success = function(e){
			tipMessage.show(TIPS.SYS_SUCCESS, {delay : 2000});
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};
		api.send(api.ACTIVITY, "updateSecretInfo", options, this);//需要在api中增加请求
	}
 };
 secret.init();