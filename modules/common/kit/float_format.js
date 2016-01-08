module.exports = {
	toFixed: function (value, len) {
		var length  = len === undefined ? 2 : len;
		var str 	= value === undefined ? "" : value.toString().trim();
		var index 	= str.indexOf(".");

		if(index == -1){
			return str;
		}

		var num = str.substring(0, index)
		var tmp = str.substring(index + 1);

		if(tmp.length < len){
			return str;
		}

		if(len == 0){
			return num;
		}

		return num + "." + tmp.substring(0, len);	
	}
};