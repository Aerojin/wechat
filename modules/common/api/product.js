/*
	产品模块接口
	AeroJin
	2015.08.22
*/

var api = {};
var moduleName = "product";


/*
    *首页产品列表
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion        API版本
    *@param {String} data.userId            (可选)用户Id
    *@param {Int} data.productState         (可选)1=未审核|2=销售中|3=已售完|4=还款中|5=已下架|6=已还款|7=已删除
    *@param {Int} data.showState            (可选)1= 显示在列表|2= 显示在首页和列表|3=显示在首页|4=隐藏
    *@param {Int} data.parentProductType    (可选)产品父类型 1固定收益,2浮动收益,3活期产品
*/
api.findProductByWechatHome = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/findProductByWechatHome"
    };
};

/*
    *资产收益查询(活期宝)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.currentStatistics = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/profit/currentStatistics.do"
	};
};

/*
    *赎回处理中金额(活期宝)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.getCurrentRedeemableAmount = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/current/getCurrentRedeemableAmount.do"
    };
};


/*
    *产品列表查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion        API版本
    *@param {String} data.userId            (可选)用户Id
    *@param {Int} data.pageIndex            当前页
    *@param {Int} data.pageSize             每页显示数量
    *@param {Int} data.productState         (可选)1=未审核|2=销售中|3=已售完|4=还款中|5=已下架|6=已还款|7=已删除
    *@param {Int} data.showState            (可选)1= 显示在列表|2= 显示在首页和列表|3=显示在首页|4=隐藏
    *@param {Int} data.isFloat              (可选)1=固定利率|2=浮动利率
    *@param {Int} data.productType          (可选)产品类型值  101天添牛,102信托,103闪赚宝,104BS2P,105月息宝,201指数牛
    *@param {Int} data.parentProductType    (可选)产品父类型 1固定收益,2浮动收益,3活期产品
*/
api.queryProductList = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/queryProductList"
    };
};


/*
    *获取产品信息(活期宝)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion        API版本
    *@param {String} data.userId            (可选)用户Id
*/
api.getProductInfo = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/current/getProductInfo"
    };
};


/*
    *产品详情
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion        API版本
    *@param {String} data.userId            (可选)用户Id
    *@param {String} data.fid               产品ID
*/
api.getProductById = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/getProductById"
    };
};

/*
    *购买产品
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion        API版本
    *@param {String} data.userId            (可选)用户Id    
    *@param {String} data.productId         产品FID(string)
    *@param {String} data.principal         投资本金,单位：毫
    *@param {String} data.quotient          按份购买产品购买份数,其他产品份数为0
    *@param {String} data.redPacketId       (可选)红包Id
    *@param {String} data.platform          平台
    *@param {String} data.sellChannel       渠道
    *@param {String} data.payPassword       支付密码
    *@param {String} data.formId            表单formId,防止重复提交(5分钟)
*/
api.buyProduct = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/buyProduct.do"
    };
};


/*
    *投资记录查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion        API版本
    *@param {String} data.userId            用户ID
    *@param {String} data.state             (可选)状态2:投资;3:回款
    *@param {String} data.parentProductType (可选)产品父类型 (1固定收益,2浮动收益,3活期产品)
    *@param {String} data.refundStartDate   (可选)回款时间查询-起始时间
    *@param {String} data.refundEndDate     (可选)回款时间查询-结束时间
    *@param {String} data.isTransferable    (可选)是否可转让
    *@param {String} data.pageIndex         当前页    
    *@param {String} data.pageSize          每页显示记录数
*/
api.queryUserInvestRecord = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/queryUserInvestRecord.do"
    };
};

/*
    *活期宝赎回
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.productId     产品Id
    *@param {String} data.amount        赎回总额
    *@param {String} data.payPassword   支付密码
*/
api.applyRedeemCurrent = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/current/applyRedeemCurrent.do"
    };
};

/*
    *赎回记录查询(活期宝)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
    *@param {String} data.pageSize      （可选）每页记录数
    *@param {String} data.pageIndex     （可选）当前页
*/
api.queryCurrentRedeem = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/current/queryCurrentRedeem.do"
    };
};

