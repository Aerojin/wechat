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
	var array = [];

	if(this.data.awardRateFlag == 1){
		array.push({
			text: this.data.addAwardNames || ""
		});
	}
	
	return array;
};

module.exports = model;