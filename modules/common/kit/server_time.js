module.exports = {
	getServerTime: function () {
		return window._ServerTime_ || new Date();
	},

	getServerDiff: function (date1, date2) {
		var timediff   = date2.getTime() - date1.getTime();

		var second 	= timediff / 1000;
		var	minute 	= second / 60;
		var hour   	= minute / 60;
		var	day 	= hour / 24;

		return {
			time: timediff,
			day: Math.floor(day),
			hour: Math.floor(hour % 24),
			minute: Math.floor(minute % 60),
			second: Math.floor(second % 60)
		};
	},

	getDateActivity: function (start, end) {
		var obj = {
			isStart: false,
			isEnd: true,
			result: false
		};

		var nowDate = this.getServerTime();

		if(typeof(start) == "string"){
			start = start.parseDate();
		}

		if(typeof(end) == "string"){
			end = end.parseDate();
		}

		if(start){
			obj.isStart = nowDate.getTime() > start.getTime();
		}

		if(end){
			obj.isEnd = nowDate.getTime() > end.getTime();
		}

		if(obj.isStart && !obj.isEnd){
			obj.result = true;
		}
		
		return obj;
	}
};