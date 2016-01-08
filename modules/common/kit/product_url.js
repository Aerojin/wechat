//1：天添牛，2：指数牛，3：活期宝 4:惠房宝 5: 信托一号, 6:bs2p, 101: 双11特供标, 102: 资管1号, 103: 闪赚宝, 502: 信托2号




var URL = {
	"0": {
		detailUrl: {
			text: "产品详情",
			value: "#"
		},
		securityUrl: {
			text: "安全保障",
			value: "#"
		},
		equityUrl: [{
			text: "产品协议",
			value: "#"
		}]
	},

	"1": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/ttn_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/ttn_secure.html"
		},
		equityUrl: [{
			text: "信用咨询与管理服务协议",
			value: "$root$/agreement/credit_manage.html"	
		},{
			text: "收益权转让协议",
			value: "$root$/agreement/ttn_equity_transfer.html"
		}]
	},

	"2": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/zsn_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/zsn_secure.html"
		},
		equityUrl: [{
			text: "信用咨询与管理服务协议",
			value: "$root$/agreement/credit_manage.html"	
		},{
			text: "收益权转让协议",
			value: "$root$/agreement/zsn_equity_transfer.html"
		}]
	},

	"3": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/hqb_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/hqb_secure.html"
		},
		equityUrl:  [{
			text: "活期宝投资协议",
			value: "$root$/agreement/hqb_invest.html"
		}]
	},

	"4": {
		detailUrl: {
			text: "产品详情",
			value: "#"
		},
		securityUrl: {
			text: "安全保障",
			value: "#"
		},
		equityUrl: [{
			text: "产品协议",
			value: "#"
		}]
	},

	"5": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/xt_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/xt_secure.html"
		},
		equityUrl:  [{
			text: "产品协议",
			value: "$root$/agreement/xt_agreement.html"
		}]
	},

	"6": {
		detailUrl: {
			text: "产品详情",
			value: "#"
		},
		securityUrl: {
			text: "安全保障",
			value: "#"
		},
		equityUrl: [{
			text: "产品协议(6S 16G)",
			value: "$root$/agreement/bs2p_product_01.html"
		},{
			text: "产品协议(6S 64G)",
			value: "$root$/agreement/bs2p_product_02.html"
		},{
			text: "产品协议(6SPLUS 16G)",
			value: "$root$/agreement/bs2p_product_03.html"
		},{
			text: "产品协议(6SPLUS 64G)",
			value: "$root$/agreement/bs2p_product_04.html"
		}]
	},

	"101": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/ttn_s11_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/ttn_secure.html"
		},
		equityUrl:  [{
			text: "信用咨询与管理服务协议",
			value: "$root$/agreement/credit_manage.html"	
		},{
			text: "收益权转让协议",
			value: "$root$/agreement/ttn_equity_transfer.html"
		}]
	},

	"102": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/zg1h_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/zg1h_secure.html"
		},
		equityUrl:  [{
			text: "产品协议",
			value: "$root$/agreement/zg1h_agreement.html"
		}]
	},

	"103": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/wyn_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/wyn_secure.html"
		},
		equityUrl:  [{
			text: "产品协议",
			value: "$root$/agreement/wyn_agreement.html"
		}]
	},


	"104": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/ttn_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/ttn_secure.html"
		},
		equityUrl: [{
			text: "信用咨询与管理服务协议",
			value: "$root$/agreement/credit_manage.html"	
		},{
			text: "收益权转让协议",
			value: "$root$/agreement/ttn_equity_transfer_v1.html"
		}]
	},

	"502": {
		detailUrl: {
			text: "产品详情",
			value: "$root$/agreement/xt2_product.html"
		},
		securityUrl: {
			text: "安全保障",
			value: "$root$/agreement/xt_secure.html"
		},
		equityUrl:  [{
			text: "产品协议",
			value: "$root$/agreement/xt2_agreement.html"
		}]
	}

};

module.exports = {
	get: function (typeValue) {
		if(URL[typeValue || "0"]){
			return URL[typeValue || "0"];	
		}

		return URL["0"];
	}
};