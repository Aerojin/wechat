//1：天添牛，2：指数牛，3：活期宝 4:惠房宝 5: 信托一号, 6:bs2p

var $ 				= require("zepto");
var user 			= require("kit/user");
var artTemplate 	= require("artTemplate");
var model 			= require("product_model");
var appApi 		 	= require("kit/app_api");
var eventFactory 	= require("base/event_factory");

var views = function (options) {
	this.model 		= new model(options.data);
	this.template 	= this.getTemplate();

	this.init();
};

views.prototype.init = function () {

	this.ui = {};
	this.ui.wrap 		= $(this.template(this.getData()));
	this.ui.btnSubmit 	= this.ui.wrap.find("#btn-submit");

	this.regEvent();
};

views.prototype.regEvent = function () {
	this.ui.btnSubmit.click($.proxy(function () {
		this.submit();
	}, this));
};

views.prototype.getElement = function () {
	return this.ui.wrap;
};

views.prototype.getTemplate = function () {
	if(this.model.getType() == 300){
		return artTemplate.compile(__inline("hqb.tmpl"));
	}

	return artTemplate.compile(__inline("fixed.tmpl"));	
};

views.prototype.getData = function () {
	if(!this.data){
		this.data = this.model.getData();
	}

	return this.data;
};

views.prototype.submit = function () {
	if(user.isLogin()){
		var productId = this.getData().productId;
		var typeValue = this.getData().typeValue;
		var url = "$root$/product/buy_detail.html?productId={0}&typeValue={1}";

		window.location.href = url.format(productId, typeValue);
		return;
	}

	eventFactory.exec({
		wap: function () {
			window.location.href = "$root$/user/login.html";
		},
		app: function () {
			window.location.href = appApi.getLogin();
		}
	});
};

module.exports = views;