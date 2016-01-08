var $    = require("zepto");

var moto = {
	init:function(options){
		var time = options.minutes;
		this.progress = $('.progress-0');
		this.progressbefore = $('.progress-0 i');
		this.moTomove(time);
	},
	moTomove:function(numb){
		if(numb>1360&&numb<1439){
			numb =1360;
		}else if(numb>1440){
			numb =1440;
		}
		_this = this;
		var cunt = (360/1440)*numb;
		var cunt2 = 360-(180/720)*numb;
		var cunt3 = 180-(180/720)*(numb-720);
		_this.progressbefore.css('-webkit-transform',' rotate('+cunt+'deg) translate(0, -62px)');
		if(numb>720){
			
			 _this.progress.css('background-image','-webkit-linear-gradient('+cunt3+'deg, #fff 50%, transparent 50%, transparent), -webkit-linear-gradient(180deg, #fff 50%, #f9908c 50%, #f9908c);');
		}else{

			 _this.progress.css('background-image','-webkit-linear-gradient(0deg, #f9908c 50%, transparent 50%, transparent), -webkit-linear-gradient('+cunt2+'deg, #fff 50%, #f9908c 50%, #f9908c);');
		}

	}	
};
module.exports = {
	create : function(options){
		moto.init(options);
	}
};