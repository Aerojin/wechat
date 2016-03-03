var $ 			 = require("zepto");
var moneyCny 	 = require("kit/money_cny");
var productSuper = require("kit/product_super");

var model = productSuper.extend({
	//重写父类获取活动的方法	
	getActivityInfo: function () {
		var array = this.data.awardRates || [];

		return this.filterActivity(array);
	},
	//判断是否需要显示加息按钮
	isShowEarnings: function () {
		return this.data.vipInfo.isVip || this.data.activityInfo.length > 0;
	},
	//获取各种利率
	getEarnings: function (money) {
		var totalRate = this.getTotalRate(); //产品总利率

		//总收益
		var total 	= moneyCny.toDecimal(this.getRate(totalRate, money), 2);

		//会员收益加成
		var addition = moneyCny.toDecimal(this.getRate(this.data.vipInfo.awardRate, money), 2);

		//活动收益
		var awardRate = this.getAwardRate(money);
	
		//产品收益		
		var earnings = total.sub(addition).sub(awardRate.total);

		if(window.isNaN(earnings)){
			return 0;
		}

		return {
			earnings: moneyCny.toDecimalStr(earnings, 2),
			vipEarnings: moneyCny.toDecimalStr(addition, 2),
			awardRate: awardRate.data,
			isVip: this.data.vipInfo.isVip,
			result: moneyCny.toDecimalStr(total, 2)
		};
	},
	//获取总收益
	getTotalEarnings: function (money) {
		return this.getEarnings(money).result;	
	},
	//获取活动利率
	getAwardRate: function (money) {
		var array = [];
		var total = 0;
		var data  = this.data.activityInfo || [];

		for(var i = 0; i < data.length; i++){
			var rate = this.getRate(data[i].awardRate, money);

			total = total.plus(rate);

			array.push({
				value: moneyCny.toDecimalStr(rate, 2),
				text: data[i].awardName				
			});
		}

		total = Math.floor(total.mul(100));
		total = total.div(100);

		return {
			data: array,
			total: moneyCny.toDecimal(total, 2)
		};
	},

	//获取当前产品总利率(活动, 会员, 产品本身)
	getTotalRate: function () {
		var activity  = 0;
 		var array 	  = this.data.activityInfo || []; 		//活动利率
		var finalRate = this.data.finalRate || 0; 			//产品利率
		var awardRate = this.data.vipInfo.awardRate || 0;	//会员利率

		array.map(function (value, index) {
			activity = activity.plus(value.awardRate);
		});

		return finalRate.plus(activity).plus(awardRate);
	},

	//根据金额,利率计算出利息
	getRate: function (rates, amount) {
		return this.productRate.getRate(rates, amount);
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
	getData: function () {
		if(!this.data.isShowEarnings){
			this.data.isShowEarnings = this.isShowEarnings();
		}

		return this.data;
	},
	onPotocolChange: function () {

	}
});

module.exports = model;