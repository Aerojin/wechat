/**
 * @require style.css
 */
var $ 			= require("zepto");
var scroll 		= require("kit/scroll");
var artTemplate = require("artTemplate");


var SYSTEXT = {
	ALL: "全部"
};


/*
		日历：
 		var calendar = calendar.create({

			//日历控件容器,不指定则会将日历DOM赋值给 calendar.html
			"container": "div-wrap",

			"onSelectDay": function(date){
				//选择日期事件
				console.log(date);
			},

			"onChangeMonth": function(date, isSelectedAll){
				//改变月份事件
				console.log(date);
			}

		});
 */

var calendar = function(options){

	this.options = {
		container	: options.container ? $(options.container) : null, //日历控件容器
		onSelectDay : options.onSelectDay || function(){}, //选择日期事件
		onChangeMonth : options.onChangeMonth || function(){}, //改变月份事件

		isSelectedToday : options.isSelectedToday || false, //是否默认选中今天
		showAll: options.showAll || false, //是否显示"全部"选项
		minYearMonth: options.minYearMonth || "1900-01",
		maxYearMonth: options.maxYearMonth || "2100-01"
	};

	this.init.apply(this, arguments);
};


calendar.prototype = {

	STATUS:{
		PREV:-1,
		CURRENT:0,
		NEXT:1
	},


	init:function(){

		this.html 			= "";
		this.dateAry 		= [];
		this.monthAry		= [];
		this.today 			= new Date();
		this.currentMonth	= new Date(); 	//当前日历月份
		this.isSelectedAll	= false; 		//月份下拉框是否选中全部
		this.isSelectShow 	= false;

		this.bulidMonth();
		this.buildDate(this.today);

		this.render.init.call(this);


		var firstD = this.monthAry[0].date;
		var lastD = this.monthAry[this.monthAry.length-1].date;

		this.options.minYearMonth = firstD.format("yyyy-MM");
		this.options.maxYearMonth = lastD.format("yyyy-MM");

	},


	bulidMonth:function(){
		/*构造月份数组*/

		this.monthAry = [];

		var year 	= this.today.getFullYear();
		var month 	= this.today.getMonth();
		var endMonth = month + 12;

		for(var i=month; i<=endMonth; i++){
			this.monthAry.push({
				flag:false,
				date:new Date(year, i, 1)
			});
		}
	},

	buildDate:function(date){
		/*根据年月构造日期数组*/

		this.dateAry = [];

		var year 		= date.getFullYear();
		var month 		= date.getMonth() + 1;
		var day 		= date.getDate();
		var weekStart 	= new Date(year, month-1, 1).getDay();
		var days 		= new Date(year, month, 0).getDate();


		//prev month
		if(weekStart > 0){
			for(var i=0; i<weekStart; i++){
				this.dateAry.push({
					flag:false,
					status:this.STATUS.PREV,
					date: new Date(year, month-1, (-1*i))
				});
			}

			this.dateAry.reverse();
		}

		//current month
		for(var i=1; i<= days; i++){
			this.dateAry.push({
				flag:false,
				status:this.STATUS.CURRENT,
				date: new Date(year, month-1, i)
			});
		}

		//next month
		if(this.dateAry.length % 7 > 0){
			var nextQty = 7 - (this.dateAry.length % 7);

			for(var i=1; i<=nextQty; i++){
				this.dateAry.push({
					flag:false,
					status:this.STATUS.NEXT,
					date: new Date(year, month, i)
				});
			}
		}
	},

	isToday:function(date){

		return this.isComplete(this.today, date, "yyyyMMdd");
	},

	isComplete:function(date1, date2, rule){
		/*比较两个日期是否相等*/

		switch(rule){
			case "yyyyMM":
				return 	date1.getFullYear() == date2.getFullYear() && 
						date1.getMonth() == date2.getMonth();
				break;

			case "yyyyMMdd":
				return 	date1.getFullYear() == date2.getFullYear() && 
						date1.getMonth() == date2.getMonth() && 
						date1.getDate() == date2.getDate();
				break;
		}

		return false;
	},


	/*
	 * 日期设置标记
	 * @param {Array} dateAry 日期数组
	 */
	setFlagDay:function(dateAry){

		var dtAry = dateAry || [];

		dtAry.map($.proxy(function(dt, index){
			this.dateAry.map($.proxy(function(item, index){
				if(this.isComplete(new Date(dt), item.date, "yyyyMMdd")){
					item.flag = true;
				}
			}, this));

		}, this));

		this.render.flagCalendar.call(this);
	},


	/*
	 * 月份设置标记
	 * @param {Array} dateAry 日期数组
	 */
	setFlagMonth:function(dateAry){

		var dtAry = dateAry || [];

		dtAry.map($.proxy(function(dt, index){

			this.monthAry.map($.proxy(function(item, index){
				if(this.isComplete(new Date(dt), item.date, "yyyyMM")){
					item.flag = true;
				}
			}, this));

		}, this));

		this.render.flagSelect.call(this);
	},

	goNextMonth:function(){
		this.isSelectedAll = false;

		var year = this.currentMonth.getFullYear();
		var month = this.currentMonth.getMonth();
		var nextDate = new Date(year, month + 1, 1);

		if(nextDate >= new Date(this.options.maxYearMonth + "-01")) return;

		this.currentMonth = nextDate; 

		this.onChangeMonth();
	},

	goPreviousMonth:function(){
		this.isSelectedAll = false;

		var year = this.currentMonth.getFullYear();
		var month = this.currentMonth.getMonth();
		var prevDate = new Date(year, month - 1, 1);

		var ym1 = Number(prevDate.format("yyyyMM"));
		var ym2 = Number(new Date(this.options.minYearMonth + "-01").format("yyyyMM"));
		if(ym1 < ym2) return;

		this.currentMonth = prevDate;

		this.onChangeMonth();
	},

	onChangeMonth:function(){

	 	var date = this.currentMonth;

		this.render.hideSelect.call(this);
		this.render.setMonthBar.call(this);

		this.buildDate(date);
		this.render.calendar.call(this);

		this.options.onChangeMonth(date, this.isSelectedAll);
	},

	onSelectDay:function(date){

		this.options.onSelectDay(date);
	}

};




