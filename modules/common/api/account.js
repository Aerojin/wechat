/*
	账户模块接口
	AeroJin
	2015.08.22
*/

var api = {};
var moduleName = "account";

/*
    *获取用户资产接口
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getUserAsset = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/account/getUserAsset.do"
	};
};

/*
    *查询银行卡列表
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.queryBankList = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/payment/queryBankList"
	};
};

/*
    *查询用户绑卡信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getUserBindCard = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/payment/getUserBindCard.do"
	};
};

/*
    *查询银行卡信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.bankCardNo    银行卡号
*/
api.getBankCardInfo = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/payment/getBankCardInfo.do"
	};
};

/*
    *获取用户余额
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getAbleBalance = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/account/getAbleBalance.do"
	};
};

/*
    *首次绑卡充值发送短信
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.name          用户真实姓名
    *@param {String} data.idCardNo      身份证号码
    *@param {String} data.mobile        手机号码
    *@param {String} data.totalAmount   充值金额
    *@param {String} data.bankCardNo    银行卡号
    *@param {String} data.bankCode      银行编码
    *@param {String} data.payMethod     支付渠道 快钱(wap、app) : quick_pay 连连wap : mobile_wap 连连app : mobile_app
    *@param {String} data.payType       支付类型 direct-快钱支付; card_front-连连支付
    *@param {String} data.itemName      商品描述
*/
api.firstPaySendSms = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/payment/firstPaySendSms.do"
	};
};


/*
    *首次绑卡充值发送短信
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.name          用户真实姓名
    *@param {String} data.idCardNo      身份证号码
    *@param {String} data.mobile        手机号码
    *@param {String} data.totalAmount   充值金额
    *@param {String} data.bankCardNo    银行卡号
    *@param {String} data.bankCode      银行编码
    *@param {String} data.payMethod     支付渠道 快钱(wap、app) : quick_pay 连连wap : mobile_wap 连连app : mobile_app
    *@param {String} data.payType       支付类型 direct-快钱支付; card_front-连连支付
    *@param {String} data.itemName      商品描述
    *@param {String} data.validCode     短信验证码
    *@param {String} data.inRecordNo    充值订单流水号

*/
api.firstBindCardPay = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/payment/firstBindCardPay.do"
	};
};


/*
    *一键支付(连连支付)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.name          用户真实姓名
    *@param {String} data.idCardNo      身份证号码
    *@param {String} data.mobile        手机号码
    *@param {String} data.totalAmount   充值金额
    *@param {String} data.bankCardNo    银行卡号
    *@param {String} data.bankCode      银行编码
    *@param {String} data.payMethod     支付渠道 快钱(wap、app) : quick_pay 连连wap : mobile_wap 连连app : mobile_app
    *@param {String} data.payType       支付类型 direct-快钱支付; card_front-连连支付
    *@param {String} data.itemName      商品描述
*/
api.directPay = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/payment/directPay.do"
	};
};

/*
    *我的财富
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getUserTreasure = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/account/getUserTreasure.do"
    };
};

/*
    *我的财富
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.productId   (可选),产品Id: 查询对应产品可用红包
*/
api.getUserWallet = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/account/getUserWallet.do"
    };
};

/*
    *查询用户提现银行卡信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getWithdrawBankCard = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/account/getWithdrawBankCard.do"
    };
};

/*
    *用户提现
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.name          用户真实姓名
    *@param {String} data.idCardNo      身份证号码
    *@param {String} data.amount        提现金额,单位: 毫
*/
api.userWithdrawRequest = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/account/userWithdrawRequest.do"
    };
};

/*
    *提现记录查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.outRecordNo   提现流水号,(可选)
    *@param {String} data.pageIndex     页码
    *@param {String} data.pageSize      每页记录数
*/
api.queryWithdrawLog = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/account/queryWithdrawLog.do"
    };
};

/*
    *提现记录查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getWithdrawSummary = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/account/getWithdrawSummary.do"
    };
};

/*
    *资金流水查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.transType     交易类型,可选；默认查询所以交易类型
    *@param {String} data.pageIndex     页码，可选；默认查询第一页
    *@param {String} data.pageSize      每页显示记录上，可选；默认每页20条记录
*/
api.queryUserBalanceLogByPage = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/account/queryUserBalanceLogByPage.do"
    };
};


module.exports = {
	api: api,
	moduleName: moduleName
};