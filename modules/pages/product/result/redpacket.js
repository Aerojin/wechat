var $ 				= require("zepto");
var api 			= require("api/api");
var appApi 		 	= require("kit/app_api");
var versions 		= require("base/versions");
var wechatApi 		= require("kit/wechat_api");
var eventFactory 	= require("base/event_factory");
var tipMessage		= require("ui/tip_message/tip_message");
var wechatShare		= require("ui/wechat_share/wechat_share");

var TIPS = {
	SUCCESS: "分享成功",
	TITLE: "送你现金！我们都在用小牛钱罐子",
	DESC: "随存随取，收益高达11%！PICC承保账户资金安全"
};
	
var shareLogo = __uri("share_logo.jpg");

var share = {
	init: function (options) {

		this.investId = options.investId || "";

		this.ui = {};
		this.ui.wrap 				= $("#red-wrap");
		this.ui.number 				= $("#red-number");
		this.ui.btnShareTimeline 	= $("#btn-shareTimeline");
		this.ui.btnShareAppMessage 	= $("#btn-shareAppMessage");

		this.regEvent();
		this.getRedNumber();
		this.createWbChatApi();
	},

	regEvent: function () {
		var _this = this;
		this.ui.btnShareTimeline.on("click", $.proxy(function () {
			eventFactory.exec({
				wap: function () {
					wechatShare.show();
				},
				app: function () {
					_this.shareTimeline();
				}
			});
		}, this));

		this.ui.btnShareAppMessage.on("click", $.proxy(function () {
			eventFactory.exec({
				wap: function () {
					wechatShare.show();
				},
				app: function () {
					_this.shareAppMessage();
				}
			});
		}, this));
	},

	getRedNumber: function () {
		var options = {
			data: {}
		};

 		options.success = function (e) {
 			var result 	= e.data;
			
			if(result > 0){
				this.ui.wrap.show();	
				this.ui.number.text(result);
			} 			
 		};

 		options.error = function (e) {

 		};

 		api.send(api.ACTIVITY, "countShareRedPacketForInvest", options, this);

	},

	createWbChatApi: function () {
 		var _this = this;

 		if(versions.isWebChat()){
	 		var data = {
	 			title: TIPS.TITLE, // 分享标题
			    desc: TIPS.DESC, // 分享描述
			    link: this.getUrl(), // 分享链接
			    imgUrl: window.location.origin + shareLogo, // 分享图标
			    success: function () {
			    	wechatShare.close();
			    	tipMessage.show(TIPS.SUCCESS, {delay: 2000});
			    }
	 		};

	 		this.wechatApi = wechatApi.create({
	 			data: data
	 		});
	 	}
 	},

 	getShareData: function () {
 		window.shareCallback = function (e) {
			var result = JSON.parse(e);

			if(result.code == 0){
				tipMessage.show(TIPS.SUCCESS, {delay: 2000});
			}

			window.shareCallback = null;			
		};

 		return {
 			title: TIPS.TITLE, // 分享标题
		    desc: TIPS.DESC, // 分享描述
		    link: this.getUrl(), // 分享链接
		    callback: "shareCallback",
		    icon: window.location.origin + shareLogo, // 分享图标
 		};
 	},

	shareTimeline: function () {
		window.location.href = appApi.getShareApi($.extend({
			type: 1
		}, this.getShareData()));
	},

	shareAppMessage: function () {
		window.location.href = appApi.getShareApi($.extend({
			type: 2
		}, this.getShareData()));
	},

	getUrl: function () {
		//wx40d5184e05d61899 测试
		//wx7193cd3aad46ab2c 线上
		var redirectUri = encodeURIComponent(window.location.protocol + "//m.xiaoniuapp.com/activity/redpacket/pages/index.html?investId={0}".format(this.investId));
		var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7193cd3aad46ab2c&redirect_uri={0}&response_type=code&scope=snsapi_userinfo&state=state#wechat_redirect";

		return url.format(redirectUri);
	}

};

module.exports = {
	create: function (options) {
		share.init(options || {});
	}
};

