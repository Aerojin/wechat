/*
	用户模块接口
	AeroJin
	2015.08.22
*/

var api = {};
var moduleName = "user";

/*
    *检测用户是否关联
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion API版本
    *@param {String} data.code 微信授权code
*/
api.getUserRelation = function (data) {
    /*初始化清除所有本地数据*/
    localStorage.clear();
    sessionStorage.clear();

	return {
		requestBody: data,
		requestUrl: "/api/user/wechatRelationLogin"
	};
};

/*
    *验证帐号是否可注册
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion	API版本
    *@param {String} data.account 		手机号
*/
api.verifyAccountState = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/verifyAccountState"
	};
};

/*
    *登录
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion	API版本
    *@param {String} data.account 		手机号
    *@param {String} data.loginPwd   	密码
*/
api.login = function (data) {
    /*初始化清除所有本地数据*/
    localStorage.clear();
    sessionStorage.clear();

	return {
		requestBody: data,
		requestUrl: "/api/user/login"
	};
};

/*
    *注册
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion	API版本
    *@param {String} data.account          用户帐户,当前为手机号码
	*@param {String} data.loginPwd         登录密码
	*@param {String} data.smsCode          手机验证码
	*@param {String} data.referrer         (可选) 推荐人
    *@param {String} data.referrerUId      (可选) 推荐人UId
	*@param {String} data.accessToken      (可选) 微信授权访问token
	*@param {String} data.openid           (可选) 微信授权用户唯一标识
	*@param {String} data.regChannel       (可选) 用户来源渠道
	*@param {String} data.searchEngine     (可选) 用户来源渠道类型
	*@param {String} data.keyword          (可选) 用户来源入口标识
*/
api.register = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/register"
	};
};

/*
    *注册发送验证码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion	API版本
    *@param {String} data.mobile        用户帐户,当前为手机号码
*/
api.sendSmsCodeByRegister = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/sendSmsCodeByRegister"
	};
};

/*
    *找回密码发送验证码
    *@param {data} data 初始化参数集
    *@param {String} data.mobile      用户帐户,当前为手机号码
*/
api.sendSmsCodeByResetLoginPwd = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/sendSmsCodeByResetLoginPwd"
	};
};

/*
    *重置登录密码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion	API版本
    *@param {String} data.mobile        用户帐户,当前为手机号码
    *@param {String} data.smsCode       验证码
    *@param {String} data.newLoginPwd   新登录密码
*/
api.resetLoginPwd = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/resetLoginPwd"
	};
};

/*
    *修改登录密码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户帐户,当前为手机号码
    *@param {String} data.oldLoginPwd   当前密码
    *@param {String} data.newLoginPwd   新登录密码
    
*/
api.modifyLoginPwd = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/user/modifyLoginPwd.do"
    };
};

/*
    *登出
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.token         登录令牌
*/
api.logout = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/logout"
	};
};

/*
    *修改登录密码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.oldLoginPwd   当前密码 
    *@param {String} data.newLoginPwd   新密码
*/
api.modifyLoginPwd = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/modifyLoginPwd.do"
	};
};

/*
    *获取用户手机号码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getMobileByUser = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/getMobileByUser.do"
	};
};

/*
    *设置交易密码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.account       用户名
    *@param {String} data.payPwd        交易密码
*/
api.setPayPassword = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/setPayPassword.do"
	};
};

/*
    *查询用户实名认证及银行卡信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getIdentityInfoByUser = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/getIdentityInfoByUser.do"
	};
};

/*
    *保存/修改用户实名认证及银行卡信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.name          真实姓名
    *@param {String} data.idCardNo      身份证号码
    *@param {String} data.bankCardNo    银行卡号
    *@param {String} data.bankName      开户银行
    *@param {String} data.bankCode      银行编码
*/
api.improveIdentityInfo = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/improveIdentityInfo.do"
	};
};


/*
    *查询用户实名认证及银行卡信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getIdentityInfoByUser = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/getIdentityInfoByUser.do"
	};
};

/*
    *检查用户是否设置交易密码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.verifyPayPwdState = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/verifyPayPwdState.do"
	};
};

/*
    *获取用户交易绑卡设置状态
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getUserBindCardState = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/getUserBindCardState.do"
	};
};

/*
    *验证用户实名认证信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.name        	用户姓名
    *@param {String} data.idCardNo      身份证号码
*/
api.verifyIdentityInfo = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/verifyIdentityInfo.do"
	};
};

/*
    *发送重置支付密码验证码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.sendSmsCodeByResetPayPwd = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/sendSmsCodeByResetPayPwd.do"
	};
};

/*
    *验证重置支付密码验证码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.smsCode       短信验证码
*/
api.verifySmsCodeByResetPayPwd = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/verifySmsCodeByResetPayPwd.do"
	};
};

/*
    *重置交易密码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.newPayPwd     新交易密码
    *@param {String} data.smsCode       短信验证码
*/
api.resetPayPwd = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/user/resetPayPwd.do"
	};
};

/*
    *会员信息查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
*/
api.getVipUserInfo = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/user/getMemberLevelInfo.do"
    };
};

/*
    *设置首次升级弹窗
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.firstUpgradePrompt = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/user/firstUpgradePrompt.do"
    };
};

/*
    *验证交易密码
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.payPwd        交易密码
*/
api.verifyPayPwd = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/user/verifyPayPwd.do"
    };
};

/*
    *微信分享
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.weChatShare = function (data) {
    return {
        requestBody: data,
        requestUrl:  window.location.protocol + "//wx.xiaoniuapp.com/xn-wechat/wechat/signatureVerification.do"
    };
};

module.exports = {
	api: api,
	moduleName: moduleName
};