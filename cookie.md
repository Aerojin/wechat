#钱罐子Cookie方案
`现有的登录态是通过url共享的,这种方式的登录态很容易丢失,导致我们的活动页面需要反复登录,而且url这种方式表现的也不太友好,
现在整体改用cookie方案,可以避免这类问题,首先改造新旧版微信,其余的后续陆续改进`

#改造思路
* 一个站点登录, 在主域下写cookie,只要主域一致, cookie是可以共享的
* 提供一套统一的API, 避免登录态混乱
* 兼容url登录态方案, url登录态自动保存到cookie, 无缝对接



#API
```javascript
/*
    *写用户数据
    *@param {object} data           用户数据
    *@param {object} options        cookie参数
    *@param {int} options.expires   过期时间(单位:天),默认值: 1天
    *@param {string} options.path   cookie存储路径, 默认值:"/"
    *@param {string} options.domain domain, 默认值: "xiaoniuapp.com"
    *@param {bool} options.secure   是否是https, 默认值: 根据当前url判断
*/
window.user.setData({
    userId: "bb269bfd-a456-42d1-86af-54e40a7520d0",
    token: "bb269bfd-a456-42d1-86af-54e40a7520d0"
},{
    expires: 1,
    domain: "xiaoniuapp.com"
});

/*
    *获取用户数据
    *返回用户数据, 为空则返回空对象
*/
window.user.getData();

/*
    *判断用户是否登录
    *返回布尔类型, true: 已登录, false: 未登录
*/
window.user.isLogin();

```

#缺点
`主域下所有的http请求都会带上cookie, 会增加http协议的传输成本`

#cookie.js
`cookie.js没有任何依赖,直接引入在头部就可以使用`
```javascript
;(function (win, doc) {
	
	//工具类
	var tool = {
		//判断一个值是否为空
		isEmpty: function (value) {
			if(value == null || value == undefined  || value == "null"  || value == "undefined" || value.toString().trim().length <= 0){
				return true;
			}

			return false;
		},
		//将url参数转换成对象, 例如: ?userId=123&token=456,  {userId: 123, token: 456};
		query: function () {
			var url = location.search; //获取url中"?"符后的字串
			var obj = new Object();

			if (url.indexOf("?") != -1) {
				var str = url.substr(1);
					str = str.split("&");

				for(var i = 0; i < str.length; i ++) {
					obj[str[i].split("=")[0]] = unescape(str[i].split("=")[1]);
				}
			}
			return obj || {};
			
		},
		//设置cookie
		cookie : function (key, value, options) {
			var days, time, result, decode

			// A key and value were given. Set cookie.
			if (arguments.length > 1 && String(value) !== "[object Object]") {
				// Enforce object
				options = $.extend({}, options)

				if (value === null || value === undefined) options.expires = -1

				if (typeof options.expires === 'number') {
					days = (options.expires * 24 * 60 * 60 * 1000)
					time = options.expires = new Date()

					time.setTime(time.getTime() + days)
				}

				value = String(value)

				return (document.cookie = [
					encodeURIComponent(key), '=',
					options.raw ? value : encodeURIComponent(value),
					options.expires ? '; expires=' + options.expires.toUTCString() : '',
					options.path ? '; path=' + options.path : '',
					options.domain ? '; domain=' + options.domain : '',
					options.secure ? '; secure' : ''
				].join(''))
			}

			// Key and possibly options given, get cookie
			options = value || {}

			decode = options.raw ? function (s) { return s } : decodeURIComponent

			return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
		},
		//判断userId和token是否为空, 不为空则可以写入数据
		isSetData: function (data) {
			if(this.isEmpty(data.token)){
				return false;
			}
			
			if(this.isEmpty(data.userId)){
				return false;
			}
			
			return true;
		},
		//cookie的KEY值
		getKey: function () {
			return "_XN_USERS_";
		},
		//cookie默认配置
		getOptions: function () {			
			return {
				path: "/", 
				expires: 1,				
				domain: "xiaoniuapp.com",
				secure: location.protocol == "https:"
			}
		},
		extend: function (target, source) {
			for (var p in source) {
		        if (source.hasOwnProperty(p)) {
		            target[p] = source[p];
		        }
		    }
		    
		    return target;
		}
	};
	
	win.user = win.user || {};
	
	win.user.setData = function (data, options) {
		var value = data;
		
		if(typeof(value) != "string"){
			value = JSON.stringify(value);
		}
		
		tool.setCookie(tool.getKey(), value, tool.extend(tool.getOptions(), options));
	};
	
	win.user.getData = function () {
		var strData = tool.cookie(KEY);

		if(tool.isEmpty(strData)){
			return {};
		}

		var data = JSON.parse(strData);		
		
		return data || {};
	};

	win.user.isLogin = function () {
		var data = this.getData();

		return tool.isSetData(data);
	};
	
	//自动写数据	
	if(tool.isSetData(tool.query())){
		win.user.setData(tool.query());
	}
})(window, document);
```
