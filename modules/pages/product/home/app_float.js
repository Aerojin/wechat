/**
 * @require style.css  
 */
 var $ 		= require("zepto");
 var home	= require("float");

 var app = {
 	init: function () {
 		home.create({
 			noScroll: true,
 			container: $("#context")
 		})
 	}
 };

 app.init();