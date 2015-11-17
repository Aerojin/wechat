/**
 * @require style.css  
 */
 var $ 				= require("zepto");
 var home			= require("hqb");
var appApi 		 	= require("kit/app_api");
var eventFactory 	= require("base/event_factory");
 var app = {
 	init: function () {
 		home.create({
 			container: $("#context")
 		});

 		this.regEvent();
 	},
 	
 	regEvent: function () {
		$("#btn-buy").on("click", $.proxy(function () {
			eventFactory.exec({
				wap: function () {
					window.location.href = "$root$/user/login.html";
				},
				app: function () {
					window.location.href = appApi.getLogin();
				}
			});

			return false;
		}, this));
	}
 };

 app.init();