var validate = require("validate");

module.exports = function (mobile) {
	if(validate.isEmpty(mobile)){
		return "";
	}

	var start = 3;
	var end = 7;

	var strStart = mobile.substring(0, start);
	var strEnd 	 = mobile.substring(end);

	return strStart + "****" + strEnd;
};