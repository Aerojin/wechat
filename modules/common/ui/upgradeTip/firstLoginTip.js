/** 
 * @require style.css
 */
 var $           = require("zepto");
 var artTemplate = require("artTemplate");
 var qt          = __uri("photo-qt.png");
 var by          = __uri("photo-by.png");
 var hj          = __uri("photo-hj.png");
 var bj          = __uri("photo-bj.png");

 var firstLoginTip = {
 	showUpgradeTip : function(vipInfo){
 		var template  = artTemplate.compile(__inline("firstLoginTip.tmpl"));
 		template      = template({
 			memberLevel : vipInfo.memberLevel,
 			qt : qt,
 			by : by,
 			hj : hj,
 			bj : bj
 		});

 		$(template).appendTo("body");

 		this.regEvent();
 	},
 	regEvent : function(){
 		$("#ok, .closed").on("tap", function(){
 			$(".firstLoginTip").addClass("dn");
 			return false;
 		});
 	}
 };

module.exports = firstLoginTip;