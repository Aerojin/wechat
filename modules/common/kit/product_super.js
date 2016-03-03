/*
	activity 活动
	vip 会员
	tag 标签
	hot 热点标签
	progress 进度条
	type 产品类型

	"productType": 1,//产品类型 1固定,2浮动,3活期
                "parentProductType

*/
var $ 				= require("zepto");
var user 			= require("user");
var validate 		= require("validate");
var moneyCny		= require("money_cny");
var serverTime 		= require("server_time");
var productRate  	= require("product_rate");
var PRODUCT_CONST 	= require("product_const");


var model = function (data) {
	this._data 	= data || {}; 						//私有数据, 供内部使用
	this.data 	= $.extend(true, {}, data);			//公有数据, 对外使用
	this.init();	
};

model.prototype.init = function () {
	var result = {};

	result.fid 			= this._data.fid;											//产品FID
	result.minRate 		= this._data.minRate || "0.0";								//产品最小利率
	result.maxRate 		= this._data.maxRate || "0.0";								//产品最大利率
	result.productType 	= this._data.productType;
	result.remainMoney 	= moneyCny.toYuan(this.getRemaMoney(), 2);					//产品剩余额度(带小数位)
	result.remainAmount = moneyCny.toYuan(this.getRemaMoney(), 0);					//产品剩余额度

	result.isNewUserMark	= this._data.newUserMark == 2; 							//是否是新手标
	result.isFloat 			= Number(this._data.isFloat) == PRODUCT_CONST.FLOAT;	//是否是浮动产品
	result.extension 		= this._data.extension || {};							//扩展字段
	result.balance 			= moneyCny.toFixed(this._data.ableBalance, 2);			//账户余额	
	result.strStartDate 	= this.formatDate(this._data.profitCalcDate);			//起息日
	result.strEndDate 		= this.formatDate(this._data.refundDate);				//到期日
	result.unitPrice 		= moneyCny.toYuan(this._data.unitPrice);				//按份卖的产品,每份多少钱
	result.userRemaMoney	= moneyCny.toYuan(this._data.userRemainAmount, 0); 		//用户剩余可购买额度
	result.remainAmountUnit	= moneyCny.toUnit(this.getRemaMoney(), 0);				//产品剩余额度(带单位)
	result.userInvestUnit 	= moneyCny.toUnit(this._data.userInvestLimit);			//用户购买产品的最大额度(带单位)
	result.userInvestLimit	= moneyCny.toYuan(this._data.userInvestLimit)			//用户购买产品的最大额度(原始值)
	result.minInvestLimit 	= moneyCny.toYuan(this._data.minInvestLimit);			//产品最小购买金额
	result.maxInvestLimit 	= moneyCny.toYuan(this._data.maxInvestLimit);			//产品最大购买金额
	result.salesAmount 		= moneyCny.toYuan(this._data.salesAmount);				//产品销售总额
	result.amount			= moneyCny.toYuan(this._data.amount);					//产品总额度

	result.token 		= user.get("token");				//用户tonke
	result.userId 		= user.get("userId");				//用户ID
	result.dateUnit 	= this.getDateUnit();				//产品单位
	result.isLogin 		= user.isLogin();					//用户是否登录	
	result.percentInfo 	= this.getPercentInfo();			//产品销售百分比信息
	result.hotInfo 		= this.getHotInfo();				//产品标签信息
	result.vipInfo 		= this.getVipInfo();				//产品会员信息
	result.activityInfo	= this.getActivityInfo();			//产品活动信息
	result.parentType 	= this.getParentType();				//产品父类型
	result.state 		= this.getState();					//当前产品状态
	result.stateText 	= this.getStateText();				//状态对应显示的文本
	result.buyType 		= this.getBuyType();				//购买类型
	result.isUserLimit 	= this.isUserLimit();				//是否限制用户购买额度
	result.uri 			= this.getUrl();					//产品URL信息
	result.protocolUri 	= this.getProtocolUrl();			//协议URL信息
	result.isTransfer 	= this.isTransfer();				//产品是否可以转让
	result.isTransferProduct = this.isTransferProduct(); 	//是否是转让产品

	this.data = $.extend(this.data, result);

	//初始化利率计算器
	this.productRate = productRate.create({
		day: this._data.investPeriod
	});
};

//vip信息
model.prototype.getVipInfo = function () {
	var info = {}; 
	var data = this._data.memberAwardRate;	

	info.isVip 			= !!data;							//当前用户是否是VIP
	info.isVipProduct 	= !!this._data.memberAwardFlag;		//是否是VIP产品

	if(info.isVip){
		info.awardName		= data.awardName;					//加息配置名
		info.awardRate 		= data.awardRate; 					//加息利率
		info.startTime 		= data.startTime; 					//起始时间
		info.endTime 		= data.endTime; 					//结束时间
		info.remark 		= data.remark;						//备注
	}

	return info;
};

