//1：天添牛，2：指数牛，3：活期宝 4:惠房宝 5: 信托一号, 6:bs2p

var URL = {
	"0": {
		detailUrl: "",
		securityUrl: "",
		equityUrl: ""
	},

	"1": {
		detailUrl: "$root$/agreement/ttn_product.html",
		securityUrl: "$root$/agreement/ttn_secure.html",
		equityUrl: "$root$/agreement/ttn_equity_transfer.html"
	},

	"2": {
		detailUrl: "$root$/agreement/zsn_product.html",
		securityUrl: "$root$/agreement/zsn_secure.html",
		equityUrl: "$root$/agreement/zsn_equity_transfer.html"
	},

	"3": {
		detailUrl: "$root$/agreement/hqb_product.html",
		securityUrl: "$root$/agreement/hqb_secure.html",
		equityUrl: "$root$/agreement/ttn_equity_transfer.html"
	},

	"4": {
		detailUrl: "",
		securityUrl: "",
		equityUrl: ""
	},

	"5": {
		detailUrl: "$root$/agreement/xt_product.html",
		securityUrl: "$root$/agreement/xt_secure.html",
		equityUrl: "$root$/agreement/xt_agreement.html"
	},

	"6": {
		detailUrl: "",
		securityUrl: "",
		equityUrl: ""
	},

	"101": {
		detailUrl: "$root$/agreement/ttn_s11_product.html",
		securityUrl: "$root$/agreement/ttn_secure.html",
		equityUrl: "$root$/agreement/ttn_equity_transfer.html"
	},

	"102": {
		detailUrl: "$root$/agreement/zg1h_product.html",
		securityUrl: "$root$/agreement/zg1h_secure.html",
		equityUrl: "$root$/agreement/zg1h_agreement.html"
	},

	"103": {
		detailUrl: "$root$/agreement/wyn_product.html",
		securityUrl: "$root$/agreement/wyn_secure.html",
		equityUrl: "$root$/agreement/wyn_agreement.html"
	},

	"502": {
		detailUrl: "$root$/agreement/xt2_product.html",
		securityUrl: "$root$/agreement/xt_secure.html",
		equityUrl: "$root$/agreement/xt2_agreement.html"
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