/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var smartbar		= require("ui/smartbar/smartbar");
var queryString 	= require("kit/query_string");
var moneyCny 		= require("kit/money_cny");
var tipMessage  	= require("ui/tip_message/tip_message");


var coupon = {
	init: function () {
		
		this.ui = {};
		this.ui.btnTyj		= $("#js_btn_tyj");
		this.ui.btnHbao		= $("#js_btn_hbao");
		this.ui.tyj 		= $("#js_lbl_tyj");
		this.ui.redPacket 	= $("#js_lbl_redpacket");
		this.ui.ulWrap	= $("#js_ul_wrap");

		this.queryString = queryString() || {};

		this.smartbar 	= smartbar.create();

		this.regEvent();
		this.getData();
		this.getUnreadFlag();
	},

	regEvent:function(){
		this.ui.btnHbao.on("tap",function(){
			location.replace("$root$/account/my_redpacket.html");
		});

		this.ui.btnTyj.on("tap",function(){
			location.replace("$root$/account/my_tyj.html");
		});

	},

	getData:function(){
		var options = {};

		options.data = {
			userId : user.get("userId")
		}; 

		options.success = function (e) {
			var data 	= e.data || {};

			this.ui.tyj.text(moneyCny.toYuan(data.experienceCash).toFixed(2));
			this.ui.redPacket.text(data.redPacketCount);
	 		return;
		};

		options.error = function (e) {

		};

		api.send(api.ACTIVITY, "getUserAbleReawards", options, this);
	},

	getUnreadFlag: function(){
		var options = {};

		options.data = {
			userId: user.get("userId")
		};

		options.success = function (e) {
			var result = e.data || {};

			if(result.redPackMark){
				this.ui.ulWrap.children().eq(0).addClass("active");
			}

			if(result.experienceMark){
				this.ui.ulWrap.children().eq(1).addClass("active");
			}

		};

		options.error = function (e) {

		};

		api.send(api.ACCOUNT, "getUnReadExperienceAndRedMark", options, this);
	}


};

coupon.init();