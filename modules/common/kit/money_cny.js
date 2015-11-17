var validate = require("validate");

module.exports = {
	toYuan: function (amount, decimal) {
		amount  = Number(amount).div(10000);

		if(decimal === undefined){
			decimal = 2;
		}

		if(window.isNaN(amount)){
			return 0;
		}

		return this.toDecimal(amount, decimal);
	},

	toHao: function (amount) {
		amount  = Number(amount).mul(10000);

		if(window.isNaN(amount)){
			return 0;
		}

		return amount;
	},

	toUnit: function (amount) {
		amount = Number(this.toYuan(amount));

		if(amount >= 1000 && amount < 10000){
			return  amount.div(1000) + "千";
		}

		if(amount >= 10000 && amount < 100000000){
			return amount.div(10000) + "万";
		}

		if(amount >= 100000000){
			return amount.div(100000000) + "亿";
		}
	},

	toFixed: function (amount, len) {
		var zero = "0000";

		var yuan = Math.floor(Number(amount).div(10000));
		var hao = amount % 10000;
		if (len === undefined) len = 2;
		if (len > 4) len = 4;
		if (len < 0) len = 0;

		if (len == 0) return "" + yuan;
		var tmp = zero + hao;
		return yuan + "." + tmp.substring(tmp.length - 4, tmp.length - 4 + len);

	},

	toDecimal: function (amount, len) {
		var length 		= len === undefined ? 2 : len;
		var decimal 	= this.getCoefficient(len);
		var	money 		= Math.floor(amount.mul(decimal)).div(decimal);

		return Number(money);
	},

	toDecimalStr: function (number, len) {
		number = number === undefined ? 0 : number;
		
		if (len === undefined) len = 2;
		if (len > 4) len = 4;
		if (len < 0) len = 0;

		var str = number.toString();
			str += str.indexOf(".") > - 1 ? "0000" : ".0000";
			
		var index = str.indexOf(".");

		if(len == 0){
			return str.substring(0, index);
		}
		
		return str.substring(0, index + len + 1);
	},

	getCoefficient: function (len) {
		return Number(1 + this.getZero(len));
	},

	getZero: function (len) {
		var array = [];

		for(var i = 0 ; i < len ; i++){
			array.push("0");
		}

		return array.join("");
	}
};