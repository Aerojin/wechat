/**
 * @require style.css
 */
 var $ 			  	= require("zepto");
 var api 		  	= require("api/api");
 var artTemplate   	= require("artTemplate");
 var user          	= require("kit/user");
 var appApi 		= require("kit/app_api");
 var eventFactory 	= require("base/event_factory");
 var tipMessage	  	= require("ui/tip_message/tip_message");
 var moneyCny      	= require("kit/money_cny");
 var loadingPage	= require("ui/loading_page/loading_page");
 var TIPS = {
 	SYS_ERROR: "网络异常,请稍后重试",
 	TB_SUCCESS: "同步成功",
 	TB_ERROR : "同步失败"
 };

 var hongbao1 = __uri("hongbao1.png");
 var hongbao2 = __uri("hongbao2.png");
 var hongbao3 = __uri("hongbao3.png");
 var hongbao4 = __uri("hongbao4.png");
 
 var postMoney = {
 	init : function(){
 		this.ui   		     = {};
		this.ui.fixedList    = $(".fixedList");//定时红包
		this.ui.luckyList    = $(".luckyList");//手气红包
		this.ui.fixedListLi  = $(".fixedList li");//定时红包
		this.ui.chbP         = $(".chbP");
		this.ui.chbS         = $(".chbS");
		this.ui.hbTip        = $(".hbTip");
		this.ui.luckyTip     = $(".luckyTip");
		this.ui.fixedTip     = $(".fixedTip");
		this.ui.sqTip        = $(".sqTip");
		this.ui.androidTip   = $(".androidTip");
		this.ui.iosTip       = $(".iosTip");
		this.ui.goStart      = $(".goStart");
		this.ui.floateLayer  = $(".floateLayer");
		this.ui.chb          = $(".chb");
		this.ui.chbD         = $(".chbD");
		this.ui.noHb         = $(".noHb");
		this.ui.cantChb0     = $(".cantChb0");
		this.ui.cantChb1     = $(".cantChb1");
		this.ui.chbLeftTime  = $(".chbLeftTime");
		this.ui.monthText    = $(".monthText");
		this.ui.tbList       = $(".tbList");
		this.ui.fdshb        = $(".fdshb");
		this.ui.fsqhb        = $(".fsqhb");
		this.ui.leftTime     = $(".leftTime");
		this.ui.doChb        = $(".doChb");
		this.ui.textBox      = $(".text_box");
		this.ui.sllow        = $(".sllow");
		this.ui.fixedHistory = $(".fixedHistory");
		this.ui.otherLucky   = $(".otherLucky");
		this.ui.goInvest     = $(".goInvest");
		this.ui.sllowNone    = $(".sllowNone");
		this.ui.clickGetMore = $(".clickGetMore");
		this.ui.emptyLucky   = $(".emptyLucky");
		this.ui.deleteText   = $(".deleteText");

		this.cont      = {};
		this.cont.chbS = {
			"chbSL" : "给你带来了红包",
			"chbSF" : "好友定时红包"
		};

		this.tb               = false; //是否同步通讯录
		this.fixedId          = "";//定时红包id
		this.luckyId          = [];//手气红包id
		this.luckyNum         = [];//本人领取红包情况
		this.isGotFixed       = 0;//是否领取过好友定时红包
		this.hbFixedCash      = 0;//好友定时红包总金额
		this.isGotLucky       = [];//记录好友手气红包列表的拆取状态：1、为拆取，2、已拆，3、已过期
		this.currentLi        = -1;//用来标识点击的哪个li
		this.hbLuckyStatus    = [1,2,3,4,5,6];//手气红包状态：1、为领完且未拆开。2、为领完且已拆开。3、已领完且手慢了。4、已领完且已领取。5、已过期且手慢了。6、已过期且已领取。
		this.fixedEndTime     = "";//定时红包截止领取时间
		this.isSyncPhonebook  = false;//是否同步过通讯录
		this.pageIndex        = 1;//第几页
		this.pageSize         = 10;//每页显示条数
		this.pageCount        = 1;//总页数
		
		this.template           = {};
		this.template.fixedInfo = artTemplate.compile(__inline("fixedInfo.tmpl"));
		this.template.luckyInfo = artTemplate.compile(__inline("luckyInfo.tmpl"));
		this.template.empty     = artTemplate.compile(__inline("empty.tmpl"));

		this.refreshPage();
		this.initEvent();
	},
	initEvent : function(){
		this.ui.tbList.on("singleTap", $.proxy(function(){
			this.tbAddressBook();
			return false;
		},this));
		this.ui.floateLayer.on("singleTap", function(){
			return false;
		});
		this.ui.androidTip.on("singleTap", $.proxy(function(){
			this.hideFloateLayer(this.ui.floateLayer,this.ui.sqTip,this.ui.androidTip);
			return false;
		},this));
		this.ui.fdshb.on("singleTap", $.proxy(function(){
			this.showFloateLayer(this.ui.floateLayer,this.ui.hbTip,this.ui.fixedTip);
			return false;
		},this));
		this.ui.fsqhb.on("singleTap", $.proxy(function(){
			this.showFloateLayer(this.ui.floateLayer,this.ui.hbTip,this.ui.luckyTip);
			return false;
		},this));
		this.ui.hbTip.on("singleTap", $.proxy(function(){
			this.hideFloateLayer(this.ui.floateLayer,this.ui.hbTip,this.ui.luckyTip,this.ui.fixedTip);
			return false;
		},this));
		this.ui.clickGetMore.on("singleTap", $.proxy(function(){
			this.queryLuckyInfo();
			return false;
		},this));
	},
	regEvent : function(){
		this.ui.fixedListLi.on("singleTap",$.proxy(function(e){
			if(!this.tb){
				return false;
			}
			this.showChbFixedHb();
			return false;
		},this));
		this.ui.luckyListLi.on("singleTap",$.proxy(function(e){
			if(!this.tb){
				return false;
			}
			var index = -1;
			($(e.target).parent("ul").length != 0) && (index = $(e.target).index());
			(index == -1) && (index = $(e.target).parent("li").index());
			(index == -1) && (index = $(e.target).parent().parent("li").index());
			this.showChbLuckyHb(index);
			return false;
		},this));
		this.ui.chb.on("singleTap",$.proxy(function(e){
			this.hideFloateLayer(this.ui.floateLayer,this.ui.chb,this.ui.textBox);
			return false;
		},this));
		this.ui.doChb.on("singleTap",$.proxy(function(e){
			this.ui.doChb.addClass("rotate-pack cha_bg_x");
			this.ui.deleteText.text("");
			var currentText = "";
			var siblingDiv = $(e.target).siblings();
			siblingDiv && (currentText = $(siblingDiv).children(".chbS").text());
			(currentText == this.cont.chbS.chbSF) ? (this.doChbFixedAction()) : (this.doChbLuckyAction());
			return false;
		},this));
		this.ui.fixedHistory.on("singleTap",$.proxy(function(e){
			//发送查看定时红包历史请求
			var p = {
				"redpaperId" : this.fixedId
			};
			this.fixedHistoryUrl(p);
			return false;
		},this));
		this.ui.otherLucky.on("singleTap",$.proxy(function(e){
			//发送查看大家的手气请求
			var p = {
				redId : this.luckyId[this.currentLi]
			};
			this.luckyHistoryUrl(p);
			return false;
		},this));
		this.ui.goInvest.on("singleTap", function(){
			window.location.href = appApi.getProductList({type: 3});
		});
	},
	refreshPage : function(){
		this.queryFixedInfo();
	},
	queryFixedInfo : function(){
		var options = {
			data : {}
		};
		options.success = function(e){
			var result = e.data;
			this.showFixedInfo(result || {});

			loadingPage.hide();
		};
		options.error = function(e){
			loadingPage.hide();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "getHbInfo", options, this);//需要在api中增加请求
	},
	showFixedInfo : function(result){
		this.isSyncPhonebook = result.isSyncPhonebook;
		if(!result.isSyncPhonebook){
			return;
		}
		var fix = result.timingRedPacket;
		var hbInfo = {
			"fixed" : {
				"hongbao4" : hongbao4,
				"isGotFixed" : fix.status,
				"fcounts" : fix.redpaperRechangeNum,
				"leftTime" : this.getLeftTime(fix.systemTime,fix.endTime),
				"isStart" : this.getLeftTime(fix.systemTime,fix.startTime),
				"hbDate" : this.formatDate(fix.endTime)
			}
		};

		this.setGotFixedStatus(result);

		if(this.tb){
			this.ui.fixedList.html(this.template.fixedInfo(hbInfo.fixed));
			this.ui.hbMonth        = $(".hbMonth");
			this.ui.fixedListLi    = $(".fixedList li");//定时红包

			this.queryLuckyInfo();
		}
	},
	queryLuckyInfo : function(){
		var index = this.pageIndex;
		var options = {
			data : {
				"pageIndex" : index,
				"pageSize" : this.pageSize
			}
		};
		options.success = function(e){
			var result = e.data;
			this.showLuckyInfo(result || {});
		};
		options.error = function(e){
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay : 2000});
		};

		api.send(api.ACTIVITY, "queryLuckRedPacket", options, this);//需要在api中增加请求
	},
	showLuckyInfo : function(result){
		if(!this.isSyncPhonebook){
			return;
		}

		var data = this.formatLuck(result.list);
		this.setGotLuckyStatus(data);

		if(data.length > 0){	
			this.hideFloateLayer(this.ui.tbList);
			//加载到最后一页则不显示点击加载更多
			this.pageIndex >= result.pageCount ? this.hideFloateLayer(this.ui.clickGetMore) : this.showFloateLayer(this.ui.clickGetMore);
			this.pageIndex == 1 ? this.ui.luckyList.html(this.template.luckyInfo({"luckyDatas": data})) : this.ui.luckyList.append(this.template.luckyInfo({"luckyDatas": data}));
			this.pageIndex++;

 			this.ui.luckyListLi = $(".luckyList li");//手气红包

 			this.regEvent();
	 		return;
 		}

 		this.showEmptyLuckyInfo();
	},
	formatLuck : function(lucky){
		for(var i = 0,len = lucky.length; i < len; i++){
			lucky[i].hbDate = lucky[i].initDate.substring(5,10);
			lucky[i].hbCash = moneyCny.toYuan(lucky[i].money,2);
			lucky[i].hongbao1 = hongbao1;
			lucky[i].hongbao2 = hongbao2;
			lucky[i].hongbao3 = hongbao3;
			lucky[i].shareName = lucky[i].shartName || "";
			(lucky[i].shareName == "") && (lucky[i].shareName = lucky[i].shartUserMobile);
			(lucky[i].shartPrivacy == 1 || lucky[i].shareName == "") && (lucky[i].shareName = "匿名好友");
			(lucky[i].shartRedpaperType == 1) ? (lucky[i].hbCash = lucky[i].hbCash + "元现金") : (lucky[i].hbCash = lucky[i].hbCash + "元投资返现红包");
		}
		return lucky;
	},
	showEmptyLuckyInfo : function(){
		this.ui.luckyList.empty().append(this.template.empty({"hongbao3":hongbao3}));
	},
	showFloateLayer : function(){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			$(data[i]).removeClass("dn");
		};
	},
	hideFloateLayer : function(){
		var data = arguments;
		for (var i = 0, len = data.length; i < len; i++) {
			$(data[i]).addClass("dn");
		};
	},
	showChbFixedHb : function(){
		(this.isGotFixed == 1 && this.isStart == "0天0时0分") ? this.notGotFixedHb() : this.showChbLeftTime();
	},
	notGotFixedHb : function(){
		this.hasFixedHb ? this.setHbFloate(this.ui.chbD,this.cont.chbS.chbSF) : this.setHbFloate(this.ui.cantChb0,this.cont.chbS.chbSF);
	},
	showChbLuckyHb : function(index){
		//手气红包状态：1、为领完且未拆开。2、为领完且已拆开。3、已领完且手慢了。4、已领完且已领取。5、已过期。
		this.currentLi = index;//用来标识点击的哪个li
		if(this.isGotLucky[index] == this.hbLuckyStatus[0]){//未拆取
			this.setHbFloate(this.ui.chbD,this.cont.chbS.chbSL,index);
			return;
		}
		if(this.isGotLucky[index] == this.hbLuckyStatus[1]){//未领完且已拆开
			var p = {
				redId : this.luckyId[index]
			};
			this.luckyUrl(p);
			return;
		}
		if(this.isGotLucky[index] == this.hbLuckyStatus[2]){//已领完且手慢了
			this.setHbFloate(this.ui.sllowNone,this.cont.chbS.chbSL,index);
			return;
		}
		if(this.isGotLucky[index] == this.hbLuckyStatus[3]){//已领完且已领取
			var p = {
				redId : this.luckyId[index]
			};
			this.luckyUrl(p);
			return;
		}
		if(this.isGotLucky[index] == this.hbLuckyStatus[4]){//已过期且手慢了
			this.setHbFloate(this.ui.sllow,this.cont.chbS.chbSL,index);
			return;
		}
		if(this.isGotLucky[index] == this.hbLuckyStatus[5]){//已过期且已领取
			var p = {
				redId : this.luckyId[index]
			};
			this.luckyUrl(p);
			return;
		}
	},
	showChbLeftTime : function(){
		this.ui.leftTime.text(this.ui.hbMonth.text());
		this.showFloateLayer(this.ui.floateLayer,this.ui.chb,this.ui.chbLeftTime);
	},
	setHbFloate : function(context,text,index){
		this.ui.chbP.text(this.ui.hbMonth.text());
		(index >= 0) && (this.ui.chbP.text(this.ui.luckyListLi.eq(index).children("p").children(".luckyShareName").text()));
		this.ui.chbS.text(text);
		this.showFloateLayer(this.ui.floateLayer,this.ui.chb,context);
	},
	setGotFixedStatus : function(result){
		var fixed = result.timingRedPacket;
		this.tb = result.isSyncPhonebook;//true=已同步|false=未同步
		this.fixedId = fixed.id;
		this.isGotFixed = fixed.status;
		this.isStart = this.getLeftTime(fixed.systemTime,fixed.startTime);
		this.hasFixedHb = fixed.redpaperRechangeNum;
		this.fixedEndTime = fixed.endTime;
	},
	setGotLuckyStatus : function(result){
		var lucky = result;
		for (var i = 0, len = lucky.length; i < len; i++) {
			this.luckyId.push(lucky[i].id);
			var n = lucky[i].num;
			var s = lucky[i].status;
			var c = lucky[i].count;
			if(s == 1){
				if(n == 0){
					if(c == 0){
						this.isGotLucky.push(3);
					}else{
						this.isGotLucky.push(1);
					}
				}else if(n == 1){
					this.isGotLucky.push(2);
				}
			}else if(s == 2){
				if(n == 0){
					this.isGotLucky.push(3);
				}else if(n == 1){
					this.isGotLucky.push(4);
				}
			}else if(s ==3){
				if(n == 0){
					this.isGotLucky.push(5);
				}else if(n == 1){
					this.isGotLucky.push(6);
				}
			}
		}
	},
	doChbFixedAction : function(){
		//发送一个返回拆红包结果的请求：在投金额不够、拆成功
		var options = {
			data : {
				"redpaperId" : this.fixedId
			}
		};
		options.success = function(e){
			this.deleteChb();
			var fixid = this.fixedId;
			var base = e.data.timingRedPacket;
			var p = {
				"redId" : fixid,
				"hbDate" : base.recevieTime,
	 			"hbMoney" : base.money
			};
			postMoney.fixedUrl(p);
		};
		options.error = function(e){
			this.deleteChb();
			//投资金额不足100                                                           
			(e.code == 610106) && (this.setHbFloate(this.ui.cantChb1,this.cont.chbS.chbSF));
		};

		api.send(api.ACTIVITY, "getFixedHbInfo", options, this);
	},
	doChbLuckyAction : function(){
		//发送一个返回拆红包结果的请求：在投金额不够、手慢了、拆成功
		var options = {
			data : {
				"friendRelationId" : this.luckyId[this.currentLi]
			}
		};
		options.success = function(e){
			this.deleteChb();
			if(e.data.luckRedPacketReceive.money == 0){//红包已领完
				this.setHbFloate(this.ui.noHb,this.cont.chbS.chbSL,this.currentLi);
				return;
			}
			var p = {
				"redId" : this.luckyId[this.currentLi]
			};
			postMoney.luckyUrl(p);  
		};
		options.error = function(e){
			this.deleteChb();
			//投资金额不足100
			if(e.code == 610106){
				this.setHbFloate(this.ui.cantChb1,this.cont.chbS.chbSL,this.currentLi);
			}
			//红包已领完
			if(e.code == 610101){
				this.setHbFloate(this.ui.noHb,this.cont.chbS.chbSL,this.currentLi);
			}
		};

		api.send(api.ACTIVITY, "getLuckyHbInfo", options, this);//需要在api中增加请求
	},
	fixedUrl : function(){
		var url = "$root$/activity/relationRedpacket/fixedInfo.html";
		arguments && (url = url + "?" + $.param(arguments));
		window.location.href = url;
	},
	luckyUrl : function(){
		var url = "$root$/activity/relationRedpacket/luckyInfo.html";
		arguments && (url = url + "?" + $.param(arguments));
		window.location.href = url;
	},
	fixedHistoryUrl : function(){
		var url = "$root$/activity/relationRedpacket/fixedInfoHistory.html";
		arguments && (url = url + "?" + $.param(arguments));
		window.location.href = url;
	},
	luckyHistoryUrl : function(){
		var url = "$root$/activity/relationRedpacket/luckyInfoHistory.html";
		arguments && (url = url + "?" + $.param(arguments));
		window.location.href = url;
	},
	tbAddressBook : function(){
		window.backPostMoneyFunction = function(data){
			data = JSON.parse(data);
			if(data.code == 0){
				tipMessage.show(TIPS.TB_SUCCESS, {delay : 2000});
				postMoney.refreshPage();
			}else{
				tipMessage.show(TIPS.TB_ERROR, {delay : 2000});
			}
			window.backFunction = null;
		};
		window.location.href = "xiaoniuapp://syncAddressBook?callback=backPostMoneyFunction";
	},
	getLeftTime : function(start,end){
		var startTime = new Date(start.replace(/-/g,"/")).getTime();
		var endTime = new Date(end.replace(/-/g,"/")).getTime();
		var date3 = endTime - startTime;
		if(date3 <= 0 ){
			return "0天0时0分";
		}

		//计算出相差天数
		var days = Math.floor(date3/(24*3600*1000));
		 
		//计算出小时数
		var leave1 = date3%(24*3600*1000);    //计算天数后剩余的毫秒数
		var hours = Math.floor(leave1/(3600*1000));
		 
		//计算相差分钟数
		var leave2 = leave1%(3600*1000);  //计算小时数后剩余的毫秒数
		var minutes = Math.floor(leave2/(60*1000));

		return days + "天" + hours + "时" + minutes + "分";
	},
	formatDate : function(dateString){
		if(!dateString){
			return "";
		}
		var dateResult = "";
		dateString.replace(/(\d{4})-(\d{2})/g, function(a,b,c){
			dateResult = b + "年" + c + "月";
		});
		return dateResult;
	},
	deleteChb : function(){
		this.ui.doChb.removeClass("rotate-pack cha_bg_x");
		this.ui.deleteText.text("拆红包");
		this.hideFloateLayer(this.ui.floateLayer,this.ui.chb,this.ui.textBox);
	}
};

loadingPage.show();

postMoney.init();