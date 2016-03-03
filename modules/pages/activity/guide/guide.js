/**
 * @require style.css
 */
 var $ 			  	= require("zepto");
 var api 		  	= require("api/api");
 var artTemplate   	= require("artTemplate");
 var versions 		= require("base/versions");
 var user          	= require("kit/user");
 var appApi 		= require("kit/app_api");
 var idCardValidate = require("kit/idcard_validate");
 var tipMessage	  	= require("ui/tip_message/tip_message");
 var moneyCny      	= require("kit/money_cny");
 var timebar        = require("timebar.js");
 var queryString    = require("kit/query_string");
 var loadingPage	= require("ui/loading_page/loading_page");
 var TIPS = {
 	SYS_ERROR: "网络异常,请稍后重试",
 	SAVE_SUCCESS : "保存成功",
 	SAVE_ERROR : "保存失败"
 };

 var guide = {
 	init : function(){
 		this.ui                = {};
 		this.ui.privilegeId    = $("#privilegeId");
 		this.ui.lefttime       = $(".lefttime");
 		this.ui.toInvest       = $(".toInvest");
 		this.ui.nofinish1      = $(".nofinish1");
 		this.ui.nofinish2      = $(".nofinish2");
 		this.ui.nofinish3      = $(".nofinish3");
 		this.ui.gotRedpaper1   = $(".gotRedpaper1");
 		this.ui.gotRedpaper2   = $(".gotRedpaper2");
 		this.ui.gotRedpaper3   = $(".gotRedpaper3");
 		this.ui.floatBox       = $(".floatBox");
 		this.ui.guideHb        = $(".guideHb");
 		this.ui.guideCash      = $(".guideCash");
 		this.ui.improveInfo    = $(".improveInfo");
 		this.ui.toGuanzhu      = $(".toGuanzhu");
 		this.ui.cashMoney      = $("#cashMoney");
 		this.ui.hbMoney        = $("#hbMoney");
 		this.ui.submitUserInfo = $(".submitUserInfo");
 		this.ui.txtName        = $("#txtName");
 		this.ui.txtIdCard      = $("#txtIdCard");
 		this.ui.msgBox         = $(".msg_box");
 		this.ui.bindWX         = $(".bindWX");
 		this.ui.redBox1        = $(".redBox1");
 		this.ui.redBox2        = $(".redBox2");
 		this.ui.redBox3        = $(".redBox3");
 		this.ui.redBox4        = $(".redBox4");
 		this.ui.nextText       = $(".nextText");
 		this.ui.jindu          = $(".jindu");
 		this.ui.doneBind       = $("#doneBind");
 		this.ui.ok             = $(".ok");

 		this.myURL             = window.location.origin + "/pages/activity/guide/index.html";
		this.vipU              = window.location.origin + "/pages/vip/vip.html";
		this.appLoginU         = appApi.getLogin();//app登录链接
		this.wxLoginU          = window.location.origin + "/pages/user/login.html?redirect=" + encodeURIComponent(this.myURL);//微信版钱罐子登录链接
		this.wxBindcardU       = window.location.origin + "/pages/account/accreditation.html";
		this.investU           = window.location.origin + "/pages/product/product_detail.html?fid=378eeca3-81fd-48bb-a1ee-880f25c9c57e";
		this.buttonStatusText  = ["未完成","领奖励","已领取"];//每个button可能的状态
		this.buttonStatus      = [0,1,2,3];//每个button可能的三种状态(未完成，可领取，已完成，已完成第四步但是不能领取红包)
		this.stepStatus        = [];//五个阶段（注册、完善个人信息、绑卡、投资、礼包）的状态
		this.stepAwardMoney    = [];//五个阶段（注册、完善个人信息、绑卡、投资、礼包）的奖品金额
		this.stepAwardText     = [];//五个阶段（注册、完善个人信息、绑卡、投资、礼包）的中奖文案
		this.stepText          = ["注册","完善信息","绑卡充值","投资"];
		this.endStep           = 5;//共5个阶段
		this.vipLevel          = 0;//会员等级,大于0即绑定过微信
	
		this.userId            = user.get("userId") || "";
		this.token             = user.get("token") || "";
		this.queryString       = queryString();
		//this.isBindCard 	   = user.get("bindCard");
		//this.isAuthentication  = user.get("authentication");
		this.isWX              = versions.isWebChat();
		this.isDL              = this.isLogin();
		this.tmpNow            = 0;//记录页面第一次刷新时的当前时间

		this.isDL ? this.refreshPage() : loadingPage.hide();
		this.regEvent();
 	},
 	regEvent : function(){
 		this.ui.privilegeId.on("singleTap", $.proxy(function(){
 			window.location.href = this.vipU;
 			return false;
 		},this));
 		this.ui.nofinish1.on("singleTap", $.proxy(function(){//未完成状态
 			this.stepStatus[0] == this.buttonStatus[0] ? (this.toLogin()) : (this.postHb(1));//获取红包信息时就可以给用户发红包了。
 			return false;
 		},this));
 		this.ui.nofinish2.on("singleTap", $.proxy(function(){
 			if(!this.isDL){
 				this.toLogin();
 				return false;
 			}
 			this.ui.txtName.val("");
 			this.ui.txtIdCard.val("");
 			this.stepStatus[1] == this.buttonStatus[0] ? (this.showFloateLayer(this.ui.floatBox,this.ui.improveInfo)) : (this.postHb(2));
 			return false;
 		},this));
 		this.ui.nofinish3.on("singleTap", $.proxy(function(){
 			if(!this.isDL){
 				this.toLogin();
 				return false;
 			}
 			this.stepStatus[2] == this.buttonStatus[0] ? (this.toBindCard()) : (this.postHb(3));
 			return false;
 		},this));
 		this.ui.toInvest.on("singleTap", $.proxy(function(){
 			if(!this.isDL){
 				this.toLogin();
 				return false;
 			}
 			window.location.href = this.investU;
 			return false;
 		},this));
 		this.ui.lefttime.on("singleTap", $.proxy(function(){
	 		(this.stepStatus[4] == this.buttonStatus[1]) && this.postHb(5);
 			return false;
 		},this));
 		this.ui.redBox1.on("singleTap", $.proxy(function(){
 			(this.stepStatus[0] == this.buttonStatus[1]) && this.postHb(1);//红包在可领取时
 			return false;
 		},this));
 		this.ui.redBox2.on("singleTap", $.proxy(function(){
 			(this.stepStatus[1] == this.buttonStatus[1]) && this.postHb(2);
 			return false;
 		},this));
 		this.ui.redBox3.on("singleTap", $.proxy(function(){
 			(this.stepStatus[2] == this.buttonStatus[1]) && this.postHb(3);
 			return false;
 		},this));
 		this.ui.redBox4.on("singleTap", $.proxy(function(){
 			(this.stepStatus[3] == this.buttonStatus[1]) && this.postHb(4);
 			return false;
 		},this));
 		this.ui.bindWX.on("singleTap", $.proxy(function(){
 			if(!this.isDL){
 				this.toLogin();
 				return false;
 			}
 			if(this.vipLevel > 0){
 				return false;
 			}
 			this.isWX ? this.showFloateLayer(this.ui.floatBox,this.ui.toGuanzhu) : (window.location.href = "xiaoniuapp://fellowWechat?wechatId=xn-qianguanzi");
 			return false;
 		},this));
 		this.ui.ok.on("singleTap", $.proxy(function(){
 			this.hideFloateLayer(this.ui.floatBox,this.ui.msgBox);
 			return false;
 		},this));
 		this.ui.submitUserInfo.on("singleTap",$.proxy(function(){
 			this.submitIdentityInfo();
 			this.hideFloateLayer(this.ui.floatBox,this.ui.msgBox);
 			return false;
 		},this));
 		// this.ui.txtName.on("input",$.proxy(function(){
 		// 	this.ui.txtName.val(this.ui.txtName.val().replace(/\d/,""));
 		// 	return false;
 		// },this));
 	},
 	refreshPage : function(){
 		var options = {
		 	data : {}
		 };
		 options.success = function(e){
		 	var result = e.data;
			this.showPageInfo(result || {});

		 	loadingPage.hide();
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getGuideInfo", options, this);
 	},
 	showPageInfo : function(result){
 		//第一个请求，初始化信息
 		this.stepStatus = [];
 		this.stepStatus.push(result.userRegisterStatus);
 		this.stepStatus.push(result.userInfoStatus);
 		this.stepStatus.push(result.userBindCardStatus);
 		this.stepStatus.push(result.userInvestStatus);
 		this.stepStatus.push(result.cashAwardStatus);
 		this.vipLevel = result.userLevel;

 		//用户当前完成的阶段
	    var userCurrentStep = 0;
 		var status = this.stepStatus;
 		var bStatus = this.buttonStatus;
 		var registerTime = result.userRegTime;
 		var now = new Date(result.systemNowTime.replace(/-/g,"/")).getTime();
 		this.tmpNow = now;
 		var leftTimeText = this.getLeftTime(registerTime,now);//剩余时间
 		for(var i = 0,len = status.length; i < len; i++){
			//该阶段不为未完成
			(status[i] > bStatus[0]) && (userCurrentStep = i);//从0开始,即0、1、2、3、4。
 		}
 		
 		//1、倒计时：
 			//a.未登录：展示暗色礼包,//初始化的样式
		    //b.已登录且已过时：00:00:00,
		    //c.已登录且四个阶段未完成且未过时：22:22:22,
		    //d.已登录且四个阶段已完成且未过时：展示亮色礼包,
            //e.已登录且五个阶段已完成：展示暗色礼包
        if(status[4] == bStatus[2]){//e,注：老用户的第五步的状态一直都是未完成
        	this.ui.lefttime.text("").addClass("no_bgimgshow").removeClass("bgimgshow");
        }else if(status[4] == bStatus[1]){//status[3] == bStatus[2] && leftTimeText != "00:00:00"){//d
        	this.ui.lefttime.text("").addClass("bgimgshow").removeClass("no_bgimgshow");
        }else if(leftTimeText == "00:00:00"){//b
        	this.ui.lefttime.text("00:00:00");
        }else if(status[3] != bStatus[1] && leftTimeText != "00:00:00"){//c.
        	var currentT = now;
        	this.intervalNum && clearInterval(this.intervalNum);
        	var interval = setInterval(function(){
        		var leftTimeT = guide.getLeftTime(registerTime,currentT);
        		guide.ui.lefttime.text(leftTimeT).removeClass("no_bgimgshow bgimgshow");
        		currentT = currentT + 1000;
        	},1000);
        	this.intervalNum = interval;
        }
        var intervalTime = leftTimeText.split(":");
    	var leftTimeBar = parseInt(intervalTime[0]) * 60 + parseInt(intervalTime[1]);
    	timebar.create({"minutes" : leftTimeBar});

        //2、进度条
	    //下一步要完成的阶段
		var nextStep = userCurrentStep + 1;//1、2、3、4、5
		this.ui.jindu.removeClass("ativeshow");
		if(nextStep < (this.endStep - 1)){//进度指针，只要前4个任务做完即可
			this.ui.nextText.text(this.stepText[nextStep]);
			$(this.ui.jindu[nextStep]).addClass("ativeshow");
		}

		for(var i = 0; i <= userCurrentStep; i++){//进度样式
			$(this.ui.jindu[i]) && $(this.ui.jindu[i]).addClass("hvoer"); 
		}

 		//3、注册阶段//4、完善阶段//5、绑卡阶段//6、投资阶段
		for(var i = 1,len = this.endStep; i < len; i++){
			if(status[i - 1] == bStatus[0]){//未完成
 				$(".redBox" + i).addClass("red_box1").removeClass("red_box2 red_box3");;
 				$("#redMoney" + i).text("");
 				continue;
 			}
 			if(status[i - 1] == bStatus[1]){//可领取
 				$(".color" + i).addClass("hover");
 				$(".redBox" + i).addClass("red_box2").removeClass("red_box1 red_box3");
 				$(".nofinish" + i) && $(".nofinish" + i).text("可领取");
 				continue;
 			}
 			if(status[i - 1] == bStatus[2]){//已完成
 				$(".color" + i).addClass("hover");
 				$(".redBox" + i).addClass("red_box3").removeClass("red_box1 red_box2");
 				$(".nofinish" + i) && $(".nofinish" + i).addClass("dn");
 				$(".gotRedpaper" + i) && $(".gotRedpaper" + i).removeClass("dn");
 				continue;
 			}
 			if(status[i - 1] == bStatus[3]){//已完成但不可领取红包（只是投资了活期产品）
 				$(".color" + i).addClass("hover");
 				$(".redBox" + i).addClass("red_box1").removeClass("red_box2 red_box3");
 				//$(".nofinish" + i) && $(".nofinish" + i).addClass("dn");
 				//$(".gotRedpaper" + i) && $(".gotRedpaper" + i).removeClass("dn");
 				continue;
 			}
		}
		
		//第二个请求,获取各个阶段的奖品金额、中奖信息
		this.getGuideHbInfo();

 		//8、微信按钮是否变灰
 		if(this.vipLevel > 0){
 			this.ui.bindWX.text("已绑定");
 			this.ui.doneBind.addClass("xinhuibtn");
 		}else{
 			this.ui.doneBind.removeClass("xinhuibtn");
 		}
 	},
 	getGuideHbInfo : function(){//查询新手奖励红包信息
 		var options = {
			data : {}
		};
		options.success = function(e){
			var result = e.data;
			this.showMoneyInfo(result || {});
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getGuideHbInfo", options, this);
 	},
 	showMoneyInfo : function(result){
 		var hb = result.userGuideStepSettings || [];
 		this.stepAwardMoney = [];
 		this.stepAwardText = [];
 		for(var i = 0,len = hb.length; i < len; i++){
			this.stepAwardMoney.push(moneyCny.toYuan(hb[i].prizeValue));
			this.stepAwardText.push(hb[i].prizeDesc);
		}

		//7、显示可领取和已领取的红包金额
		for(var i = 1,len = this.endStep; i < len; i++){
			//可领取 已完成
			(this.stepStatus[i - 1] != this.buttonStatus[0] && this.stepStatus[i - 1] != this.buttonStatus[3]) && $("#redMoney" + i).text(this.stepAwardMoney[i - 1]);
		}
 	},
 	getLeftTime : function(regTime,currentTime){
		var startTime = new Date(regTime.replace(/-/g,"/")).getTime();
		var endTime = startTime + 24 * 3600 * 1000;
		var now = currentTime;//new Date(currentTime.replace(/-/g,"/")).getTime();
		var date3 = endTime - now;
		if(startTime > this.tmpNow){//兼容注册时间迟于系统当前时间的情况
			endTime = this.tmpNow + 24 * 3600 * 1000;
			date3 = endTime - now - 1000;
		}

		if(date3 <= 0 ){
			return "00:00:00";
		}
		 
		//计算出小时数
		var leave1 = date3%(24*3600*1000);    //计算天数后剩余的毫秒数
		var hours = Math.floor(leave1/(3600*1000));
		hours = hours > 9 ? hours : ("0" + hours);
		 
		//计算相差分钟数
		var leave2 = leave1%(3600*1000);  //计算小时数后剩余的毫秒数
		var minutes = Math.floor(leave2/(60*1000));
		minutes = minutes > 9 ? minutes : ("0" + minutes);
		
		//计算相差秒数
		var leave3 = leave2%(60*1000);  //计算分钟数后剩余的毫秒数
		var seconds = Math.round(leave3/1000);
		seconds = seconds > 9 ? seconds : ("0" + seconds);

		return hours+ ":" + minutes + ":" + seconds;
	},
	showGiftLayer : function(step){
		this.ui.cashMoney.text(this.stepAwardText[step - 1]);
		this.showFloateLayer(this.ui.floatBox,this.ui.guideCash);
	},
	showRedpaperLayer : function(step){//显示红包浮层
		this.ui.hbMoney.text(this.stepAwardText[step - 1]);
		this.showFloateLayer(this.ui.floatBox,this.ui.guideHb);
	},
	postHb : function(step){
		var options = {};

		options.data = {
			"step" : step
		};

		options.success = function (e) {
			step == this.endStep ? this.showGiftLayer(step) : this.showRedpaperLayer(step);
			this.refreshPage();
		};

		options.error = function (e) {
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 1800});
		};

		api.send(api.ACTIVITY,"postHbInfo", options, this);
	},
	submitIdentityInfo : function(){
		var options = {};

		if(!this.checkUserInputInfo()){
			return;
		}

		options.data = {
			userName: this.ui.txtName.val().trim(),
			userCardNO: this.ui.txtIdCard.val().trim(),
			step:2
		};

		options.success = function (e) {
			this.refreshPage();
			tipMessage.show(TIPS.SAVE_SUCCESS, {delay: 1800});
		};


		options.error = function (e) {
			tipMessage.show(e.msg || TIPS.SAVE_ERROR, {delay: 1800});
		};

		api.send(api.ACTIVITY,"updateIdentityInfo", options, this);
	},
	toBindCard : function(){
		//window.location.href = this.wxBindcardU;//开发环境用
		this.isWX ? (window.location.href = this.wxBindcardU) : (window.location.href = "xiaoniuapp://recharge");//测试环境用
		//(this.isBindCard || this.isAuthentication) ? this.refreshPage() : tipMessage.show("绑卡失败", {delay: 2000});
	},
	checkUserInputInfo : function(){
		var name = this.ui.txtName.val().trim();
		var card = this.ui.txtIdCard.val().trim();
		if(name == ""){
			tipMessage.show("姓名不能为空", {delay: 2000});
			return false;
		}

		if(!idCardValidate(card)){
			tipMessage.show("身份证格式错误", {delay: 2000});
			return false;
		}

		return true;
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
	toLogin : function(){
		this.isWX ? (window.location.href = this.wxLoginU) : (window.location.href = this.appLoginU);
	},
	isLogin : function(){
		if(this.isWX){
			return this.userId && this.token ? true : false;
		}else{
			return this.queryString.userId && this.queryString.token ? true : false;
		}
	}
 };

loadingPage.show();

guide.init();

window.appInit = function(loginInfo){
	loginInfo = JSON.parse(loginInfo);
	loginInfo.code == 0 ? guide.init() : console.log("登录失败，原因是：" + loginInfo.msg);//登录成功
};
