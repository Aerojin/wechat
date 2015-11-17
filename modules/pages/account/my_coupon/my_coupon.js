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
		this.ui.tyj 		= $("#lbl-tyj");
		this.ui.redPacket 	= $("#lbl-redpacket");

		this.queryString = queryString() || {};

		this.smartbar 	= smartbar.create();

		this.getData();
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
	}


};

coupon.init();