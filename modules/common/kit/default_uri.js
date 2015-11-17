module.exports = function (param) {
	var host = window.location.protocol + "//m.xiaoniuapp.com";

	if(window.location.host.indexOf("127.0.0.1") > -1){
		host = "";
	}

	if(param){
		return host + "$root$/index/index.html?" + $.param(param);
	}else{
		return host + "$root$/index/index.html";
	}	
};