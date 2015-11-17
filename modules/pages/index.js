
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var queryString 	= require("kit/query_string");
var getDefaultUri	= require("kit/default_uri");

var app = function () {
	var options = {};

	var url = "";
	var query = queryString();

	if(!query.code || query.code == ""){
		window.location.href = "$root$/user/login.html?" + $.param(query);

		return false;
	}

	options.data = {
		code: query.code || ""
	};

	options.success = function (e) {
		var result 	= e.data || {};

		if(result.isRelation){
			//保存用户登录信息
			user.setData(result);

			/*change 已关联跳转至产品首页*/
			window.location.href = getDefaultUri();

			return;
		}

		var param = {
			openid: result.openid,
			unionid: result.unionid,
			accessToken: result.accessToken
		};

		window.location.href = "$root$/user/login.html?" + $.param(param);		
	};

	options.error = function (e){
		var result 	= e.data || {};

		var param = {
			openid: result.openid,
			unionid: result.unionid,
			accessToken: result.accessToken
		};

		window.location.href = "$root$/user/login.html?" + $.param(param);
	};
		
	api.send(api.USER, "getUserRelation", options, this);
};

app();