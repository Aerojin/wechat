var regexp = {
	isMobile: function (str) {
		var re = /^1\d{10}$/;

		return re.test(str);
	},
	isEmail: function (str) {
		var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

		return re.test(str);
	},
	isNumber: function (str) {
		var re = /^\d+$/;

		return re.test(str);
	},
	isAlphanumeric: function (str) {
		var re = /\w*/;

		return re.test(str);
	},
	isChinese: function (str) {
		var re = /^[\u4e00-\u9fa5]{0,}$/;

		return re.test(str);
	},
	isDate : function(str){
		var re = /^((?!0000)\d{4}[-/\s{1}](0[1-9]|1[0-2])[-/\s{1}]([0][1-9]|[12]\d|3[01])((\s{1})([01]\d|2[0-3])(:[0-5]\d){1,2}(.\d{3})?)?)$/;//yyyy-MM-dd hh:mm:ss.nnn 24小时制,n为毫秒

		return re.test(str);
	}
};

module.exports = regexp;

