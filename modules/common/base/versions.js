var SOURCE = {
	APP: "app",
	IOS: "ios",
	WAP: "wap",
	WEB: "web",
	WECHAT: "wechat",
	ANDROID: "android"
};

//根据host来确定是否是app应用
var HOST = ["mapp.xiaoniuapp.com", "mappx.xiaoniuapp.com"];

var v = {
	getVersions: function () {
		var u = navigator.userAgent;
		var ua = u.toLowerCase(); 

		var versions = {//移动终端浏览器版本信息   
	       trident: u.indexOf('Trident') > -1, //IE内核  
	       presto: u.indexOf('Presto') > -1, //opera内核  
	       webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
	       gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
	       mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
	       ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
	       android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
	       iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器  
	       iPad: u.indexOf('iPad') > -1, //是否iPad 
	       isWebChat: ua.match(/MicroMessenger/i) == "micromessenger"  //是否是微信
	    };

	    return versions;
	},

	getSource: function () {
		var versions = this.getVersions();

		if(versions.isWebChat){
			return SOURCE.WECHAT;
		}

		/*
		if(versions.mobile){
			return SOURCE.WAP;
		//}
		*/

		//if(versions.ios){
		//	return SOURCE.IOS;
		//}

		//if(versions.android){
		//	return SOURCE.ANDROID;
		//}

		return SOURCE.WAP;
	},

	getSystem: function () {
		var versions = this.getVersions();
		
		if(versions.ios){
			return SOURCE.IOS;
		}

		if(versions.android){
			return SOURCE.ANDROID;
		}	
	},

	getCurrentSource: function () {
		var strHost = HOST.join(",");
		var sysHost = window.location.host;

		if(strHost.indexOf(sysHost) > -1){
			return this.getSystem();	
		}

		return this.getSource();
	},

	getConstant: function () {
		return SOURCE;
	},

	isApp: function () {
		var source = this.getCurrentSource();

		if(source == SOURCE.IOS || source == SOURCE.ANDROID){
			return true;
		}

		return false;
	},

	isWebChat: function () {
		var source = this.getVersions();

		return source.isWebChat;
	}
};

module.exports = v;