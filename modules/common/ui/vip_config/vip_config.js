var user 		= require("kit/user");
var validate	= require("kit/validate");

var VIP_ICO = {
	"0": __uri("vip-0.png"),
	"1": __uri("vip-1.png"),
	"2": __uri("vip-2.png"),
	"3": __uri("vip-3.png"),
	"4": __uri("vip-4.png"),
	"5": __uri("vip-5.png"),
};

var VIP_TEXT = {
	"1": "身份徽章",
	"2": "会员红包",
	"3": "专享活动",
	"4": "收益率加成"
};

var VIP_NAME = {
	"0": "普通用户",
	"1": "青铜会员",
	"2": "白银会员",
	"3": "黄金会员",
	"4": "铂金会员",
	"5": "黑金会员"
};
/**
 * key表示会员等级，value表示各个等级对应的特权(VIP_TEXT):true表示有该特权，false表示没有该特权
 */
var VIP_CONFIG = {
	"0": [false, false, false, false],
	"1": [true, false, false, false],
	"2": [true, true, true, false],
	"3": [true, true, true, true],
	"4": [true, true, true, true],
	"5": [true, true, true, true]
};

var VIP_DETAIL = {
	"0": "$root$/vip/grow.html",
	"1": "$root$/vip/badge.html",
	"2": "$root$/vip/hongbao.html",
	"3": "$root$/vip/activity.html",
	"4": "$root$/vip/income.html"
};

var vip = {
	getVipConfig: function (vipLevel) {
		return {
			vipIco: this.getVipIco(vipLevel),
			vipName: this.getVipName(vipLevel),
			vipPrivilege: this.getPrivilege(vipLevel),
			vipDetail: this.getVipDetail(vipLevel)
		};
	},

	getPrivilege: function (vipLevel) {
		var level 	= this.getVipLevel(vipLevel);

		if(validate.isEmpty(level)){
			return [];
		}

		var array 	= [];
		var config 	= VIP_CONFIG[level];

		for(var i = 0; i < config.length; i++){
			var index = i + 1;
			var obj = {};
			obj.vipName = VIP_TEXT[index];
			obj.isHave = config[i];
			obj.detail = VIP_DETAIL[index];
			array.push(obj);
		}

		return array;
	},

	getVipLevel: function (vipLevel) {
		if(validate.isEmpty(vipLevel)){
			return user.get("memberLevel");
		}

		return vipLevel; 
	},

	getVipName: function (vipLevel) {
		var level = this.getVipLevel(vipLevel);

		if(validate.isEmpty(level)){
			return "";
		}

		return VIP_NAME[level] || "";
	},

	getVipIco: function (vipLevel) {
		var level = this.getVipLevel(vipLevel);

		if(validate.isEmpty(level)){
			return "";
		}

		return VIP_ICO[level] || "";
	},

	getVipDetail : function(vipLevel){
		var level = this.getVipLevel(vipLevel);

		if(validate.isEmpty(vipLevel)){
			return "";
		}

		return VIP_DETAIL[vipLevel] || "";
	},

	getVipIcos : function(){

		return VIP_ICO;
	}

};

module.exports = vip;