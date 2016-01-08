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

/**
    *红包二期，查询用户匿名设置
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
*/
api.getSecretInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/user/getAnonymSetting.do"
    };
}

/**
    *红包二期，更新用户匿名设置
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
    *@param {String} data.secretFlag   匿名设置(Y = 匿名设置开启 | N = 匿名设置关闭)
*/
api.updateSecretInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/user/updateAnonymSetting.do"
    };
}

/**
    *红包二期，领取好友发送定时红包
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
    *@param {String} data.redpaperId   定时红包Id
*/
api.getFixedHbInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/receiveTimingRedPacket.do"
    };
}

/**
    *红包二期，领取好友发送的手气红包
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
    *@param {String} data.friendRelationId   手气红包Id
*/
api.getLuckyHbInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/receiveLuckRedPacket.do"
    };
}

/**
    *红包二期，查询好友红包列表(定时+手气红包)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
*/
api.getHbInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/findFriendRedPacketList.do"
    };
}

/**
    *红包二期，查询我的好友及朋友圈状态
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
*/
api.getFriendInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/getMoments.do"
    };
}

/**
    *红包二期，查询消息模版
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
*/
api.getMessageInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/msg/getMessageTemplate"
    };
}

/**
    *红包二期，查询好友发送的手气红包(分页)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion   API版本
    *@param {String} data.userId       用户ID
    *@param {String} data.pageIndex   页码，默认 = 1
    *@param {String} data.pageSize    每页记录数，默认 = 20
*/
api.queryLuckRedPacket = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/queryLuckRedPacket.do"
    };
}

/**
    *红包二期，查询手气红包中的大家手气红包
    *@param {data} data 初始化参数集
    *@param {String} data.friendRelationId  手气红包id   
*/
api.getLuckyHbInfoHistory = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/findLuckRedPacketReceiveList.do"
    };
}

/**
    *红包二期，查询定时红包的历史记录
    *@param {data} data 初始化参数集
    *@param {String} data.userId 用户id
*/
api.getFixedHbInfoHistory = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/findTimingRedPacketHis.do"
    };
}

/**
    *红包二期，查询定时红包来源信息
    *@param {data} data 初始化参数集
    *@param {String} data.redpaperId 红包id
*/
api.getFixedHbInfoRefer = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/friend/findTimingRedPacketRechargeRecord.do"
    };
}

/**
    *新手引导，查询新手指引基础信息
    *@param {data} data 初始化参数集
    *@param {String} data.userId 用户id
*/
api.getGuideInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/userguide/getGuideRecord.do"
    };
}

/**
    *新手引导，查询新手奖励红包信息
    *@param {data} data 初始化参数集
    *@param {String} data.userId 用户id
*/
api.getGuideHbInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/userguide/listUserGuideSteps.do"
    };
}

/**
    *新手引导，完善用户信息
    *@param {data} data 初始化参数集
    *@param {String} data.userId 用户id
    *@param {String} data.userName 用户姓名(可选)
    *@param {String} data.userCardNO 身份证号码(可选)
    *@param {String} data.step 步骤
*/
api.updateIdentityInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/userguide/updateUserGuideRecord.do"
    };
}

/**
    *新手引导，通知后台发送红包给用户
    *@param {data} data 初始化参数集
    *@param {String} data.userId 用户id
    *@param {String} data.step 步骤
*/
api.postHbInfo = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/userguide/receivePrize.do"
    };
}

/**
    *新手引导，查询首页是否显示新手指引浮层
    *@param {data} data 初始化参数集
    *@param {String} data.userId 用户id
*/
api.getTipStatus = function(data){
    return {
        requestBody: data,
        requestUrl: "/api/activity/userguide/getUserTipStatus.do"
    };
}

module.exports = {
	api: api,
	moduleName: moduleName
};