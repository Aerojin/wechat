/**
 * @require style.css
 */
var $ 			  	= require("zepto");
var api 		  	= require("api/api");
var artTemplate   	= require("artTemplate");
var replaceMobile 	= require("kit/replace_mobile");
var moneyCny      	= require("kit/money_cny");
var user          	= require("kit/user");
var appApi 			= require("kit/app_api");
var eventFactory 	= require("base/event_factory");
var tipMessage	  	= require("ui/tip_message/tip_message");
var upgradeTip    	= require("ui/upgradeTip/privilegeTip");
var vipConfig     	= require("ui/vip_config/vip_config");
var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试"
};

var icoRmb    = __uri("ico-rmb.png");
var icoSmile  = __uri("ico-smile.png");
var icoWechat = __uri("ico-wechat.png");

var vip = {
	init : function(){
		this.ui          = {};
		this.ui.header   = $("#headerId");
		this.ui.priviBox = $("#privilegeBox");
		this.ui.banner   = $(".bannerList");
		this.ui.loading  = $("#loading");
		this.ui.empty  	 = $("#empty");
		this.ui.context  = $("#context");
		this.ui.vipName  = $(".vipName");

		this.showLoading();

		this.userId     = user.get("userId");
		this.token      = user.get("token");

		artTemplate.helper("addHash", $.proxy(function(param){
			return param + "?t=" + (+new Date) + "&userId=" + this.userId + "&token=" + this.token;
		}, this));

		this.template                 = {};
		this.template.noLoginHeader   = artTemplate.compile(__inline("noLoginedWechatHeader.tmpl"));
		this.template.noLoginPriviBox = artTemplate.compile(__inline("noLoginedWechatPrivilege.tmpl"));
		this.template.loginHeader     = artTemplate.compile(__inline("loginedWechatHeader.tmpl"));
		this.template.loginPriviBox   = artTemplate.compile(__inline("loginedWechatPrivilege.tmpl"));
		this.template.bannerList      = artTemplate.compile(__inline("bannerList.tmpl"));

		this.getVipUserInfo();
		this.getBannerInfo();
	},
	regEvent : function(){
		
	},
	renderBaseInfo : function (result) {
		if(result){
			var telNum           = result.loginName;
			telNum               = replaceMobile(telNum);
			var currentLevelName = result.memberLevelDesc;
			var currentLevel     = +result.memberLevel;
			var nextLevelName    = result.nextLevelDesc;
			var upgradeMoney     = result.needInvest;
			upgradeMoney         = moneyCny.toYuan(upgradeMoney,0);
			var vipConf          = vipConfig.getVipConfig(currentLevel);
			if(result.wxuser){
				this.ui.header.html(this.template.loginHeader($.extend(vipConf,{
					icoRmb :  icoRmb,
					icoSmile :  icoSmile,
					icoWechat : icoWechat,
					telNum : telNum,
					currentLevel : currentLevel,
					nextLevelName : nextLevelName,
					upgradeMoney : upgradeMoney
				})));
				this.ui.priviBox.html(this.template.loginPriviBox(vipConf));

				this.hideLoading();

				if(result.firstLevelUp && result.memberLevel != "0"){
					upgradeTip.showUpgradeTip(vipConf);
				}
			}else{
				this.ui.header.html(this.template.noLoginHeader($.extend(vipConf,{
					icoWechat : icoWechat,
					telNum : telNum,
					nextLevelName : nextLevelName
				})));
				this.ui.priviBox.html(this.template.noLoginPriviBox(vipConf));

				this.hideLoading();
			}

			this.setHome();
			this.ui.vipName.text("会员活动");
		}else{
			this.showEmpty();
		}
	},
	renderBannerInfo : function (list) {
		if(list){
			this.ui.banner.html(this.template.bannerList({
				data : list
			}));
		}
	},
	getVipUserInfo : function(){
		var options = {
			data : {}
		};
		options.success = function(e){
			var result = e.data;
			this.renderBaseInfo(result || {});
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.USER, "getVipUserInfo", options, this);
	},
	getBannerInfo : function(){
		var options = {
			data : {
				"pageIndex" : "app_member_privilege_activity"
			}
		};
		options.success = function(e){
			var list = e.data.list;
			this.renderBannerInfo(list || {});
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "findAdvertiseList", options, this);
	},
	getQueryString : function (search) {
		var url = search || location.search; 
		var theRequest = new Object();
		if (~url.indexOf("?")) {
		  var str = url.substring(1);
		  strs = str.split("&");
		  for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
		  }
		}
		return theRequest || {};
	},
	showLoading : function(){
		this.ui.context.hide();
	},
	hideLoading : function(){
		this.ui.context.show();
		this.ui.loading.hide();
	},
	showEmpty : function(){
		this.ui.context.hide();
		this.ui.loading.hide();
		this.ui.empty.show();
	},
	setHome: function () {
		$("#btn-home").on("click", function () {
			eventFactory.exec({
				"wap": function () {
					window.location.href = "$root$/product/home.html";
				},
				"app": function () {
					window.location.href = appApi.getProductList({type: 3});
				}
			});
		});
	}
};

vip.init();