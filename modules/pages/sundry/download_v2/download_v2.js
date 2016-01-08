/**
 * @require style.css  
 */
 var $ 			= require("zepto");
 var fullpage 	= require("fullpage");

 var download = {
 	init: function () {

 		this.ui = {};
 		this.ui.page 	 = $(".page");
 		this.ui.pageWrap = $("#pageWrap");
 		//this.ui.pageWrap.height(document.documentElement.clientHeight);

 		/*
 		fullpage.create(this.ui.pageWrap.get(0), {
 			loop:true
 		});
		*/
 		
 		this.regEvent(); 		
 	},
 	regEvent: function () {
 		$(window).resize($.proxy(function () {
 			var height = document.documentElement.clientHeight;

	 		this.ui.page.css({
	 			"height": height,
	 			"background-size": "100% {0}px".format(height)
	 		});	

	 		/*
	 		this.ui.page.eq(0).css({
	 			"background-size": ""
	 		});*/
 		}, this));

 		$(window).resize();
 	}


 };

 download.init();