//产品类型
model.prototype.getParentType = function () {
	var key = this._data.parentProductType;

	return PRODUCT_CONST.PARENT_TYPE[key];
};

//获取产品状态
model.prototype.getState = function () {
	if(this.isSellOut()){
		return PRODUCT_CONST.STATE.SELL_OUT;
	}

	if(this.isQuotaOut()){
		return PRODUCT_CONST.STATE.QUOTA_OUT;
	}

	if(this.isProductDate() && !this.getProductRule().isStart){
		return PRODUCT_CONST.STATE.NOT_START;
	}

	if(this.isProductDate() && this.getProductRule().isEnd){
		return PRODUCT_CONST.STATE.END;
	}

	return PRODUCT_CONST.STATE.NORMAL;
};

//获取对应状态的文本
model.prototype.getStateText = function () {
	var state = this.getState();

	//未开始, 提示则需要特殊处理
	if(state == PRODUCT_CONST.STATE.NOT_START){
		return this.getStartText();
	}

	return PRODUCT_CONST.STATE_TEXT[state];
};

//获取未开始状态文本
model.prototype.getStartText = function () {
	var now 	= serverTime.getServerTime();		//当前时间	
	var start 	= this.getProductRule().startDate;	//开始时间
	var day 	= 24 * 60 * 60 * 1000; 				//一天时间的毫秒数
	var diff 	= start.getTime() - now.getTime();	//开始时间和当前时间的时间差

	//时间差小于24小时, 则需要判断是否是当天, 如果是当天则返回几点开抢的提示, 否则返回几月几号开抢提示
	if(diff > 0 && diff < day && now.getDate() == start.getDate()){
		return "{0}开抢".format(start.format("hh:mm"));
	}

	var month = start.getMonth() + 1;
	var day   = start.getDate();

	return  PRODUCT_CONST.STATE_TEXT[this.getState()].format(month, day)
};


//获取产品单位
model.prototype.getDateUnit = function () {
	return PRODUCT_CONST.DATE_UNIT.DAY;
};

//判断产品是否售完
model.prototype.isSellOut = function () {
	var remaMoney 	= this._data.remainAmount;			//产品剩余额度
	var minMoney 	= this._data.minInvestLimit;		//产品最小购买额度	

	if(this.isProductLimit()){
		return remaMoney < minMoney;
	}

 	return false;
};

//产品是否设置额度
model.prototype.isProductLimit = function () {
	if(Number(this._data.amount) == 0){
		return false;
	}

	return true;
};

//产品是否限制用户购买额度
model.prototype.isUserLimit = function () {
	if(Number(this._data.userInvestLimit) == 0 || this.isTransferProduct()){
		return false;
	}

	return true;
};

//获取产品额度百分比
model.prototype.getPercentInfo = function () {
	var extension 	= this._data.extension || {};
	var remain 		= Number(this._data.remainAmount || 0); //产品剩余额度
	var amount		= Number(this._data.amount || 0);		//产品总额
	var sales 		= amount - remain; 						//已销售总额
	var percent 	= (sales / amount) * 100;

	if(percent > 0 && percent < 1){
		percent = 1;
	}

	if(this.isSellOut()){
		percent = 100;
	}

	if(window.isNaN(percent) || sales == 0 || amount == 0){
		percent = 0;
	}

	return {
		isShow: !!extension.show_progress,
		value:  Math.floor(percent) + "%" 
	}
};

//获取产品剩余可购买额度
model.prototype.getRemaMoney = function () {
	if(this._data.remainAmount < this._data.minInvestLimit) {
		return 0;
	}

	return this._data.remainAmount;
};

//个人额度是否用完
model.prototype.isQuotaOut = function () {
	if(this.isUserLimit()){
		return (this._data.userRemainAmount || 0) <= 0;		
	}

	return false;
};

//产品是否有购买时间限制
model.prototype.isProductDate = function () {
	if(validate.isEmpty(this._data.startTime) || validate.isEmpty(this._data.endTime)){
		return false;
	}

	return true;
};

//获取产品购买时间限制信息
model.prototype.getProductRule = function () {
	var obj 	= {};	
	var start 	= this._data.startTime;
	var end 	= this._data.endTime;

	if(!validate.isEmpty(start) && !validate.isEmpty(end)){
		obj.endDate	 = end.parseDate();
		obj.startDate = start.parseDate();
		obj.result   = serverTime.getDateActivity(start, end);

		return {
			endData: obj.endDate,
			startDate: obj.startDate,
			isEnd: obj.result.isEnd,
			isStart: obj.result.isStart
		};
	}

	return {
		endData: null,
		startDate: null,
		isEnd: false,
		isStart: true
	}
};

