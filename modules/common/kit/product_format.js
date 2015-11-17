var $ 			= require("zepto");
var moneyCny 	= require("money_cny");
var agreement	= require("agreement_url");

var TIPS = {
	DAY: "天",
	MONTH: "月"
};

module.exports = {
	format: function (data) {
		var result  = {};
		var url 	= agreement.get(data.typeValue);
		var vipInfo = data.memberAwardRate || {};

 		result.fid 				= data.fid;
 		result.isFlow			= Number(data.isFlow);
 		result.isFixed			= result.isFlow == 1;
 		result.typeValue 		= Number(data.typeValue);
 		result.deadLineValue 	= data.deadLineValue;
 		result.dateUnit 		= this.getDateUnit(data);
 		result.percent 			= this.getPercent(data);
 		result.vipRate 			= vipInfo.awardRate || 0;
 		result.isSellOut 		= this.getSellOut(data);
 		result.isVip 			= !!Number(vipInfo.menberLevel);
 		result.isVipProduct 	= !!data.memberAwardFlag;
 		result.isQuota 			= this.getIsQuota(data);

 		result.detailUrl 		= url.detailUrl;
		result.securityUrl 		= url.securityUrl;
		result.equityUrl		= url.equityUrl;

 		return $.extend(data, result);
	},

	//判断产品是否售完
	getSellOut: function (data) {
		var buyTotal 	= moneyCny.toYuan(data.buyTotalMoney);
 		var buyedTotal  = moneyCny.toYuan(data.buyedTotalMoney);
 		var result 		= buyTotal - buyedTotal;

 		if(data.isBuyMoney || data.isBuyMoney === undefined){
	 		return data.status != 2 || result < 100;
	 	}

	 	return false;
 	},

 	//获取产品单位
 	getDateUnit: function (data) {
 		if(Number(data.deadLineType) == 1){
 			return TIPS.DAY;
 		}

 		return TIPS.MONTH;
 	},

	//产品销售百分比
 	getPercent: function (data) {
 		var buyTotal 	= Number(data.buyTotalMoney || 0);
 		var buyedTotal 	= Number(data.buyedTotalMoney || 0);
 		var percent 	= (buyedTotal / buyTotal) * 100;

 		if(percent > 0 && percent < 1){
 			percent = 1;
 		}
		
		if(this.getSellOut(data)){
 			percent = 100;
 		}

 		return Math.floor(percent) + "%";
 	},

 	//是否显示销售额度(产品是否限额)
 	getIsQuota: function (data) {
 		if(data.cBuyMaxMoney <= 0){
 			return false;
 		}

 		return true;
 	}
};