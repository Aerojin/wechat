/*
	活动模块接口
	AeroJin
	2015.08.25
*/
var api = {};
var moduleName = "activity";

/*
    *查询红包列表
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.productId    产品Id,可选
    *@param {String} data.status       status	红包状态：UNEXCHANGE=未兑换；EXCHANGED =已兑换 可选; 默认查询可用红包
*/
api.findRedPacketList = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/activity/findRedPacketList.do"
	};
};


/*
    *获取广告图接口
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
*/
api.findAdvertiseList = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/ad/findAdvertiseList"
	};
};

/*
    *查询单笔投资可分享红包数
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
*/
api.countShareRedPacketForInvest = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/activity/shareRedPacket/countShareRedPacketForInvest.do"
	};
};

/*
    *获取微信好友信息
    *@param {data} data 初始化参数集
    *@param {String} data.code 		微信授权访问临时票据
*/
api.getWechatFirendInfo = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/wechat/getWechatUserInfo"
	};
};



/*
    *获取体验金可用余额 及 红包可用个数
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
 */
api.getUserAbleReawards = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/activity/getUserAbleReawards.do"
    };
};

/*
    *获取体验金列表
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
    *@param {String} data.status       status   状态：used=已使用；unused =未使用; overdue =已过期;
 */
api.findExperienceCashList = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/activity/findExperienceCashList.do"
    };
};

/*
    *获取体验金详情
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
    *@param {String} data.expCashId    体验金ID
 */
api.queryExperienceCashProduct = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/activity/queryExperienceCashProduct.do"
    };
};

/*
    *使用体验金(购买)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
    *@param {String} data.expCashId    体验金ID
    *@param {String} data.payPwd       交易密码
 */
api.investExperienceCash = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/activity/investExperienceCash.do"
    };
};



module.exports = {
	api: api,
	moduleName: moduleName
};