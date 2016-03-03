var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny	= require("kit/money_cny");
var countDown	= require("kit/countdown");
var validate 	= require("kit/validate");
var serverTime 	= require("kit/server_time");
var tipMessage 	= require("ui/tip_message/tip_message");
var dialogsPwd 	= require("ui/dialogs_password/dialogs_password");

var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试",
	ZR_ERROR: "已发生转让不可撤销",
	OVER: "转让已结束"
};

var views = function (options) {
	this.data = options.data;

	this.init();
};

views.prototype.init = function(){

	var template = artTemplate.compile(__inline("attorning.tmpl"));
		template = template(this.format());

	this.ui 			= {};
	this.ui.wrap 		= $(template);
	this.ui.btnGray 	= this.ui.wrap.find(".btn-gray1");
	this.ui.btnSubmit 	= this.ui.wrap.find(".btn-submit");
	this.ui.countDown 	= this.ui.wrap.find(".count-down");
	this.ui.over     	= this.ui.wrap.find(".over");

	this.start();
	this.regEvent();
};

views.prototype.regEvent = function(){
	var _this = this;

		this.ui.btnSubmit.on("click", $.proxy(function () {
			this.submitInfo();
		}, this));

		this.ui.btnGray.on("click", $.proxy(function () {
			tipMessage.show(TIPS.ZR_ERROR, {delay: 2000});
			return false;
		}, this));

		this.ui.over.on("click", $.proxy(function () {
			tipMessage.show(TIPS.OVER, {delay: 2000});
			return false;
		}, this));
};

views.prototype.start = function(){
	var _this = this;

	countDown.create({
		msec: this.data.countdown,
		onChange: function (obj) {
			var text = _this.randerCountDown(obj);
			//console.log(text);

			_this.ui.countDown.html(text);
		},
		onComplete: function (obj) {
			
		}
	});
};

views.prototype.randerCountDown = function(obj){
	var array = [];

	array.push("倒计时<span class='text-red'>{0}</span>天");
	array.push("<span class='text-red'>{1}</span>时");
	array.push("<span class='text-red'>{2}</span>分");
	array.push("<span class='text-red'>{3}</span>秒");

	return array.join("").format(obj.day, obj.hour, obj.minute, obj.second);
};

views.prototype.submitInfo = function(){
	var _this = this;

	this.dialogsPwd = dialogsPwd.create({
		onUpdate: function (result)  {
			_this.verifyPayPwd(result);
			_this.dialogsPwd.close();
		}
	});
};

views.prototype.verifyPayPwd = function(pwd){
	var options = {};

	options.data = {
		fid: this.data.fid,
		payPassword: pwd
	};

	options.success = function (e) {
		var result = e.data || {};

		if(result){
			var date1 = serverTime.getServerTime().format("yyyy-MM-dd.hh-mm-ss");
			var date2 = this.data.transferTime.replace(" ",".").replace(/\:/g,"-");

			var data = {
				date1: date1,
				date2: date2,
				amount: this.data.amount
			};

			window.location.href = "$root$/account/attorning_result.html?" + $.param(data);

			return;
		}

		tipMessage.show(this.TIPS.SYS_ERROR, {delay: 1800});
	};

	options.error = function (e) {
		this.loading.close();
		tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 1800});
	};
	
	api.send(api.PRODUCT, "cancelInvestTransfer", options, this);
};

views.prototype.getElement = function(){
	return this.ui.wrap;
};

views.prototype.format = function(){
	var percent             = Math.floor(this.data.salesAmount / this.data.amount * 100);
	this.data.percent 		= percent > 100 ? 100 : percent;
	this.data.fee 			= moneyCny.toFixed(this.data.fee);
	this.data.amount 		= moneyCny.toFixed(this.data.amount);
	this.data.profit 		= moneyCny.toFixed(this.data.profit);
	this.data.principal 	= moneyCny.toFixed(this.data.principal);
	this.data.salesAmount 	= moneyCny.toFixed(this.data.salesAmount);
	this.data.isRevocation 	= this.data.salesAmount <= 0;
	this.data.equityURL     = this.getEquityURL(this.data);//协议

	return this.data;
};

views.prototype.getEquityURL = function (data) {
	var result = [];

	if(validate.isEmpty(result)){
		return {
			title: "债权转让服务协议",
			featureName: "债权转让服务协议",
			featureValue: "$root$/agreement/zqzr_agreement.html"
		};
	}

	return result;
}

module.exports = views;
