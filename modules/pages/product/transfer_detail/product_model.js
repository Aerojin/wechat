var $ 			 = require("zepto");
var productSuper = require("kit/product_super");

//继承父类公有属性, 方法
var model = productSuper.extend({
	//重写父类获取活动的方法	
	getActivityInfo: function () {
		return this.filterActivity(this.data.productAds || []);
	}
});

module.exports = model;