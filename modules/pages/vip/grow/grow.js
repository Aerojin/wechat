/**
 * @require style.css
 */
var $         = require("zepto");
var user      = require("kit/user");
var vipConfig = require("ui/vip_config/vip_config");
var queryString 	= require("kit/query_string");

var grow = {
	init : function(){
		this.ui       = {};
		this.ui.level = $(".level");
		this.minLevel = 0;
		this.maxLevel = 4;

		this.queryString = queryString();

		this.memberLevel = user.get("memberLevel") || this.queryString.memberLevel;

		this.renderLi();
	},
	renderLi : function(){
		var children = this.ui.level.children("li");
		var arr = [];
		var vipIco = vipConfig.getVipIcos();
		for(var i = 0, len = children.length; i < len; i++){
			arr.push(children[i]);
		}
		arr.reverse();
		for(var i = 0, len = arr.length; i < len; i++){
			$(arr[i]).children().children("img").attr("src",vipIco[i]);
		}
		(this.memberLevel >= this.minLevel) && (this.memberLevel <= this.maxLevel) && ($(arr[this.memberLevel]).addClass("active"));
	}
};
grow.init();