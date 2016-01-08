var $ 			= require("zepto");
var api 		= require("api/api");
var waterfall 	= require("ui/waterfall/waterfall");

var luck = {

	pageIndex : 1,

	pageSize : 5,

	init : function(options){
		this.ui                = {};
		this.ui.wrap           = options.container;

		this.format            = options.format;
		this.setGotLuckyStatus = options.setGotLuckyStatus;
		this.padding           = options.padding;
		this.template          = options.template;

		this.createWaterfall();
		this.getData();
	},
	getData: function () {
		var options = {};

		options.data = {
			"pageIndex" : this.pageIndex,
			"pageSize" : this.pageSize
		}; 

		options.success = function (e) {
			var result 	= e.data;
			var data 	= this.format(result.list);
			
			this.setGotLuckyStatus.call(postMoney,data);

 			if(data.length > 0){				
	 			this.waterfall.setPageCount(result.pageCount);//总页数，需要计算
	 			this.waterfall.appendContext(this.template.luckyInfo({"luckyDatas": data}));	

	 			postMoney.ui.luckyListLi  = $(".luckyList li");//手气红包
	 			this.regLuckyEvent.call(postMoney);	
		 		return;
	 		}

			this.waterfall.showEmpty();
		};

		options.error = function () {
			this.waterfall.showEmpty();
		};

		this.waterfall.showLoading();		
		api.send(api.ACTIVITY, "queryLuckRedPacket", options, this);
	},
	createWaterfall: function (data) {
 		var _this = this;

 		this.waterfall = waterfall.create({
 			selector: ".waterfall-item",
 			pageSize: this.pageSize,
 			pageIndex: 1,
 			pageCount: 1,
 			padding: this.padding,
 			container: this.ui.wrap,
 			emptyHtml: this.template.empty,
 			onLoad: function (pageIndex) {
 				_this.pageIndex = pageIndex;
 				_this.getData();
 			}
 		});
 	},
 	regLuckyEvent : function(){
		this.ui.luckyListLi.on("singleTap",$.proxy(function(e){
			if(!this.tb){
				return false;
			}
			var index = -1;
			($(e.target).parent("ul").length != 0) && (index = $(e.target).index());
			(index == -1) && (index = $(e.target).parent("li").index());
			(index == -1) && (index = $(e.target).parent().parent("li").index());
			this.showChbLuckyHb(index);
			return false;
		},this));
	}
};

module.exports = {
	create : function(options){
		luck.init(options);
	}
};