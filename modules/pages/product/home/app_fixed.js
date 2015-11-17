/**
 * @require style.css  
 */
 var $ 		= require("zepto");
 var home	= require("fixed");

 var app = {
 	init: function () {
 		home.create({
 			noScroll: true,
 			container: $("#context")
 		});
 	}
 };

 app.init();