/**
 * @require style.css
 */
var $ 			  	= require("zepto");
var api 		  	= require("api/api");
var artTemplate   	= require("artTemplate");
var user          	= require("kit/user");
var appApi 			= require("kit/app_api");
//var eventFactory 	= require("base/event_factory");
var tipMessage	  	= require("ui/tip_message/tip_message");
var loadingPage	    = require("ui/loading_page/loading_page");
var TIPS = {
	SYS_ERROR: "网络异常,请稍后重试",
	SUCCESS: "分享成功",
	TIT : "送你现金红包！我们都在用小牛钱罐子",
	DESC : "随存随取，收益高达11%！PICC承保账户资金安全",
	MESSAGE_OK : "发送成功",
	MESSAGE_ERROR : "发送失败",
	TB_SUCCESS : "同步成功",
	TB_ERROR : "同步失败"
};

var lit_05    = __uri("lit_05.png");
var weisha_03 = __uri("weisha_03.png");
var weisha_06 = __uri("weisha_06.png");
var icon      = __uri("share_logo.jpg");

var myfriends = {
	init : function(){
		this.ui                    = {};
		this.ui.searchFriends      = $(".searchFriends");
		this.ui.postHbCount        = $(".postHbCount");
		this.ui.shareHbCount       = $(".shareHbCount");
		this.ui.postHbInfo         = $(".postHbInfo");
		this.ui.qgzFriends         = $(".qgzFriends");
		this.ui.refreshText        = $(".refreshText");
		this.ui.refreshJindu       = $(".refreshJindu");
		this.ui.qgzList            = $(".qgzList");
		this.ui.unQgzFriends       = $(".unQgzFriends");
		this.ui.unQgzList          = $(".unQgzList");
		this.ui.shareAppMessage    = $(".shareAppMessage");
		this.ui.shareTimeline      = $(".shareTimeline");
		this.ui.tbTxl              = $(".tbTxl");
		this.ui.tbList             = $(".tbList");
		this.ui.searchFriendLayer  = $(".searchFriendLayer");
		this.ui.floateLayer        = $(".floateLayer");
		this.ui.sqTip              = $(".sqTip");
		this.ui.androidTip         = $(".androidTip");
		this.ui.iosTip             = $(".iosTip");
		//this.ui.goStart            = $(".goStart");
		this.ui.jindu              = $(".jindu");
		this.ui.cancel             = $(".cancel");
		this.ui.inputFriendName    = $(".inputFriendName");
		this.ui.searListLi         = $(".searList li");
		this.ui.searList           = $(".searList");
		this.ui.mysharebottom      = $(".mysharebottom");
		this.ui.inviteFriendText   = $(".inviteFriendText");
		this.ui.clearInput         = $(".clearInput");
		
		this.template              = {};
		this.template.qgzFriends   = artTemplate.compile(__inline("qgzFriends.tmpl"));
		this.template.unQgzFriends = artTemplate.compile(__inline("unQgzFriends.tmpl"));

		this.ui.txlInfo            = {};
		this.ui.unqgzMobileList    = [];
		this.webMessageText        = "";//存储可配置的页面信息
		this.shortMessageText      = "";//存储可配置的短信信息
		var refer = {
			"referrer" : user.get("loginName")
		};
		this.downUrl = window.location.protocol + "//mapp.xiaoniuapp.com/pages/user/nw_register.html?" + $.param(refer);

		this.refreshPage();
		this.regEvent();
	},
	regEvent : function(){
		this.ui.shareTimeline.on("singleTap", $.proxy(function(){
			this.share(1);
			return false;
		}, this));
		this.ui.shareAppMessage.on("singleTap", $.proxy(function(){
			this.share(2);
			return false;
		}, this));
		this.ui.tbList.on("singleTap", $.proxy(function(){
			this.tbAddressBook();
			return false;
		}, this));
		this.ui.searchFriendLayer.on("singleTap", $.proxy(function(){
			return false;
		}, this));
		this.ui.refreshText.on("singleTap", $.proxy(function(){
			//向后台发送请求，获取最新钱罐子好友信息
			this.refreshFriendInfo();
		}, this));
		this.ui.searchFriends.on("singleTap", $.proxy(function(){
			this.refreshPage();
			this.showFloateLayer(this.ui.searchFriendLayer);
			this.ui.inputFriendName.focus();
			return false;
		}, this));
		this.ui.cancel.on("singleTap", $.proxy(function(){
			this.hideFloateLayer(this.ui.searchFriendLayer);
			return false;
		}, this));
		this.ui.inputFriendName.on("input", $.proxy(function(e){
			this.matchFriend($(e.target).val());
			return false;
		}, this));
		this.ui.clearInput.on("singleTap", $.proxy(function(){
			this.ui.inputFriendName.val("");
			return false;
		}, this));
	},
	regMessage : function(){
		this.ui.messageInvite.on("singleTap", $.proxy(function(e){
			this.shortMessageText = this.message;
			var index = $(e.target).parent().parent("li").index();
			window.messageFunction = function(data){
				data = JSON.parse(data);
				(data.code == 0) ? tipMessage.show(TIPS.MESSAGE_OK, {delay : 2000}) : tipMessage.show(TIPS.MESSAGE_ERROR, {delay : 2000});
				window.messageFunction = null;
			};
			var dataP = {
				"callback" : "messageFunction",
				"to" : this.ui.unqgzMobileList[index],
				"content" : this.shortMessageText + this.downUrl//由后台配置返回，可能会在请求中加入该参数
			};
			window.location.href = "xiaoniuapp://sendSMS?" + $.param(dataP);
		}, this));
	},
	longToShort : function(longurl){
		var p = {
			"source" : "3180958896",
			"url_long":encodeURIComponent(longurl)			
		};
		var shortUrl = "";
		var datas= {
			type : "get",
			url : "https://api.weibo.com/2/short_url/shorten.json",
			dataType : "jsonp",
			data : p,
			success : function(ret){
				var resultData = ret.urls[0];
				resultData.result && (shortUrl = resultData.url_short);
			}
		};
		$.ajax(datas);
		return shortUrl;
	},
	share : function(type){
		window.location.href = appApi.getShareApi($.extend({"type" : type},this.getShareParam()));
	},
	getShareParam : function(){
		window.appShareCallback = function(e){
			var result = JSON.parse(e);
			if(result.code == 0){
				tipMessage.show(TIPS.SUCCESS, {delay: 2000});
			}
			window.appShareCallback = null;
		};
		var param = {
			"appid" : "wx0b2f357a1ee329e0",//wx40d5184e05d61899 开发//wx0b2f357a1ee329e0 测试//wx7193cd3aad46ab2c 线上
			"icon" : window.location.origin + icon,
			"title" : TIPS.TIT,
			"desc" : TIPS.DESC,
			"link" : this.downUrl,//this.longToShort(this.downUrl),//待修改
			"callback" : "appShareCallback"
		};
		return param;
	},
	refreshPage : function(){
		this.getMessage(2,"REWARDFRIEND");
		var options = {
			data : {}
		};

		options.success = function(e){
			var result = e.data;
			this.ui.txlInfo = result;
			this.renderBaseInfo(result || {});

			loadingPage.hide();
		};
		options.error = function(e){
			loadingPage.hide();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getFriendInfo", options, this);
	},
	renderBaseInfo : function(result){
		var qgz = result.regFriendList;
		var unqgz = result.unregFriendList;
		var tb = (qgz.length != 0 || unqgz.length != 0);

		this.webMessageText = this.message;//存储可配置的页面信息

		this.ui.postHbCount.text(result.redPacketSummary.sendRedpaperNum);
		this.ui.shareHbCount.text(result.redPacketSummary.receiveRedpaperNum);
		this.ui.inviteFriendText.text(this.webMessageText);

		if(!tb){
			return;
		}

		var fInfo = {
			"qgz" : {
				"qgzList" : this.resetQgzFriendInfo(qgz)
			},
			"unqgz" : {
				"unQgzList" : this.resetUnqgzFriendInfo(unqgz)
			}
		};
		this.showFInfo(fInfo);
		//初始化短信内容
		this.getMessage(2,"INVITEFRIEND");
	},
	showFInfo : function(fInfo){
		this.ui.qgzList.html(this.template.qgzFriends(fInfo.qgz));
		this.ui.unQgzList.html(this.template.unQgzFriends(fInfo.unqgz));
		this.hideFloateLayer(this.ui.tbTxl);
		this.showFloateLayer(this.ui.qgzFriends, this.ui.unQgzFriends);

		this.ui.messageInvite = $(".messageInvite");
		this.regMessage();
	},
	tbAddressBook : function(){
		window.backFunction = function(data){
			data = JSON.parse(data);
			if(data.code == 0){
				tipMessage.show(TIPS.TB_SUCCESS, {delay : 2000});
				myfriends.refreshPage();
			}else{
				tipMessage.show(TIPS.TB_ERROR, {delay : 2000});
			}
			window.backFunction = null;
		};
		window.location.href = "xiaoniuapp://syncAddressBook?callback=backFunction";
	},
	getMessage : function(type,moduleId){
		var options = {
			data : {
				"type" : type,
				"moduleId" : moduleId
			}
		};

		options.success = function(e){
			this.message = e.data.content;
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getMessageInfo", options, this);
	},
	resetQgzFriendInfo : function(qgz){
		for(var i = 0,lenqgz = qgz.length; i < lenqgz; i++){
			//var mobile = qgz[i].friendMobile;
			//qgz[i].friendMobile = mobile.replace(mobile.substring(3,7),"****");//不加*了，全部显示
			qgz[i].lit_05 = lit_05;
			if(qgz[i].friendPrivacy == 1){
				qgz[i].friendName = "[匿名好友]";
				qgz[i].friendMobile = "***********";
				qgz[i].lit_05 = weisha_03;
			}
		}
		return qgz;
	},
	resetUnqgzFriendInfo : function(unqgz){
		for(var i = 0,lenunqgz = unqgz.length; i < lenunqgz; i++){
			var mobile = unqgz[i].friendMobile;
			this.ui.unqgzMobileList.push(mobile);
			//unqgz[i].friendMobile = mobile.replace(mobile.substring(3,7),"****");//不加*了，全部显示
			unqgz[i].weisha_06 = weisha_06;
		}
		return unqgz;
	},
	showFloateLayer : function(){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			data[i].removeClass("dn");
		};
	},
	hideFloateLayer : function(){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			data[i].addClass("dn");
		};
	},
	refreshFriendInfo : function(){
		this.hideFloateLayer(this.ui.refreshText);
		//请求原生同步通讯录
		this.tbAddressBook();
		this.showFloateLayer(this.ui.refreshText);
	},
	matchFriend : function(value){
		var txlQ = this.ui.txlInfo.regFriendList;
		var txlUQ = this.ui.txlInfo.unregFriendList;
		var fMobile = [];
		var fNameMobile = [];//由txl生成，只存储txl中的名字和电话
		var matchNameMobile = [];
		var htmlArray = [];
		for(var i = 0, len = txlQ.length; i < len; i++){
			fNameMobile.push(txlQ[i].friendName + "_1_" + i);
			fMobile.push(txlQ[i].friendMobile + "_1_" + i);
		}
		for(var i = 0, len = txlUQ.length; i < len; i++){
			fNameMobile.push(txlUQ[i].friendName + "_0_" + i);
			fMobile.push(txlUQ[i].friendMobile + "_0_" + i);
		}

		fNameMobile.push.apply(fNameMobile,fMobile);

		for(var i = 0, len = fNameMobile.length; i < len; i++){
			fNameMobile[i].replace(value, function(){
				var arg = arguments;
				(function(){
					var mArr = arg[arg.length - 1].split("_");
					htmlArray.push("<li class='" + mArr[1] + "_" + mArr[2] + "_" + mArr[0] + "'>" + mArr[0] + "</li>");//class组成： 钱罐子(1)或非钱罐子(0)_所在list的下标
				})(arg);
			});
		}
		this.ui.searList.html(htmlArray.join(""));
		this.ui.searListLi = $(".searList li");
		this.ui.searListLi.on("singleTap", $.proxy(function(e){
			this.sortLi($(e.target).attr("class"));
			return false;
		}, this));
	},
	sortLi : function(cla){
		var claArr = cla.split("_");
		var isQgz = Number(claArr[0]);
		var index = Number(claArr[1]);
		var qgz = this.ui.txlInfo.regFriendList;
		var unqgz = this.ui.txlInfo.unregFriendList;
		var del = isQgz ? qgz.splice(index,1) : unqgz.splice(index,1);
		isQgz ? qgz.unshift(del[0]) : unqgz.unshift(del[0]);

		var fInfo = {
			"qgz" : {
				"qgzList" : this.resetQgzFriendInfo(qgz)
			},
			"unqgz" : {
				"unQgzList" : this.resetUnqgzFriendInfo(unqgz)
			}
		};
		//显示“通讯录中的好友”或“未登录过钱罐子的好友”
		if(isQgz){//是钱罐子好友
			this.ui.qgzList.html(this.template.qgzFriends(fInfo.qgz));
			this.showFloateLayer(this.ui.qgzFriends,this.ui.unQgzFriends);
			this.hideFloateLayer(this.ui.postHbInfo,this.ui.searchFriends,this.ui.searchFriendLayer);
		}else{//不是钱罐子好友
			this.ui.unQgzList.html(this.template.unQgzFriends(fInfo.unqgz));
			this.showFloateLayer(this.ui.unQgzFriends);
			this.hideFloateLayer(this.ui.qgzFriends,this.ui.mysharebottom,this.ui.postHbInfo,this.ui.searchFriends,this.ui.searchFriendLayer);
		}
		//this.ui.messageInvite = $(".messageInvite");测试下 ，是否可以去掉
	}
};

loadingPage.show();
myfriends.init();