/**
 * @require style.css  
 */
var $ 			= require("zepto");
var api 		= require("api/api");
var artTemplate = require("artTemplate");
var moneyCny	= require("kit/money_cny");
var serverTime 	= require("kit/server_time");
var smartbar	= require("ui/smartbar/smartbar");
var queryString = require("kit/query_string");
var sliderTrans	= require("ui/slider_transition/views");

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
		this.ui.list 	= this.ui.context.find(".ui-item");

		this.template	= {};
		this.template.empty  	= artTemplate.compile(__inline("empty.tmpl"));
		this.template.context  	= artTemplate.compile(__inline("context.tmpl"));

		this.queryString = queryString() || {};	
		this.smartbar = smartbar.create();

		var _this  = this;
		var format = function (data, status) {
			return _this.format(data, status);
		};


		this.slider = new sliderTrans.create({
			allowTouch: false,
			index: this.queryString.index || 0,
   			element: this.ui.list,
   			context: this.ui.context,
   			header: $("header").height(),
   			onChange: function (index) {
   				_this.ui.menu.removeClass("active");
   				_this.ui.menu.eq(index).addClass("active");
   			}
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
			padding: this.smartbar.getHeight()
		});

		this.regEvent();
	},

	regEvent: function () {
		var _this = this;

		this.ui.menu.click(function(event) {
			var index = _this.ui.menu.index($(this)); 

			_this.slider.setIndex(index);
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