//获取热点标签信息
model.prototype.getHotInfo = function () {
	var extension 	= this._data.extension || {};

	return {
		isShow: !validate.isEmpty(extension.hot_product),
		value: extension.hot_product || ""
	};
};

//获取产品购买类型
model.prototype.getBuyType = function () {
	if(this._data.productType == PRODUCT_CONST.PRODUCT_TYPE.HQB){
		return PRODUCT_CONST.BUY_TYPE.HQB;
	}

	if(this._data.productType == PRODUCT_CONST.PRODUCT_TYPE.YXB){
		return PRODUCT_CONST.BUY_TYPE.YXB;
	}

	if(Number(this._data.unitPrice) > 0){
		return PRODUCT_CONST.BUY_TYPE.PORTION;
	}

	return PRODUCT_CONST.BUY_TYPE.DEFAULT;
};


//获取活动信息
model.prototype.getActivityInfo = function () {
	return [];
};

//判断活动是否在有效期内
model.prototype.isValid = function (data) {
	//会员产品活动过滤条件
	if(data.adType == 2){
		var vipInfo = this.getVipInfo();

		return vipInfo.isVipProduct && !vipInfo.isVip;
	}

	return true;

	/*
	if(!data.startTime || !data.endTime){
		return true;
	}
	
	var start 	= data.startTime;
	var end   	= data.endTime;
	var result 	= serverTime.getDateActivity(start, end);

	if(result.result){
		return true;
	}

	return false;
	*/
};

//过滤未开始和已经结束的活动
model.prototype.filterActivity = function (data) {
	if(!data){
		return [];
	}

	var _this 	= this;
	var array 	= [];
	var userId 	= user.get("userId");
	var token 	= user.get("token");
	var mobile 	= user.get("loginName");
	var param 	= "?userId={0}&token={1}&loginName={2}".format(userId, token, mobile);

	data.map(function (value, index) {

		if(validate.isEmpty(value.redirectUrl)){
			value.isGoto 	= false;
			value.url 		= "javascript:void(0);";
		}else{
			value.isGoto 	= true;
			value.url  		= value.redirectUrl + param;
		}


		if(_this.isValid(value)){
			array.push(value);
		}	
	});

	return array;
};

//获取产品各种URL配置
model.prototype.getUrl = function () {
	var info = {};
	var data = this._data.featureRlt || [];

	data.map(function (value, index) {
		var obj = {
			title: value.featureName,
			url: value.featureValue
		};

		switch(value.featureType) {
			case 1:
				info.detailInfo = obj;
				break;
			case 2:
				info.securityInfo = obj;
				break;
		}
	});

	if(!info.detailInfo){
		info.detailInfo = {
			title: "产品详情",
			desc: "产品详情",
			url: "javascript:void(0);"
		};
	}

	if(!info.securityInfo){
		info.securityInfo = {
			title: "安全保障",
			desc: "安全保障",
			url: "javascript:void(0);"
		};
	}

	return info;
};

//获取产品协议URL配置
model.prototype.getProtocolUrl = function () {
	var array 	= [];
	var data 	= this._data.featureRlt || [];
	var investPeriod = this._data.investPeriod || "";
	
	data.map(function (value, index) {
		value.url 	= value.featureValue + "?deadLineValue=" + investPeriod;
		value.title = value.featureName;

		if(value.parentFeatureType == 3){
			value.checked = true;
			array.push(value);
		}
	});

	return array;
};

model.prototype.getData = function () {
	return this.data;
};

//判断是否是活期宝
model.prototype.isHqb = function () {
	return this._data.productType == PRODUCT_CONST.PRODUCT_TYPE.HQB;
};

//当前产品是否可以转让(显示转让标签)
model.prototype.isTransfer = function () {
	return this._data.isTransfer == 2 && this._data.investPeriod >= 60;
};

//是否是转让过的产品
model.prototype.isTransferProduct = function () {
	return this._data.investType == 2;
};

model.prototype.toYuan = function (amount) {
	return moneyCny.toYuan(amount);
};

model.prototype.formatDate = function (date) {
	if(!date){
		return "";
	}

	if(typeof(date) == "string"){
		date = date.parseDate();
	}

	return date.format("yyyy-MM-dd");
};



module.exports = {
	extend: function (child) {
		$.extend(model.prototype, child);

		return model;
	},
	create: function (options) {
		return new model(options);
	}
};