/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny	= require("kit/money_cny");
var validate 	= require("kit/validate");
var serverTime 	= require("kit/server_time");
var queryString = require("kit/query_string");
var waterfall 	= require("ui/waterfall/waterfall");
var smartbar	= require("ui/smartbar/smartbar");
var sliderPage	= require("ui/slider_page/slider_page");

var used 	= require("used");
var unused 	= require("unused");
var expired = require("expired");


var STATE = {
	"overdue": {
		text: "已过期",
		cls: "hasUsed"
	},
	"used": {
		text: "已使用",
		cls: "hasUsed"
	},
	"unused": {
		text: "未使用",
		cls: ""
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
		
		this.queryString = queryString() || {};	
		this.smartbar 	 = smartbar.create();

		var _this  = this;
		var format = function (data, status) {
			return _this.format(data, status);
		};

		this.ui.sliderPage = sliderPage.create({
			activeClass: "active",
			menu: this.ui.menu,
			list: this.ui.list,
			context: this.ui.context			
		});


		var sliderIndex = this.queryString.sliderIndex || 0;
		this.ui.sliderPage.setIndex(sliderIndex);

		unused.create({
			state: "unused",
			format: format,
			template: this.template,
			container: this.ui.list.eq(0),
			padding: this.smartbar.getHeight(),
			number: this.ui.menu.eq(0).find(".number")
		});

		used.create({
			state: "used",
			format: format,
			template: this.template,
			container: this.ui.list.eq(1),
			padding: this.smartbar.getHeight(),
			number: this.ui.menu.eq(1).find(".number")
		});

		expired.create({
			state: "overdue",
			format: format,
			template: this.template,
			container: this.ui.list.eq(2),
			padding: this.smartbar.getHeight(),
			number: this.ui.menu.eq(2).find(".number")
		});
	},

	format: function (data, fStatus) {
		var startDate 	= null;
		var endDate   	= null;
		var income		= null;
		var fExpCash 	= null;
		var fDate		= { };
		var state 		= STATE[fStatus];

		for(var i = 0; i < data.length; i++){
			var result 	= data[i];

			if(!validate.isEmpty(result.expireDate)){
				fDate = this.getDiffTime(result.expireDate, fStatus);
			}

			if(!validate.isEmpty(result.startDate)){
				startDate = result.startDate.parseDate().format("yyyy-MM-dd");
			}
			if(!validate.isEmpty(result.endDate)){
				endDate = result.endDate.parseDate().format("yyyy-MM-dd");
			}

			if(Number(result.income) > 0){
				income = moneyCny.toYuan(result.income).toFixed(2);
			}

			if(Number(result.expCash) > 0){
				fExpCash = moneyCny.toYuan(result.expCash);
			}

			result.stateCls		= state.cls;
			result.stateText   	= state.text;
			result.income 		= income;
			result.fExpCash 	= fExpCash;
			result.startDate 	= startDate;
			result.endDate 		= endDate;
			result.expireDate 	= fDate.fExpireDay;
			result.expCash 		= result.expCash;


			data[i] = result;
		}

		return data;
	},

	getDiffTime: function (date, state) {

		var date2 = date.parseDate();
		var date1 = serverTime.getServerTime();		
		var diffTime = serverTime.getServerDiff(date1, date2);

		if(state != "unused"){
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
			fExpireDay: "1分钟"
		};		
	}
};


redPacket.init();