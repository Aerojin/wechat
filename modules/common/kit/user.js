
var validate = require("validate");

var KEY = "_XN_USERS_";

var user = {
	set: function (key, value) {
		var data = this.getData();

		if(!validate.isEmpty(value) && !validate.isEmpty(key)){
			data[key] = value;
		}

		this.setData(data);
	},
	remove: function (key) {
		var data = this.getData();

		if(data[key]){
			delete data[key];
		}

		this.setData(data);
	},

	setData: function (data) {
		if(typeof(data) != "string"){
			var value  = JSON.stringify(data);
			
			window.localStorage.setItem(KEY,value);
			
			//window.sessionStorage.setItem(KEY, JSON.stringify(data));
			return;
		}

		window.localStorage.setItem(KEY, data);
		//window.sessionStorage.setItem(KEY, data);
	},

	getData: function () {
		var strData = window.localStorage.getItem(KEY);

		if(strData == "undefined" || strData == "null" || validate.isEmpty(strData)){
			return {};
		}

		var data = JSON.parse(strData);
		//var data = JSON.parse(window.sessionStorage.getItem(KEY));
		
		return data || {};
	},

	get: function (key) {
		var strData = window.localStorage.getItem(KEY);

		if(strData == "undefined" || strData == "null" || validate.isEmpty(strData)){
			return "";
		}

		var data = JSON.parse(strData) || {};
		//var data = JSON.parse(window.sessionStorage.getItem(KEY)) || {};

		if(key === undefined){
			return data;
		}

		return data[key];
	},

	clear: function () {
		window.localStorage.removeItem(KEY);
		//window.sessionStorage.removeItem(KEY);
	},

	isLogin: function () {
		var isLogin = false;
		var data = this.getData();
		
		for(var key in data){
			isLogin = true;
			break;
		}

		return isLogin;
	}


};


module.exports = user;