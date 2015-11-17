/**
* @require style.css
*/
 var $ 		  		= require("zepto");
 var api 			= require("api/api");
 var user     		= require("kit/user");
 var artTemplate 	= require("artTemplate");
 var smartbar 		= require("ui/smartbar/smartbar");
 var sliderBar 		= require("ui/slider_bar/slider_bar");

var index = {
	init: function () {

		this.ui = {};
		this.ui.divHqb 			= $("#div-hqb");
		this.ui.btnItem			= $("#btn-item");
		this.ui.ulActivity 		= $("#ul-activity");
		this.ui.sliderContainer	= $("#slider-container");

		this.smartbar 	= smartbar.create();

		this.template 	= {};
		this.template.hqb		= artTemplate.compile(__inline("hqb.tmpl"));
		this.template.activity	= artTemplate.compile(__inline("activity.tmpl"));

		this.getHqb();
		this.getBanner();
		this.getActivity();
	},

	regEvent: function () {
		var _this = this;

		this.ui.btnItem.on("touchstart", function () {
			return false;
		});
	},

	getActivity: function () {
 		var options = {};

 		options.data = {
 			pageIndex: "wechat_activity_banner"
 		};

 		options.success = function (e) {
 			var result 	= e.data;
 			var data 	= this.format(result.list); 

 			if(data.length > 0){
	 			this.ui.ulActivity.html(this.template.activity({
	 				data: data
	 			}));

	 			return;
	 		}
 		};

 		options.error = function (e) {
 		};

 		api.send(api.ACTIVITY, "findAdvertiseList", options, this);
 		
 	},

 	getBanner: function () {
 		var options = {};

 		options.data = {
 			pageIndex: "wechat_home_page"
 		};

 		options.success = function (e) {
 			var result 	= e.data;
 			var data 	= this.formatBanner(result.list); 


 			this.createSlider(data);
 		};

 		options.error = function (e) {
 			this.showEmpty();
 		};

 		api.send(api.ACTIVITY, "findAdvertiseList", options, this);
 	},

 	getHqb: function () {
 		var options = {};

		options.data = {

		};

		options.success = function (e) {
			var result = e.data;

			var html = this.template.hqb({
				flowMinRate: result.flowMinRateDisplay,
				flowMaxRate: result.flowMaxRateDisplay,
			});

			this.ui.divHqb.html(html);
			this.regEvent();
		};

		options.error = function () {

		};

		api.send(api.PRODUCT, "queryProductInfo", options, this);
 	},

 	format: function (data) {
 		var userId 	= user.get("userId");  
 		var token	= user.get("token");

 		data.map(function (value, index) {
 			value.linkUrl += "?userId={0}&token={1}".format(userId, token);
 		});

 		return data;
 	},

 	formatBanner: function (data) {
 		data.map(function (value, index) {
 			value.src = value.imgUrl;
 			value.link = value.linkUrl;
 		});

 		return data;
 	},

 	createSlider: function (data) {
 		var _this = this;

 		this.ui.btnItem.html(this.getSpan(data.length));
 		_this.activateSpan(0);

		this.slider = new sliderBar.create({
			data: data,
			timeout: 5000,
			container: this.ui.sliderContainer
		});

		this.slider.onChange = function (index) {
			_this.activateSpan(index);
		}		
	},

	activateSpan: function (index) {
		this.ui.btnItem.find('span').removeClass('z-on');
		this.ui.btnItem.find('span').eq(index || 0).addClass('z-on');
	},

	getSpan: function (length) {
		var array = [];
		var tmpl  = "<span></span>";

		for(var i = 0; i < length; i++){
			array.push(tmpl);
		}

		return array.join("\n");
	}


};

index.init();