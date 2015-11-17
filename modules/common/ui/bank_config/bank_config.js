var validate	= require("kit/validate");

var BANK_ICO = {
	"abc":   __uri("bank_abc.png"),
	"bcom":  __uri("bank_bcom.png"),
	"boc":   __uri("bank_boc.png"),
	"ccb":   __uri("bank_ccb.png"),
	"ceb":   __uri("bank_ceb.png"),
	"cib":   __uri("bank_cib.png"),
	"citic": __uri("bank_citic.png"),
	"cmb":   __uri("bank_cmb.png"),
	"cmbc":  __uri("bank_cmbc.png"),
	"gdb":   __uri("bank_gdb.png"),
	"hxb":   __uri("bank_hxb.png"),
	"icbc":  __uri("bank_icbc.png"),
	"pab":   __uri("bank_pab.png"),
	"post":  __uri("bank_post.png"),
	"spdb":  __uri("bank_spdb.png")
};

var bank = {
	getBankIco : function(key){
		if(validate.isEmpty(key)){
			return "";
		}
		return BANK_ICO[key] || "";
	},
	getCardText : function(card){
		if(validate.isEmpty(card) || !validate.isNumber(card)){
			return "";
		}
		var weihao = card.match(/\d{4}$/g).join("");
		return "尾号" + weihao;
	}
};

module.exports = bank;