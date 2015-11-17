var validate = require("validate");

var DETAULT_KEY = "_XN_DATA_";  //默认KEY
var REDPACKET_KEY = "_REDPACKET_KEY_"; //使用红包存储数据
var RECHARGE_KEY = "_RECHARGE_REDIRECT_"; //充值回跳的URL

var data = {

	STATE: {
		DETAULT_KEY: DETAULT_KEY,
		RECHARGE_KEY: RECHARGE_KEY,
		REDPACKET_KEY: REDPACKET_KEY
	},

	setData: function (key, data) {
		if(typeof(data) != "string"){
			window.sessionStorage.setItem(key || DETAULT_KEY, JSON.stringify(data));

			return;
		}

		window.sessionStorage.setItem(key || DETAULT_KEY, data);
	},

	getData: function (key) {
		var data  = window.sessionStorage.getItem(key || DETAULT_KEY);

		try{
			return JSON.parse(data) || {};
		}
		catch(e){
			return data;
		}
	},

	clear: function (key) {
		window.sessionStorage.removeItem(key || DETAULT_KEY);
	},
};

var xnData = function (options) {

	this.data 	= options.data;
	this.key 	= options.key || DETAULT_KEY;

	if(this.data){
		this.setData(this.data);
	}
};

xnData.prototype.set = function (key, value) {
	if(key === undefined){
		return;
	}

	var data = this.getData() || {};

	data[key] = value;

	this.setData(data);
};

xnData.prototype.get = function (key) {
	var data = this.getData();

	if(key === undefined){
		return data;
	}

	return data[key];
};

xnData.prototype.remove = function (key) {
	var data = this.getData();

	if(key === undefined){
		return;
	}

	delete data[key];

	this.setData(data);
};

xnData.prototype.setData = function (data) {
	if(data === undefined){
		return;
	}

	if(typeof(data) != "string"){
		window.localStorage.setItem(this.key || DETAULT_KEY, JSON.stringify(data));

		return;
	}

	window.localStorage.setItem(this.key || DETAULT_KEY, data);
};

xnData.prototype.getData = function () {
	var data  = window.localStorage.getItem(this.key || DETAULT_KEY);

	try{
		return JSON.parse(data) || {};
	}
	catch(e){
		return data;
	}
};

xnData.prototype.clear = function () {
	window.localStorage.removeItem(this.key || DETAULT_KEY);
};

module.exports = {
	
	STATE: {
		DETAULT_KEY: DETAULT_KEY,
		RECHARGE_KEY: RECHARGE_KEY,
		REDPACKET_KEY: REDPACKET_KEY
	},

	create: function (options) {
		return new xnData(options || {});
	}
};