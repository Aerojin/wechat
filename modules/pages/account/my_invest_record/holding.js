var $ 			= require("zepto");
var api 		= require("api/api");
var user 		= require("kit/user");
var artTemplate = require("artTemplate");
var iscroll 	= require("ui/iscroll/views");
var tipMessage 	= require("ui/tip_message/tip_message");


var TIPS = {
	BAN1:"投资期限不足60天不可转让",
	BAN2:"产品剩余期限不足30天不可转让",
	PENDDING:"持有时间超过30日方可申请转让"
};


var holding = {

	pageIndex: 1,

	pageSize: 10,

	init: function (options) {

		this.ui = {};
		this.ui.wrap 	= options.container;
		this.template  	= artTemplate.compile(__inline("context.tmpl"));

		this.format  = options.format;
		this.padding = options.padding;
		this.proType = options.proType;

		this.createWaterfall();
		this.getData();
	},

	getData: function () {
		var options = {};

		options.data = {
			status: 2,
			parentProductType: this.proType || 1,
			pageSize: this.pageSize,
			pageIndex: this.pageIndex
		};

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list || []);
			
 			if(result.list.length > 0){
	 			this.iscroll.setPageCount(result.pageCount);
	 			this.iscroll.appendContext(this.template({
	 					tabIndex: 0,
		 				status: 2,
		 				data: data
 				}));

 				this.setContext();
		 		return;
	 		}

	 		this.iscroll.showEmpty();
		};

		options.error = function (e) {
			this.iscroll.showEmpty();
		};

		api.send(api.PRODUCT, "queryUserInvestRecord", options, this);
	},

	setContext:function(){
		this.ui.btnTransfer = $(".js-btn-transfer");

		this.regEvent();
	},

	regEvent:function(){

		this.ui.btnTransfer.on("click", function(){
			var fid    = $(this).data("fid");
			var status = $(this).data("status");

			switch(status){
				case 1:
					tipMessage.show(TIPS.BAN1, {delay:2000});
					break;
				case 2:
					tipMessage.show(TIPS.PENDDING, {delay:2000});
					break;
				case 3:
					//申请转让
					window.location.href = "$root$/account/doattorn.html?investId=" + fid;
					break;
				case 4:
					tipMessage.show(TIPS.BAN2, {delay:2000});
					break;
			}

			return false;
		});
	},

	createWaterfall: function (data) {
 		var _this = this;

 		this.iscroll = iscroll.create({
 			pageIndex: 1,
 			pageCount: 1,
 			pageSize: this.pageSize,
 			container: this.ui.wrap,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	}

};

module.exports = {
	create: function (options) {
		holding.init(options || {});
	}
};