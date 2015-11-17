var $          	= require("zepto");
var api 	   	= require("api/api");
var queryString	= require("kit/query_string");

var news = {
	init : function(){
		this.ui          = {};
		this.ui.title    = $("#titleId");
		this.ui.dateTime = $("#dateId");
		this.ui.source   = $("#sourceId");
		this.ui.content  = $("#contentId");
		this.ui.loading  = $("#loading");
		this.ui.empty  	 = $("#empty");
		this.ui.context  = $("#context");

		this.queryString = queryString() || {};

		this.getNews();
	},
	renderBody : function(data){
		if(data && data.content){
			this.showContext();
			this.ui.title.text(data.title);
			this.ui.dateTime.text(data.createTime.substring(0,10));
			this.ui.source.text(data.source);
			this.ui.content.html(data.content);
		}else{
			this.showEmpty();
		}
	},
	getNews : function(){
		var options = {
			data : {
				"msgId" : this.queryString.msgId || "",
				"isLoginRedirect" : true //传给web_status.js，判断是否需要跳转到登录页，为true则不需要跳转到登录页。
			}
		};
		options.success = function(e){
			var data = e.data;
			this.renderBody(data.result || data);
		};
		options.error = function(e){
			this.showEmpty();
		};

		api.send(api.SUNDRY, "getNewsInfo", options, this);
	},
	showEmpty: function () {
		this.ui.loading.hide();
		this.ui.empty.show();
	},
	showContext: function () {
		this.ui.loading.hide();
		this.ui.context.show();
	}
};
news.init();