var $ 			= require("zepto");
var api 		= require("api/api");
var moneyCny 	= require("kit/money_cny");
var serverTime 	= require("kit/server_time");

var STATUS = {
	OVERDUE: "OVERDUE",
	EXCHANGED: "EXCHANGED",
	UNEXCHANGE: "UNEXCHANGE"
};

var model = function (options) {
	this.money  	= 0;
	this.data 		= [];
	this.productId 	= options.productId || "";
};

//获取红包数据
model.prototype.getList = function (param, context) {
	var options = {};

	options.data = $.extend({
		status: STATUS.UNEXCHANGE,
		productId: this.productId
	}, param.data || {});

	options.success = function (e) {
		var result = e.data || {};
		var data = this.format(result.list || []);
		
		if(param.success){
			param.success.call(context, data);
		}
	};

	options.error = function (e) {
		if(param.error){
			param.error.call(context, e);
		}
	};

	api.send(api.ACTIVITY, "findRedPacketList", options, this);
};

//数据格式化
model.prototype.format = function (data) {
	var _this = this;

	data.map(function(value, index){
		value.index 			= index;
		value.isSelected 		= index == _this.index;
		value.isUsable	 		= _this.getIsUsable(value);
		value.newMoney 	 		= moneyCny.toYuan(value.fMoney);
		value.newOriginMoney	= moneyCny.toYuan(value.fOriginMoney);
		value.newExpireDay 		= _this.getDiffTime(value.fExpireDate).fExpireDay;
	});


	this.data = data;

	return data;
};

//计算剩余时间
model.prototype.getDiffTime = function (date) {
	var date2 = date.parseDate();
	var date1 = serverTime.getServerTime();		
	var diffTime = serverTime.getServerDiff(date1, date2);

	if(diffTime.day > 0){
		return {
			expireDay: diffTime.day,
			fExpireDay: diffTime.day + "天"
		};
	}

	if(diffTime.hour > 0){
		return {
			expireDay: diffTime.hour,
			fExpireDay: diffTime.hour + "个小时"
		};
	}

	if(diffTime.minute > 0){
		return {
			expireDay: diffTime.minute,
			fExpireDay: diffTime.minute + "分钟"
		};
	}

	return {
		expireDay: 0, 
		fExpireDay: date2.format("yyyy-MM-dd")
	};
};

//设置金额
model.prototype.setMoney = function (money) {
	this.money = money || 0;
};

//获取金额
model.prototype.getMoney = function () {
	return this.money;
};

//获取数据
model.prototype.getData = function (index) {
	if(index === undefined){
		return this.data || [];
	}

	return this.data[index] || {};	
};

//判断红包是否可用
model.prototype.getIsUsable = function (data) {
	var money = moneyCny.toHao(this.money);

	return data.fOriginMoney <= money;
};

module.exports = model;