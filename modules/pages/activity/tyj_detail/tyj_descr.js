var $ 				= require("zepto");
var queryString 	= require("kit/query_string");


var tyj_descr = {

	init: function () {
		
		this.ui = {};
		this.ui.spanRate  = $("#span-rate");
		this.ui.spanDays  = $("#span-days");

		this.queryString = queryString() || {};

		this.getData();
	},


	getData:function(){
		this.ui.spanRate.text(this.queryString.rate);
		this.ui.spanDays.text(this.queryString.days);

	}


};

tyj_descr.init();