calendar.prototype.render = {

	init:function(){

		var _template 	= artTemplate.compile(__inline("calendar.tmpl"));
		this.html 		= $(_template());

		this.ui 			= {};
		this.ui.body		= $("body")
		this.ui.prevMonth 	= this.html.find(".prev");
		this.ui.nextMonth 	= this.html.find(".next");
		this.ui.divMonth 	= this.html.find(".date-box");
		this.ui.ulMonth		= this.html.find(".date-scroll");
		this.ui.lblMonth 	= this.html.find(".date-cur > span");
		this.ui.btnMonth 	= this.html.find(".date-cur");

		this.ui.tbody   = this.html.find(".datepickerDays");
		this.ui.tdList 	= this.ui.tbody.find("td");
		this.ui.trList 	= this.ui.tbody.find("tr");

		this.render.select.call(this);
		this.render.calendar.call(this);
		this.render.regEvent.call(this);

		
	},

	select:function(){

		this.ui.ulMonth.empty();

		this.ui.lblMonth.text(this.today.format("yyyy年MM月")); 

		if(this.options.showAll){
			this.ui.ulMonth.append("<li>" + SYSTEXT.ALL + "</li>");
		}

		this.monthAry.map($.proxy(function(item,index){
			var oLi 	= $("<li></li>");
			var text 	= item.date.format("yyyy年MM月");

			oLi.text(text);
			this.ui.ulMonth.append(oLi);

		}, this));
	},

	initScroll : function () {
		if(!this.scroll){
			var context 	= this.ui.ulMonth;
			var container 	= this.ui.divMonth; 
			var maxHeight 	= context.height() - container.height();

			this.scroll = new scroll({
				maxHeight: maxHeight,
				context: context
			});
		}
	},

	calendar:function(){

		if(this.dateAry.length <= 7*5){
			//隐藏最后一行
			this.ui.trList.last().hide();
		} else {
			this.ui.trList.last().show();
		}

		var otd = null;
		this.dateAry.map($.proxy(function(item, index){

			otd = this.ui.tdList.eq(index);
			otd.removeClass();

			//设置日期
			otd.find("span").text(item.date.getDate());

			if(item.status == this.STATUS.PREV || item.status == this.STATUS.NEXT){
				//非当月日期灰显
				otd.addClass("grey");
			}

			//选中今天
			if(this.options.isSelectedToday && this.isToday(item.date)){
				otd.addClass("defaultpicker");
			}


		}, this));


		if(this.options.container){
			this.options.container.empty().append(this.html);
		}
	},

	regEvent:function(){

		var me = this;

		//选择月份
		this.ui.ulMonth.children().on("tap", function(){

			var index = $(this).index();
			
			if(me.options.showAll){
				if(index == 0){
					me.isSelectedAll = true;
				} else {
					index = index - 1;
					me.isSelectedAll = false;
				}
			}

			var selectedDate = me.monthAry[index];

			if(selectedDate.date.format("yyyy-MM") == me.currentMonth.format("yyyy-MM")){
				me.render.hideSelect.call(me);
				return;
			}

			me.currentMonth = selectedDate.date;
			me.onChangeMonth();
			return false;
		});

		//选择日期
		this.ui.tdList.on("tap", function(){
			me.render.hideSelect.call(me);

			var index = me.ui.tdList.index(this);
			var o = me.dateAry[index];

			//if(o.flag){
				me.ui.tdList.removeClass("defaultpicker");
				$(this).addClass("defaultpicker");
				me.onSelectDay(o.date);
			//}

			switch(o.status){
				case me.STATUS.PREV:
					me.goPreviousMonth();
					break;

				case me.STATUS.NEXT:
					me.goNextMonth();
					break;
			}

			return false;

		});

		//显示隐藏月份列表
		this.ui.btnMonth.on("tap", function(){
			if(me.isSelectShow){
				me.render.hideSelect.call(me);
			} else {
				me.render.showSelect.call(me);
			}

			return false;
		});

		//点空白位置隐藏下拉
		this.ui.body.on("tap", function(e){
			var event = e || event;
			var obj = event.srcElement ? event.srcElement : srcElement.target;

			if($(obj).parent().hasClass("date-cur") || $(obj).parents(".date-box").size() > 0){
            	return;
            }

            me.render.hideSelect.call(me);

            return false;
			
		});

		//上一月
		this.ui.prevMonth.on("tap", function(){
			me.goPreviousMonth();
		});

		//下一月
		this.ui.nextMonth.on("tap", function(){
			me.goNextMonth();
		});
	},

	showSelect:function(){
		this.isSelectShow = true;
		this.ui.divMonth.show();
		this.render.initScroll.call(this);

		this.ui.btnMonth.addClass("month-ico-up").removeClass("month-ico-down");
	},

	hideSelect:function(){
		this.isSelectShow = false;
		this.ui.divMonth.hide();

		this.ui.btnMonth.addClass("month-ico-down").removeClass("month-ico-up");
	},

	setMonthBar:function(){
		var currMonthIsFlag = false;

		var currMonth = this.currentMonth.format("yyyy-MM");
		var minMonth  = this.options.minYearMonth.format("yyyy-MM");
		var maxMonth  = this.options.maxYearMonth.format("yyyy-MM");

		var selectedMonthText = this.isSelectedAll ? SYSTEXT.ALL : this.currentMonth.format("yyyy年MM月");

		//设置文本
		this.monthAry.map($.proxy(function(item, index){

			if(!item.flag) return;

			if(currMonth == item.date.format("yyyy-MM")){
				currMonthIsFlag = true;
			}
		}, this));

		this.ui.lblMonth.removeClass("point");
		
		if(currMonthIsFlag){
			this.ui.lblMonth.addClass("point");
		}

		this.ui.lblMonth.text(selectedMonthText);

		//设置翻月按钮
		if(currMonth == minMonth){
			this.ui.prevMonth.removeClass("tapOn");

		} else if(currMonth == maxMonth) {
			this.ui.nextMonth.removeClass("tapOn");

		} else {
			!this.ui.prevMonth.hasClass("tapOn") && this.ui.prevMonth.addClass("tapOn");
			!this.ui.nextMonth.hasClass("tapOn") && this.ui.nextMonth.addClass("tapOn");
		}

	},

	flagSelect:function(){
		/*月份设置红点标记*/
		this.monthAry.map($.proxy(function(item, index){

			if(!item.flag) return;

			var i = index;
			this.options.showAll ? i++ : i;

			this.ui.ulMonth.children().eq(i).addClass("dot");

		}, this));
	},

	flagCalendar:function(){
		/*日期设置红点标记*/
		this.dateAry.map($.proxy(function(item, index){

			if(!item.flag) return;

			this.ui.tdList.eq(index).addClass("item");

		}, this));
	}

};




module.exports = {
	create: function(options){
		if(!this.calendar){
			this.calendar = new calendar(options || {});
		}

		return this.calendar;
	}
}