/**
 * @require style.css
 */
var $           = require("zepto");
var slider      = require("ui/slider_page/slider_page");
var vipConfig = require("ui/vip_config/vip_config");

var levelPrivilege = {
	init : function(){
		this.ui          = {};
		this.ui.menu     = $("#tabBarId li");
		this.ui.list     = $(".item");
		this.ui.context  = $(".floatBox");
		this.ui.badgeImg = $(".levelImage");

		slider.create({
			activeClass: "active",
			index: 3,
			menu: this.ui.menu,
			list: this.ui.list,
			context: this.ui.context
		});

		this.renderImg();
	},
	renderImg : function(){
		var children = this.ui.badgeImg;
		var arr = [];
		var vipIco = vipConfig.getVipIcos();
		for(var i = 0, len = children.length; i < len; i++){
			$(children[i]).attr("src",vipIco[i+1]);
		}
	}
};
levelPrivilege.init();