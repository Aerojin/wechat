var validate = require("validate");

var model = function (options) {

	this.start 	= options.startDate;
	this.end 	= options.endDate;
	this.msec 	= options.msec;	
	this.timer 	= options.timer || 1000;
	this.onChange 	= options.onChange || function () {};
	this.onComplete = options.onComplete || function () {};

	this.init();
};

model.prototype.init = function () {
	var _this = this;

	if(validate.isEmpty(this.msec)){
		this.msec = this.getMsec();
	}

	this.onChange(this.format(this.msec));
	this.starCountDown();
};

//对计算出的时间进行格式化
model.prototype.format = function (msec) {
	var fmt 	= this.format;	
	var second 	= msec / 1000;
	var	minute 	= second / 60;
	var hour   	= minute / 60;
	var	day 	= hour / 24;

	var obj = {
		"day": Math.floor(day),
		"hour": Math.floor(hour % 24),
		"minute": Math.floor(minute % 60),
		"second": Math.floor(second % 60)
	};

	return obj;
};

//倒计时开始
model.prototype.starCountDown = function (msec) {
	var _this 	= this;
	var msec 	= this.msec;

	var interval = setInterval(function () {
		msec = msec - _this.timer;

		if(msec > 0){
			_this.onChange(_this.format(msec));
		}else{
			_this.onComplete();
			clearInterval(interval);
		}
	}, this.timer);	
};


//计算时间差, 获取相差的毫秒数
model.prototype.getMsec = function () {
	if(validate.isEmpty(this.start) || validate.isEmpty(this.end)){
		return 0;
	}

	var start 	= this.start.parseDate().getTime();
	var end 	= this.end.parseDate().getTime();

	return end - start;
};

module.exports = {
	create: function (options) {
		return new model(options || {});
	}
};