/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny	= require("kit/money_cny");
var serverTime 	= require("kit/server_time");
var waterfall 	= require("ui/waterfall/waterfall");
var smartbar	= require("ui/smartbar/smartbar");
var sliderPage	= require("ui/slider_page/slider_page");

var used 	= require("used");
var unused 	= require("unused");
var expired = require("expired");

var STATE = {
	"OVERDUE": {
		text: "已过期",
		cls: "used"
	},
	"EXCHANGED": {
		text: "已使用",
		cls: "used"
	},
	"UNEXCHANGE": {
		text: "未使用",
		cls: "unused"
	},
};

var redPacket = {
	init: function () {

		this.ui = {};
		this.ui.context = $("#context");
		this.ui.menu 	= $("#ul-menu li");
		this.ui.list 	= this.ui.context.find(".wrap-item");

		this.template	= {};
		this.template.empty  	= artTemplate.compile(__inline("empty.tmpl"));
		this.template.context  	= artTemplate.compile(__inline("context.tmpl"));

		this.smartbar = smartbar.create();

		var _this  = this;
		var format = function (data, status) {
			return _this.format(data, status);
		};

		sliderPage.create({
			activeClass: "active",
			menu: this.ui.menu,
			list: this.ui.list,
			context: this.ui.context			
		});

		unused.create({
			state: "UNEXCHANGE",
			format: format,
			template: this.template,
			container: this.ui.list.eq(0),
			padding: this.smartbar.getHeight(),
			number: this.ui.menu.eq(0).find(".number")
		});

		used.create({
			state: "EXCHANGED",
			format: format,
			template: this.template,
			container: this.ui.list.eq(1),
			padding: this.smartbar.getHeight(),
			number: this.ui.menu.eq(1).find(".number")
		});

		expired.create({
			state: "OVERDUE",
			format: format,
			template: this.template,
			container: this.ui.list.eq(2),
			padding: this.smartbar.getHeight(),
			number: this.ui.menu.eq(2).find(".number")
		});
	},

	format: function (data, fStatus) {
		for(var i = 0; i < data.length; i++){
			var result 	= data[i];
			var state 	= STATE[fStatus];
			var date 	= this.getDiffTime(result.fExpireDate, fStatus);

			result.stateCls		= state.cls;
			result.stateText   	= state.text;
			result.fName		= result.fName || "";
			result.fMoney 		= moneyCny.toYuan(result.fMoney);
			result.fOriginMoney = moneyCny.toYuan(result.fOriginMoney);
			result.expireDay 	= date.expireDay;
			result.fExpireDay 	= date.fExpireDay;

			data[i] = result;
		}

		return data;
	},

	getDiffTime: function (date, state) {
		var date2 = date.parseDate();
		var date1 = serverTime.getServerTime();		
		var diffTime = serverTime.getServerDiff(date1, date2);

		if(state != "UNEXCHANGE"){
			return {
				expireDay: 0, 
				fExpireDay: date2.format("yyyy-MM-dd")
			};
		}

		if(diffTime.day > 0){
			return {
				expireDay: diffTime.day,
				fExpireDay: diffTime.day + "天"
			};
		}

		if(diffTime.hour > 0){
			return {
				expireDay: diffTime.hour,
				fExpireDay: diffTime.hour + "个小时"
			};
		}

		if(diffTime.minute > 0){
			return {
				expireDay: diffTime.minute,
				fExpireDay: diffTime.minute + "分钟"
			};
		}

		return {
			expireDay: 0, 
			fExpireDay: date2.format("yyyy-MM-dd")
		};		
	}
};


redPacket.init();