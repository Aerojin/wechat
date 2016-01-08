var $ 			 = require("zepto");
var moneyCny 	 = require("kit/money_cny");
var productSuper = require("kit/product_super");

var model =  function (data) {
	this.data = data;
	this.init();

	this.data.isShowEarnings = this.isShowEarnings();
};

//继承父类公有属性, 方法
model.prototype = new productSuper();

//重写父类获取活动的方法
model.prototype.getActivityInfo = function () {
	return this.filterActivity(this.data.awardRateSetting || []);
};

//判断是否需要显示加息按钮
model.prototype.isShowEarnings = function () {
	return this.data.vipInfo.isVip || this.data.activityInfo.length > 0;
};

//获取各种利率
model.prototype.getEarnings = function (money) {
	var earnings = this.getRate(this.data.fixRate, money);

	//会员收益加成
	var addition = this.getRate(this.data.vipInfo.awardRate, money);

	//活动收益
	var awardRate = this.getAwardRate(money);

	//总收益
	var result = earnings.plus(addition).plus(awardRate.total);

	if(window.isNaN(earnings)){
		return 0;
	}

	return {
		earnings: earnings,
		vipEarnings: addition,
		awardRate: awardRate.data,
		isVip: this.data.vipInfo.isVip,
		result: moneyCny.toDecimal(result, 2)
	};
};

//获取总收益
model.prototype.getTotalEarnings = function (money) {
	return this.getEarnings(money).result;	
};

//获取活动利率
model.prototype.getAwardRate = function (money) {
	var array = [];
	var total = 0;
	var data  = this.data.activityInfo || [];

	for(var i = 0; i < data.length; i++){
		var rate = this.getRate(data[i].awardRate, money);

		total += rate;

		array.push({
			value: rate,
			text: data[i].activityName				
		});
	}

	total = Math.floor(total.mul(100));
	total = total.div(100);

	return {
		data: array,
		total: total
	};
};

//根据金额,利率计算出利息
model.prototype.getRate = function (rate, amount) {
	var totalDay 	= 360;
	var money 		= Number(amount || 0);
	var rate  		= Number(this.data.deadLineValue).mul(Number(rate || 0));
	var earnings 	= rate.div(totalDay);

	return Math.floor(earnings.mul(money)).div(100);
};


//获取用户账户余额
model.prototype.getAbleBalance = function () {
	return this.data.balance;
};

//set协议
model.prototype.setProtocol = function (index) {
	var obj = this.data.protocolUri[index];
		obj.checked = !obj.checked;

	this.data.protocolUri[index] = obj;

	this.onPotocolChange(index, obj.checked);
};

//获取是否全部勾选协议
model.prototype.getProtocolChecked = function () {
	var checked = true;
	var array   = this.data.protocolUri;

	for(var i = 0; i < array.length; i++){
		if(!array[i].checked){
			checked = false;
			break;
		}
	}

	return checked;
};

model.prototype.set = function (key, value) {
	this.data[key] = value;
};

model.prototype.get = function (key) {
	return this.data[key];
};

model.prototype.onPotocolChange = function () {

};

module.exports = model;