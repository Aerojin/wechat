var $ 			 = require("zepto");
var validate 	 = require("kit/validate");
var productSuper = require("kit/product_super");

var model = productSuper.extend({
	//重写父类获取活动的方法	
	getActivityInfo: function () {
		var array 	= [];
		var data 	= this.data.promotionTexts || [];

		data.map(function(value, index){
			array.push({
				title: value
			});
		});

		return array;
	}
});

module.exports = model;