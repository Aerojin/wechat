//1：天添牛，2：指数牛，3：活期宝 4:惠房宝 5: 信托一号, 6:bs2p

var $ 				= require("zepto");
var user 			= require("kit/user");
var artTemplate 	= require("artTemplate");
var model 			= require("product_model");
var appApi 		 	= require("kit/app_api");
var countDown 		= require("kit/countdown");
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
	this.ui.countDown	= this.ui.wrap.find("#count-down");

	this.regEvent();
	this.startCountDown();
};

views.prototype.regEvent = function () {
	this.ui.btnSubmit.click($.proxy(function () {
		this.submit();
	}, this));
};

views.prototype.startCountDown = function () {
	var _this = this;
	
	countDown.create({
		msec: this.data.countdown,
		onChange: function (obj) {
			var text = _this.randerCountDown(obj);

			_this.ui.countDown.html(text);
		},
		onComplete: function (obj) {
			//_this.ui.wrap.remove();
		}
	});
};

views.prototype.randerCountDown = function(obj){
	var array = [];

	array.push("<span class='fl'>倒计时</span>");
	array.push("<span class='text-red'>{0}</span>天");
	array.push("<span class='text-red'>{1}</span>时");
	array.push("<span class='text-red'>{2}</span>分");
	array.push("<span class='text-red'>{3}</span>秒");

	return array.join("").format(obj.day, obj.hour, obj.minute, obj.second);
};

views.prototype.getElement = function () {
	return this.ui.wrap;
};

views.prototype.getTemplate = function () {
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
		var fid = this.getData().fid;		
		var url = "$root$/product/transfer_buy.html?fid={0}";

		window.location.href = url.format(fid);
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