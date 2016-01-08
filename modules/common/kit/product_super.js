/*
	state 状态码
	0.正常
	100.未开始
	200.已结束
	300.已售完
	400.已满额

	BUY_TYPE 产品购买类型
	0.默认
	100.按份购买
	200.活期宝

	activity 活动
	vip 会员
	tag 标签
	hot 热点标签
	progress 进度条
	type 产品类型
*/
var $ 			= require("zepto");
var user 		= require("user");
var validate 	= require("validate");
var moneyCny	= require("money_cny");
var serverTime 	= require("server_time");
var productUrl 	= require("product_url");


var TIPS = {
	DAY: "天",
	MONTH: "月"
};

var STATE = {
	NORMAL: 0,
	NOT_START: 100,
	END: 200,
	SELL_OUT: 300,
	QUOTA_OUT: 400
};

var STATE_TEXT = {
	0: "立即购买",
	100: "{0}月{1}日开抢",
	200: "已结束",
	300: "已售完",
	400: "已满额"
};

var BUY_TYPE = {
	DEFAULT: 0,
	PORTION: 100,
	HQB: 200
};

var TYPE = {
	FIXED: 100, 	//固定收益
	FLOAT: 200, 	//浮动收益
	RATE: 300		//活期宝
};

var model = function (data) {
	this.data 	= data || {};	
};

model.prototype.init = function () {

	this.data.isFlow 		= Number(this.data.isFlow);
	this.data.typeValue 	= Number(this.data.typeValue);
	this.data.flowMinRate 	= this.data.flowMinRateDisplay || "0.0";
	this.data.flowMaxRate 	= this.data.flowMaxRateDisplay || "0.0";
	this.data.fixRate 		= this.data.fixRate || 0;
	this.data.fixRateShow	= this.data.fixRateDisplay || "0.0";
	this.data.remaMoney 	= moneyCny.toYuan(this.getRemaMoney(), 0);

	this.data.extension 	= this.data.extension || {};

	//----活期宝-------
	this.data.balance 			= moneyCny.toYuan(this.data.ableBalance);
	this.data.fbuyBalance	 	= moneyCny.toUnit(this.data.fbuyBalance);
	this.data.remaMoneyDisplay	= moneyCny.toUnit(this.getRemaMoney(), 0, true);
	this.data.fPurchaseMaximum	= moneyCny.toUnit(this.data.fPurchaseMaximum);
	//----活期宝-------

	//----固定收益-------
	this.data.buyMinMoney 			= moneyCny.toYuan(this.data.buyMinMoney);
	this.data.buyTotalMoney 		= moneyCny.toYuan(this.data.buyTotalMoney);
	this.data.buyedTotalMoney 		= moneyCny.toYuan(this.data.buyedTotalMoney);
	this.data.buyMaxMoney			= moneyCny.toUnit(this.data.cBuyMaxMoney);
	this.data.buyedMoney 			= moneyCny.toUnit(this.data.cBuyMaxMoney - this.data.userBuyedMoney);

	//----固定收益-------

	this.data.token 		= user.get("token");
	this.data.userId 		= user.get("userId");
	this.data.dateUnit 		= this.getDateUnit();
	this.data.isLogin 		= user.isLogin();
	this.data.productId 	= this.getProductId();
	this.data.percentInfo 	= this.getPercentInfo();
	this.data.hotInfo 		= this.getHotInfo();
	this.data.vipInfo 		= this.getVipInfo();
	this.data.activityInfo	= this.getActivityInfo();
	this.data.type 			= this.getType();
	this.data.state 		= this.getState();
	this.data.stateText 	= this.getStateText();
	this.data.buyType 		= this.getBuyType();
	this.data.isUserLimit 	= this.isUserLimit();
	this.data.uri 			= this.getUrl();
	this.data.protocolUri 	= this.getProtocolUrl();
};

//vip信息
model.prototype.getVipInfo = function () {
	var vipInfo = this.data.memberAwardRate || {};

	vipInfo.isVip 			= !!Number(vipInfo.menberLevel);
	vipInfo.isVipProduct 	= !!this.data.memberAwardFlag;

	return vipInfo;
};

model.prototype.getProductId = function () {
	if(this.data.productId){
		return this.data.productId;
	}

	return this.data.fid;
};

//产品类型
model.prototype.getType = function () {
	if(this.data.isFlow == 1) {
		return TYPE.FIXED;
	}

	if(this.data.isFlow == 2 && this.data.typeValue != 3){
		return TYPE.FLOAT;
	}

	return TYPE.RATE;
};

//获取产品状态
model.prototype.getState = function () {
	if(this.isSellOut()){
		return STATE.SELL_OUT;
	}

	if(this.isQuotaOut()){
		return STATE.QUOTA_OUT;
	}

	if(this.isProductDate() && !this.getProductRule().isStart){
		return STATE.NOT_START;
	}

	if(this.isProductDate() && this.getProductRule().isEnd){
		return STATE.END;
	}

	return STATE.NORMAL;
};

//获取对应状态的文本
model.prototype.getStateText = function () {
	if(this.data.state == STATE.NOT_START){
		var start = this.getProductRule().starDate;
		var month = start.getMonth() + 1;
		var day   = start.getDate();

		return STATE_TEXT[this.data.state].format(month, day);
	}

	return STATE_TEXT[this.data.state];
};


//获取产品单位
model.prototype.getDateUnit = function () {
	if(Number(this.data.deadLineType || 0) == 1){
		return TIPS.DAY;
	}

	return TIPS.MONTH;
};

