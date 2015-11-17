var user 		 = require("kit/user");
var appApi 		 = require("kit/app_api");
var eventFactory = require("base/event_factory");

var MSG = {
	10000: "系统繁忙，请稍候再试。"
};

/*
	*isLoginRedirect 如果设置, 接口在未登录的情况下就不跳转, 默认会跳转
*/
var webStatus = function (options) {
	options.code = options.code === undefined ? 0 : options.code;

	this.code 				= options.code;
	this.data 				= options.data;
	this.status 			= options.status || 0;
	this.context 			= options.context || window;
	this.isLoginRedirect 	= !options.isLoginRedirect
	this.msg 				= this.getMsgByCode(options);
	this.success 			= this.code == 0;
};

webStatus.prototype.constructor = webStatus;

webStatus.prototype.toJSON = function(){		
	var json = {
		code : this.code,
		msg: this.msg,
		data: this.data,
		status: this.status,
		success: this.success			
	};

	return json;
};

webStatus.prototype.getMsgByCode = function(data) {
	switch(data.code){
        case 999:{
        	user.clear();
        	
        	if(this.isLoginRedirect){
				eventFactory.exec({
					wap: function () {
						window.location.href = "$root$/user/login.html";
					},
					app: function () {
						window.location.href = appApi.getLogin();
					}
				});
	        }
            break;
        }       
	}

	return data.msg || MSG[data.code || 10000];
};

module.exports = webStatus;