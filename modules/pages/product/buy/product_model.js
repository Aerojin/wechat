var $ 			 = require("zepto");
var productSuper = require("kit/product_super");

var model =  function (data) {
	this.data = data;
	this.init();
};

//继承父类公有属性, 方法
model.prototype = new productSuper();

//重写父类获取活动的方法
model.prototype.getActivityInfo = function () {
	var vipInfo 		 = this.data.vipInfo;
	var auxiliaryInfo 	 = this.data.auxiliaryInfo || {};
	var activitys 		 = auxiliaryInfo["activitys"] || [];
	var memberAddProfits = auxiliaryInfo.memberAddProfits;

	//会员产品特殊处理
	if(vipInfo.isVipProduct && !vipInfo.isVip && memberAddProfits){
		memberAddProfits.isVip = true;
		activitys.push(memberAddProfits);
	}

	return this.filterActivity(activitys || []);
};

module.exports = model;