/*
    *查询产品协议
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
    *@param {String} data.typevalue      （可选）每页记录数
    *@param {String} data.recordId     （可选）当前页
*/
api.getProtocol = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/getProtocol"
    };
};

/*
    *产品购买记录查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户ID
    *@param {String} data.fId           产品FID
    *@param {String} data.pageSize      （可选）每页记录数
    *@param {String} data.pageIndex     （可选）当前页
*/
api.queryProductInvest = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/queryProductInvest"
    };
};

/*
    *产品购买结果查询
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户ID
    *@param {String} data.investId      投资记录ID
*/
api.getInvestDetailById = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/getInvestDetailById.do"
    };    
};

/*
    *查询转让产品详情(转让专区)
    *可转让产品投资记录查询
    *@param {data} data 初始化参数集
    *@param {String} data.userId         用户ID
    *@param {String} data.investType     产品类型: 转让产品
    *@param {String} data.transferStatus 转让产品状态: 可转让
    *@param {String} data.pageSize       每页记录数
    *@param {String} data.pageIndex      当前页
*/
api.queryAttornInvestRecords = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/queryUserInvestRecord.do"
    };
};

/*
    *转让操作
    *@param {data} data 初始化参数集
    *@param {String} data.userId    用户ID
    *@param {String} data.investId  投资id
*/
api.getTransferInfo = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/getInvestTransfer.do"
    };
};

/*
    *申请转让
    *@param {data} data 初始化参数集
    *@param {String} data.userId       用户ID
    *@param {String} data.investId     投资id  
    *@param {String} data.payPassword  支付密码
*/
api.applyTransfer = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/applyInvestTransfer.do"
    };
};

/*
    *获得上一笔转让记录详情
    *@param {data} data 初始化参数集
    *@param {String} data.userId    用户ID
    *@param {String} data.investId  投资id
*/
api.getPartTransferDetail = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/getInvestLatestTransferRecord.do"
    };
};

/*
    *获得转让手续费
    *@param {data} data 初始化参数集
    *@param {String} data.investPeriod  投资期限
    *@param {String} data.holdPeriod    持有天数
*/
api.getFee = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/findTransferTariff.do"
    };
};

/*
    *转让中产品投资记录查询
    *@param {data} data 初始化参数集
    *@param {String} data.userId         用户ID
    *@param {String} data.pageSize       每页记录数
    *@param {String} data.pageIndex      当前页
*/
api.queryAttorningRecords = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/queryUserTransferProduct.do"
    };
};

/*
    *撤销转让
    *@param {data} data 初始化参数集
    *@param {String} data.userId        用户ID
    *@param {String} data.fid           转让产品fid
    *@param {String} data.payPassword   支付密码
*/
api.cancelInvestTransfer = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/cancelInvestTransfer.do"
    };
};

/*
    *已转让产品记录查询
    *@param {data} data 初始化参数集
    *@param {String} data.userId         用户ID
    *@param {String} data.pageSize       每页记录数
    *@param {String} data.pageIndex      当前页
*/
api.queryAttornedRecords = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/queryTransferRecord.do"
    };
};

/*
    *已转让产品记录详情
    *@param {data} data 初始化参数集
    *@param {String} data.userId         用户ID
    *@param {String} data.fid            转让记录主键Fid       
*/
api.getAttornedDetail = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/getTransferRecordByFid.do"
    };
};

/*
    *获取已转让债权转让服务协议产品信息
    *@param {data} data 初始化参数集
    *@param {String} data.fid            转让记录主键Fid  
    *@param {String} data.productId      转让产品id                   
*/
api.getZQZRAgreementProductInfo = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/getTransferRecordByFid.do"
    };
};

/*
    *查询转让产品详情(转让专区)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户ID
    *@param {String} data.fId           产品FID
*/
api.getTransferProductById = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/getTransferProductById"
    };    
};

/*
    *查询转让产品详情(转让专区)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户ID
    *@param {String} data.pageSize      （可选）每页记录数
    *@param {String} data.pageIndex     （可选）当前页
    *@param {String} data.flag          默认0, 1,忽略用户查询所有
*/
api.queryTransferProduct = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/transfer/queryTransferProduct"
    };    
};

module.exports = {
	api: api,
	moduleName: moduleName
};