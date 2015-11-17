/*
	产品模块接口
	AeroJin
	2015.08.22
*/

var api = {};
var moduleName = "product";

/*
    *产品信息查询(活期宝)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
*/
api.queryProductInfo = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/product/current/queryProductInfo"
	};
};

/*
    *资产收益查询(活期宝)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
*/
api.assetQuery = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/product/current/assetQuery.do"
	};
};

/*
    *产品列表(固定产品|浮动产品)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.pageIndex     当前页
    *@param {String} data.pageSize      每页显示数量
    *@param {String} data.isFlow        产品类型 １：固定利率，２：浮动利率
*/
api.queryProductList = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/product/queryProductList"
	};
};

/*
    *产品列表(固定产品|浮动产品)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.productId     产品FID
*/
api.queryProductById = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/product/queryProductById"
	};
};

/*
    *购买活期宝
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
    *@param {String} data.productId     产品FID(string)
    *@param {String} data.investAmount  投资总额
    *@param {String} data.payPassword   支付密码
    *@param {String} data.formId        (可选)表单ID
    *@param {String} data.platform      (可选)来源
    *@param {String} data.sellChannel   (可选)渠道local
*/
api.buyProduct = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/product/current/buyProduct.do"
	};
};

/*
    *获取产品详细信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
    *@param {String} data.productId     产品FID(string)
*/
api.queryProductById = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/queryProductById"
    };
};

/*
    *获取产品详细信息
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
    *@param {String} data.productId     产品FID(string)
    *@param {String} data.investAmount  投资总额
    *@param {String} data.payPassword   支付密码
    *@param {String} data.formId        (可选)表单ID
    *@param {String} data.platform      (可选)来源
    *@param {String} data.sellChannel   (可选)渠道local
    *@param {String} data.redId         (可选)红包Id
*/
api.buyTtnProduct = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/dayAdd/buyProduct.do"
    };
};

/*
    *投资记录查询(活期宝)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
    *@param {String} data.pageIndex     当前页
    *@param {String} data.pageSize      每页显示记录数
*/
api.queryInvestRecordsByHqb = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/current/queryInvestRecords.do"
    };
};


/*
    *投资记录查询(天添牛)
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
    *@param {String} data.state         (可选)状态2:投资;3:回款
    *@param {String} data.proType       (可选)产品类型 (1/固定产品,2/浮动产品)
    *@param {String} data.pageIndex     当前页    
    *@param {String} data.pageSize      每页显示记录数
*/
api.queryInvestRecords = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/dayAdd/queryInvestRecords.do"
    };
};

/*
    *查询用户投资及累计收益
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
*/
api.getProductInvest = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/getProductInvest.do"
    };
};

/*
    *获取天天牛待收本金
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        产品FID
*/
api.getUserPrincipalMoney = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/dayAdd/getUserPrincipalMoney.do"
    };
};

/*
    *活期宝赎回
    *@param {data} data 初始化参数集
    *@param {String} data.apiVersion    API版本
    *@param {String} data.userId        用户id
    *@param {String} data.productId     产品Id
    *@param {String} data.redeemAmount  赎回总额
    *@param {String} data.payPassword   支付密码
    *@param {String} data.formId        表单ID
*/
api.applyRedeem = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/current/applyRedeem.do"
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
api.queryRedeemRecords = function (data) {
    return {
        requestBody: data,
        requestUrl: "/api/product/current/queryRedeemRecords.do"
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

module.exports = {
	api: api,
	moduleName: moduleName
};