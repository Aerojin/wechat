/*
	计算产品利率
*/
var views = function (options) {

	var _this 	= this;
	var _day 	= Number(options.day || 0);  		//产品周期(以天为单位);
	var _total	= Number(options.total || 360); 	//产品总周期(默认360天);

	/*
		利率计算规则
		(产品周期 * 产品利率 * 投资金额) / 产品总周期 / 100(百分比)
		js计算小数时存在精度丢失问题, 所以底层实现了一套加减乘除的方法,用于解决计算过程中精度丢失的问题
		加法: plus
		减法: sub
		乘法: mul
		除法: div
	*/
	this.getRate = function (rate, money) {
		if(rate === undefined || money === undefined){
			return 0;
		}

		var tmp 	= _day.mul(Number(rate)).mul(Number(money));
		var result  = tmp.div(_total).div(100);

		return result;
	};

};

module.exports = {
	create: function (options) {
		return new views(options || {});
	}
};