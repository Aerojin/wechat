/**
 * @require style.css  
 */

 // var $ 			= require("zepto");
 // var versions 	= require("base/versions");
 // var maskLayer	= require("ui/masklayer/masklayer");
 
 // var download = {
 // 	init: function () {

 // 		this.ui = {};
 // 		this.ui.divTip 		= $("#div-tip");
 // 		this.ui.dialog  	= $("#dialog");
 // 		this.ui.btnDownload = $("#btn-download");

 // 		this.ui.dialog.css("height", document.body.scrollHeight);

 // 		this.regEvent(); 		
 // 	},

 // 	regEvent: function () {
 		
 // 		this.ui.btnDownload.on("click", $.proxy(function () {
 // 			var fun = this.download[versions.getSystem()] || this.download["android"];

 // 			fun.call(this);

 // 			return false;
 // 		}, this));

 // 		this.ui.dialog.on("touchstart", $.proxy(function () {
 // 			this.ui.dialog.hide();
 // 			this.ui.divTip.hide();
 // 		}, this));
		
 // 	},
 // 	download: {
 // 		"ios": function () {
 // 			window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.meetrend.moneybox";
 // 		},

 // 		"android": function () {
 // 			window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.meetrend.moneybox";
 // 			/*
 // 			if(versions.getSource() == "wechat"){
	//  			this.ui.dialog.show();
	//  			this.ui.divTip.show();

	//  			return false;
	//  		}
	//  		*/
 // 		}
 // 	}
 // };

 // download.init();