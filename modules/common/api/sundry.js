/**
 * 这类接口很少, 但是又不是任何模块,如果每个都单独立一个模块,又显的浪费, 所以独立一个模块,用来存放这类接口
 * 其它模块接口
 */
var api = {};
var moduleName = "sundry";

/**
 * 消息信息查询
 * @param {data} data 初始化参数集
 * @param {String} data.apiVersion    API版本
 */
api.getNewsInfo = function (data) {
	return {
		requestBody: data,
		requestUrl: "/api/msg/getSpreadMessageById"
	};
};

module.exports = {
	api: api,
	moduleName: moduleName
};