var $ 			= require("zepto");
var user        = require("kit/user");
var extend 		= require("base/extend");
var webStatus	= require("web_status");
var versions	= require("base/versions");
var httpClient 	= require("base/http_client");

var userApi     = require("user");
var productApi  = require("product");
var accountApi  = require("account");
var activityApi = require("activity");
var sundryApi   = require("sundry");

var api = {
	call: function (api, data, options, context) {
		options = options || {};
       	var url = this.getUrl(api);
        var client = new httpClient({});
        var httpMethod = options.httpMethod || "post";

		client.onError = function () {
			if (options.error) {
                options.error.apply(context, arguments);
            } else {
                options.success.call(context, { responseData: null, status: arguments[0].status, responseText: arguments[0].responseText });
            }
		};

		client.onResponse = function (e) {
			var res  = $.parseJSON(e.responseText);
			var info = res.data || {};
            var datas = info.result == undefined ? info : info.result;
			var result = new webStatus({
                msg: res.msg,
                code: res.code,
                data: datas,
                status: e.status,
                context: context,
                isLoginRedirect: data.isLoginRedirect
            });

            if(result.success){
                if($.isFunction(options.success)){
                    options.success.call(context, result.toJSON());
                }
                return;
            }

            if($.isFunction(options.error)){
                options.error.call(context, result.toJSON());
            }
		};

        client.request({
            url: url,
            method: httpMethod,
            data: this.addVersion(data),
            onStateChange: options.onStateChange,
            timeout: 20000
        });
	},
	getUrl: function (api) {
        if(api.indexOf("http") > -1){
            return api;
        }
        
		return this.getHost() + api;
	},
	getHost: function () {
		if(window.location.host.indexOf("127.0.0.1") > -1){
         //   return "http://10.10.16.177:8081";
            return "http://m.xiaoniuapp.com";
        }
        
        return window.location.origin; 
	}
};

/*
    *获取版本号
    *@param {data} data 初始化参数集
*/
api.getVersion = function () {
	return "1.0.1";
};


/*
    *添加版本号， 公共函数
    *@param {data} data 初始化参数集        
*/
api.addVersion = function (data) {
    var newData = $.extend(data, {
        token: user.get("token") || "",
        userId: user.get("userId") || "",
        source: versions.getCurrentSource(),
        appVersion: this.getVersion()
    });

	return newData;
};	

/*
    *初始化API模块
*/
api.init = function () {
    this.USER       = userApi.moduleName;
    this.PRODUCT    = productApi.moduleName;
    this.ACCOUNT    = accountApi.moduleName;
    this.ACTIVITY   = activityApi.moduleName;
    this.SUNDRY     = sundryApi.moduleName;

    this._module = api.createModule();

    return this;
};

/*
    *创建API模块
*/
api.createModule = function () {
    var _module = {};

    _module[userApi.moduleName]     = userApi.api;    
    _module[productApi.moduleName]  = productApi.api;   
    _module[accountApi.moduleName]  = accountApi.api;
    _module[activityApi.moduleName] = activityApi.api;
    _module[sundryApi.moduleName]     = sundryApi.api;

    return _module;
};

/*
    *获取API模块对象
    *@param {String} moduleName  模块名称
    *@param {String} apiName     接口名称
    *@param {Object} data        接口接收数据
    *
*/
api.getModule = function (moduleName, apiName, data) {
    if(!this._module){
        this._module = this.createModule();
    }

    var _module  = this._module[moduleName];
    var fun      = _module[apiName];

    if(!_module){
        throw "{0}模块不存在".format(moduleName);
        return;
    }

    if(!fun){
        throw "{0}方法不存在".format(apiName);
        return;
    }

    return fun(data);
};

/*
    *请求发送接口
    *@param {String} moduleName     模块
    *@param {String} apiName        接口
    *@param {Object} options        数据
    *@param {Object} context        上下文
*/
api.send = function (moduleName, apiName, options, context){
    var data = options.data || {};
    var result = this.getModule(moduleName, apiName, data);
    
    this.call(result.requestUrl, result.requestBody, options, context);
};



module.exports = (function () {
    return api.init();
})();