//判断产品是否售完
model.prototype.isSellOut = function () {
	var minMoney 	= this.data.buyMinMoney;
	var buyTotal 	= this.data.buyTotalMoney;
	var buyedTotal  = this.data.buyedTotalMoney;
	var result 		= buyTotal - buyedTotal;

	if(this.isProductLimit()){
		return this.data.status != 2 || result < minMoney;
	}

 	return false;
};

//产品是否设置额度
model.prototype.isProductLimit = function () {
	if(Number(this.data.buyTotalMoney) == 0){
		return false;
	}

	return true;
};

//产品是否限制用户购买额度
model.prototype.isUserLimit = function () {
	if(Number(this.data.cBuyMaxMoney) == 0){
		return false;
	}

	return true;
};

//获取产品额度百分比
model.prototype.getPercentInfo = function () {
	var extension 	= this.data.extension || {};
	var buyTotal 	= Number(this.data.buyTotalMoney || 0);
	var buyedTotal 	= Number(this.data.buyedTotalMoney || 0);
	var percent 	= (buyedTotal / buyTotal) * 100;

	if(percent > 0 && percent < 1){
		percent = 1;
	}

	if(this.isSellOut()){
		percent = 100;
	}

	return {
		isShow: !!extension.show_progress,
		value:  Math.floor(percent) + "%" 
	}
};

//获取产品剩余余额
model.prototype.getRemaMoney = function () {
	if(this.data.remaMoney < this.data.buyMinMoney){
		return 0;
	}

	return this.data.remaMoney;
};

//个人额度是否用完
model.prototype.isQuotaOut = function () {
	if(this.getType() == TYPE.RATE){
		return this.data.remaMoney == 0 || this.data.fbuyBalance == 0;
	}

	if(this.isUserLimit()){
		return this.data.userAvailableMoney <= 0;
		//return this.data.cBuyMaxMoney
	}

	return false;
};

//产品是否有购买时间限制
model.prototype.isProductDate = function () {
	if(validate.isEmpty(this.data.productRule)){
		return false;
	}

	return true;
};

//获取产品购买时间限制信息
model.prototype.getProductRule = function () {
	var obj 	= {};	
	var start 	= this.data.productRule.startBuyTime;
	var end 	= this.data.productRule.endBuyTime;

	if(!validate.isEmpty(start) && !validate.isEmpty(end)){
		obj.endDate	 = end.parseDate();
		obj.starDate = start.parseDate();
		obj.result   = serverTime.getDateActivity(start, end);

		return {
			endData: obj.endDate,
			starDate: obj.endDate,
			isEnd: obj.result.isEnd,
			isStart: obj.result.isStart
		};
	}

	return {
		endData: null,
		starDate: null,
		isEnd: false,
		isStart: true
	}
};

//获取热点标签信息
model.prototype.getHotInfo = function () {
	var extension 	= this.data.extension || {};

	return {
		isShow: !validate.isEmpty(extension.hot_product),
		value: extension.hot_product || ""
	};
};

//获取产品购买类型
model.prototype.getBuyType = function () {
	if(this.getType() == TYPE.RATE){
		return BUY_TYPE.HQB;
	}

	if(this.data.typeValue == 5 || (this.data.typeValue >= 500 && this.data.typeValue < 600)){
		return BUY_TYPE.PORTION;
	}

	return BUY_TYPE.DEFAULT;
};


//获取活动信息
model.prototype.getActivityInfo = function () {
	return [];
};

//判断活动是否在有效期内
model.prototype.isValid = function (data) {
	if(!data.beginTime || !data.endTime){
		return true;
	}
	
	var start 	= data.beginTime;
	var end   	= data.endTime;
	var result 	= serverTime.getDateActivity(start, end);

	if(result.result){
		return true;
	}

	return false;
};

//过滤未开始和已经结束的活动
model.prototype.filterActivity = function (data) {
	if(!data){
		return [];
	}

	var array 	= [];
	var userId 	= user.get("userId");
	var token 	= user.get("token");
	var param 	= "?userId={0}&token={1}".format(userId, token);

	for(var i = 0; i < data.length; i++){
		var result = data[i];

		if(validate.isEmpty(result.redirectUrl)){
			result.redirectUrl = "javascript:void(0);";
		}else{
			result.redirectUrl += param;
		}

		if(this.isValid(result)){
			array.push(result);
		}		
	}

	return array;
};

//获取产品各种URL配置
model.prototype.getUrl = function () {
	var data = this.data.auxiliaryInfo || {};

	if(!data.detailUrl){
		data.detailUrl = {
			title: "产品详情",
			content: "产品详情",
			redirectUrl: "javascript:void(0);"
		};
	}

	if(!data.securityUrl){
		data.securityUrl = {
			title: "安全保障",
			content: "安全保障",
			redirectUrl: "javascript:void(0);"
		};
	}

	if(!data.agreementUrl){
		data.agreementUrl = [];
	}

	return data;
};

//获取产品协议URL配置
model.prototype.getProtocolUrl = function () {
	var uri 	= this.getUrl();
	var array 	= uri.agreementUrl;

	for(var i = 0; i < array.length; i++){
		array[i].checked = true;
	}

	return array;
};

model.prototype.getData = function () {
	return this.data;
};

model.prototype.toYuan = function (amount) {
	return moneyCny.toYuan(amount);
};

module.exports = model;