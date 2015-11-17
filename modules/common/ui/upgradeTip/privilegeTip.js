/** 
 * @require style.css
 */
 var $           = require("zepto");
 var artTemplate = require("artTemplate");
 var vipConfig   = require("ui/vip_config/vip_config");
 var api 		 = require("api/api");

 var privilegeTip = {
 	showUpgradeTip : function(vipInfo){
 		var template  = artTemplate.compile(__inline("privilegeTip.tmpl"));
 		template      = template(vipInfo); 		

 		$(template).appendTo("body");

 		var options = {
			data : {}
		};
		api.send(api.USER, "firstUpgradePrompt", options, this);

 		this.regEvent();
 	},
 	regEvent : function(){
 		$("#detail, .closed").on("tap", function(){
 			$(".privilegeTip").addClass("dn");
 			return false;
 		});
 	}
 };

module.exports = privilegeTip;