var $ 			 = require("zepto");
var moneyCny 	 = require("kit/money_cny");
var productSuper = require("kit/product_super");

var model = productSuper.extend({
	//获取各种利率
	getEarnings: function (money) {
		var earnings = this.getRate(this.data.finalRate, money);

		if(window.isNaN(earnings)){
			return 0;
		}

		return {
			result: moneyCny.toDecimal(earnings, 2)
		};
	},
	//获取总收益
	getTotalEarnings: function (money) {
		return this.getEarnings(money).result;	
	},

	//根据金额,利率计算出利息
	getRate: function (rate, amount) {
		return this.productRate.getRate(rate, amount);
	},
	//获取用户账户余额
	getAbleBalance: function () {
		return this.data.balance;
	},
	//set协议
	setProtocol: function (index) {
		var obj = this.data.protocolUri[index];
			obj.checked = !obj.checked;

		this.data.protocolUri[index] = obj;

		this.onPotocolChange(index, obj.checked);
	},
	//获取是否全部勾选协议
	getProtocolChecked: function () {
		var checked = true;
		var array   = this.data.protocolUri;

		for(var i = 0; i < array.length; i++){
			if(!array[i].checked){
				checked = false;
				break;
			}
		}

		return checked;
	},
	set: function (key, value) {
		this.data[key] = value;
	},
	get: function (key) {
		return this.data[key];
	},
	onPotocolChange: function () {

	}
});

module.exports = model;