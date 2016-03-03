/*
	产品的常量类
*/

module.exports = {
	/*
		浮动利率值
	*/
	FLOAT: 2,
	/*
		产品单位
	*/
	DATE_UNIT: {
		DAY: "天",
		MONTH: "月"
	},
	/*
		STATE 状态码
		0.正常
		100.未开始
		200.已结束
		300.已售完
		400.已满额
	*/
	STATE: {
		NORMAL: 0,
		NOT_START: 100,
		END: 200,
		SELL_OUT: 300,
		QUOTA_OUT: 400
	},
	/*
		STATE_TEXT 状态码对应的提示语
	*/
	STATE_TEXT: {
		0: "立即购买",
		100: "{0}月{1}日开抢",
		200: "已结束",
		300: "已售罄",
		400: "已满额"
	},
	/*
		BUY_TYPE 产品购买类型
		0.默认
		100.按份购买
		200.活期宝
		300.月息宝
	*/
	BUY_TYPE: {
		DEFAULT: 0,
		PORTION: 100,
		HQB: 200,
		YXB: 300
	},
	/*
		PARENT_TYPE 产品大类
		1.固定
		2.浮动
		3.活期
		利用接口的值做映射, key所对应的是接口的值, value是转换后的值
	*/
	PARENT_TYPE: {
		1: 100,
		2: 200,
		3: 300
	},
	/*
		PRODUCT_TYPE 产品类型	
		1101.天添牛
		1201.信托
		1301.闪赚宝
		1401.BS2P
		1501.月息宝
		2101.指数牛
		3101.活期宝
	*/
	PRODUCT_TYPE: {
		TTN: 1101,
		XT: 1201,
		SZB: 1301,
		BS2P: 1401,
		YXB: 1501,
		ZHN: 2101,
		HQB: 3101
	}
};