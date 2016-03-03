var $ 			 = require("zepto");
var validate 	 = require("kit/validate");
var productSuper = require("kit/product_super");

var model = productSuper.extend({
	//重写父类获取活动的方法	
	getActivityInfo: function () {
		var array 	= [];
		var data 	= this.data.addAwardNames || [];

		if(data.length > 0){
			array.push({
				title: data[0]
			});
		}

		return array;
	}
});

module.exports = model;