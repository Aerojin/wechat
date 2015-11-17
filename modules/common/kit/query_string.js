module.exports = function (search) {
	var url = search || location.search; //获取url中"?"符后的字串
	var str = url;
	var theRequest = new Object();

	if (url.indexOf("?") != -1) {
		str = url.substr(1);
	}

	if(str.length > 0){
		str = str.split("&");

		for(var i = 0; i < str.length; i ++) {
		    theRequest[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
		}
	}
	
	return theRequest || {};
};