
var regexp = require("regexp");


var validate = {
	isEmpty: function (value) {
		if(value == null || value == undefined  || value == "null"  || value == "undefined" || value.toString().trim().length <= 0){
			return true;
		}

		return false;
	},

	isEmail: function (value) {
		return regexp.isEmail(value);
	},

	isMobile: function (value) {
		return regexp.isMobile(value);
	},

	isNumber: function (value) {
		return regexp.isNumber(value);
	},

	isAlphanumeric: function (value) {
		return regexp.isAlphanumeric(value);
	},

	isChinese: function (value) {
		return regexp.isChinese(value);
	},

	isDate: function (value){
		return regexp.isDate(value);
	},

	minLength: function (value, minLength) {
		return (value.toString() || "").trim().length < minLength;
	}, 

	maxLength: function (value, maxLength){
		return (value.toString() || "").trim().length > maxLength;
	}
};

module.exports = validate;