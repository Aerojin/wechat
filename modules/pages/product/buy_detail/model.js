var moneyCny		= require("kit/money_cny");
var serverTime		= require("kit/server_time");
var priductFormat	= require("kit/product_format");

//产品按份购买的默认配置
var COPIES = {
	VALUE: 1,
	MONEY: 1000,
	AMOUNT: 0
};

var model = function (options) {
	
	this.data 		= options.data;
	this.totalDay 	= options.totalDay || 360;

	this.init();
};

model.prototype.init = function () {

	this.data = this.format(this.data);
};


model.prototype.getData = function () {
	return this.data;
};

model.prototype.getType = function () {
	return this.data.typeValue;
};

model.prototype.getCopies = function () {
	return COPIES;
};

model.prototype.getAbleBalance = function () {
	return this.data.ableBalance;
};

model.prototype.getRedPakNum = function () {
	return this.data.redPakNum;
};

model.prototype.format = function (data) {
	var result = priductFormat.format(data);
	
	result.day 			= result.deadLineValue;
	result.fixRate 		= result.fixRateDisplay;
	result.productName 	= result.productName;
	result.redPakNum	= result.redPakNum || 0;
	result.ableBalance	= moneyCny.toYuan(result.ableBalance);
	result.buyMaxMoney 	= moneyCny.toUnit(result.cBuyMaxMoney);
	result.buyedMoney 	= moneyCny.toUnit(result.cBuyMaxMoney - result.userBuyedMoney);

	result.awardRateSetting = this.formatAwardRate(result.awardRateSetting);

	if(result.typeValue == 5 || result.typeValue == 502){
		result.copies = COPIES.VALUE;
		result.copiesMoney = COPIES.MONEY;
		result.copiesAmount = result.copies * result.copiesMoney;
	}

	return result;
};

//过滤未开始和已经结束的活动
model.prototype.formatAwardRate = function (data) {
	if(!data){
		return [];
	}

	var array 	= [];
	var time 	= serverTime.getServerTime().getTime();

	for(var i = 0; i < data.length; i++){
		var beginTime 	= data[i].beginTime.parseDate().getTime();
		var endTime 	= data[i].endTime.parseDate().getTime();

		if(time > beginTime && time < endTime){
			array.push(data[i]);
		}
	}

	return array;
};

//获取各种利率
model.prototype.getEarnings = function (money) {
	var earnings = this.getRate(this.data.fixRate, money);

	//会员收益加成
	var addition = this.getRate(this.data.vipRate, money);

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
		isVip: this.data.isVip,
		awardRate: awardRate.data,
		result: moneyCny.toDecimal(result, 2)
	};
};

model.prototype.getTotalEarnings = function (money) {
	return this.getEarnings(money).result;	
};

//获取活动利率
model.prototype.getAwardRate = function (money) {
	var array = [];
	var total = 0;
	var data  = this.data.awardRateSetting || [];

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
	var money = Number(amount || 0);
	var rate  = Number(this.data.day).mul(Number(rate));
	var earnings = rate.div(Number(this.totalDay));

	return Math.floor(earnings * money) / 100;
};

module.exports = model; 