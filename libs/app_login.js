;(function (win, doc) {
	var query = function () {
		var url = location.search; //获取url中"?"符后的字串
		var obj = new Object();

		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
				str = str.split("&");

			for(var i = 0; i < str.length; i ++) {
			    obj[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
			}
		}
		return obj || {};
	};

	var isApp = function () {
		var renValue = false;
		var host = location.host;
		var array = ["mapp.xiaoniuapp.com", "testapp.xiaoniuapp.com", "mappx.xiaoniuapp.com"];

		for(var i = 0; i < array.length; i++){
			if(array[i].trim() == host){
				renValue = true;
				break;
			}
		}

		return renValue;
	}

	var isSetData = function (data) {
		if(data.token == null || data.token == undefined || data.token.toString().length == 0){
			return false;
		}

		if(data.userId == null || data.userId == undefined || data.userId.toString().length == 0){
			return false;
		}

		return true;
	};

	if(isApp()){
		var KEY  = "_XN_USERS_";
		var data = query();


		//alert("pathname:" + location.pathname +  "\n 数据:" + localStorage.getItem(KEY) );
		if(isSetData(data)){
			localStorage.setItem(KEY, JSON.stringify(data));
		}		
	}

})(window, document);