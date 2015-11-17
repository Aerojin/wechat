/**
 * @require style.css
 */
var $ 			= require("zepto");
var validate 	= require("kit/validate");

var slider = function (options) {
	
	this.index 		 = options.index || 0;
	this.width 		 = document.documentElement.clientWidth;  //$(window).width()  在小米手机获取的宽度有问题
	this.activeClass = options.activeClass;

	this.ui = {};
	this.ui.menu 	= options.menu;
	this.ui.list 	= options.list;
	this.ui.context = options.context;

	this.init();
};

slider.prototype.init = function () {

	this.index  = Number(this.index);
	this.length = this.ui.menu.length;
	this.contextWidth = this.width * this.length;

	if(this.index <= 0){
		this.index = 0;
	}

	if(this.index >= this.length){
		this.index = this.length - 1;
	}

	if(this.ui.context){
		this.ui.context.addClass('slider-pages-tabbox');
	}

	this.setWidth();
	this.setMenu();	
	this.regEvent();
	this.setIndex(this.index);

};


slider.prototype.regEvent = function () {
	var _this = this

	this.ui.menu.on("tap", function () {
		var index = Number($(this).data("index"));

		_this.setIndex(index)
	});

	this.ui.context.on("touchstart", function (event) {
		//event.preventDefault();                                     // 阻止触摸事件的默认动作,即阻止滚屏
	 
	   _this.start(event.touches[0]);
	});
};

slider.prototype.start = function (touch) {
	var _this = this;
	
	 // 取第一个touch的坐标值
    this.startPos = {
        x: touch.pageX,
        y: touch.pageY,
        time: +new Date
    };

    // 绑定事件
    this.ui.context.on("touchmove", function (event) {
    	//event.preventDefault();                  // 阻止触摸事件的默认行为，即阻止滚屏

    	var pageX = event.touches[0].pageX;
	    var pageY = event.touches[0].pageY;
	    var absX = Math.abs(pageX - _this.startPos.x);
	    var absY = Math.abs(pageY - _this.startPos.y);

	    if (absX > absY){
	    	event.preventDefault();
	    }

        // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
        if (event.touches.length > 1 || event.scale && event.scale !== 1) {
        	return false;
        }

        _this.move(pageX, pageY);
    });


    this.ui.context.on("touchend", function () {
    	_this.end();
    });
};

slider.prototype.move = function (pageX, pageY) {
    this.endPos = {
        x: pageX - this.startPos.x,
        y: pageY - this.startPos.y
    };

    this.ui.context.css({
    	"margin-left": this.getMove() + this.endPos.x
    	//"left": this.getMove() + this.endPos.x
    });
};

slider.prototype.end = function () {
	var index = this.index;
	var duration = +new Date - this.startPos.time;    // 滑动的持续时间
 
    if (Number(duration) > 100 && this.endPos) {
        // 判断是左移还是右移，当偏移量大于50时执行
        if (this.endPos.x > 50) {
            index -= 1;
        } else if(this.endPos.x < -50) {
            index += 1;
        }
    }

   	this.setIndex(index);

   	this.ui.context.off("touchmove");
   	this.ui.context.off("touchend");
};

slider.prototype.animation = function (index) {
	this.ui.context.css({
		"margin-left": this.getMove() 
		//"left": this.getMove()
	});

	/*
	this.ui.context.animate({
		"margin-left": this.getMove()
	}, 300);
	*/
};

slider.prototype.setIndex = function (index) {
	this.index = validate.isNumber(index) ? index : this.index;

	if(this.index < 0){
		this.index = 0;
	}

	if(this.index >= this.length){
		this.index = this.length - 1;
	}
	
	this.setMenu();
	this.animation();
};

slider.prototype.setMenu = function () {
	this.ui.menu.removeClass(this.activeClass);
	this.ui.menu.eq(this.index).addClass(this.activeClass);
};

slider.prototype.getMove = function () {
	var move = this.index * this.width;

	return move == 0 ? move : move * -1;
};

slider.prototype.setWidth = function () {
	this.ui.context.css({
		"width": this.contextWidth,
		"margin-left": this.getMove()
	});

	this.ui.list.css({
		width: this.width
	});
};

module.exports = {
	create: function (options) {
		if(!this.slider){
			this.slider = new slider(options);
		}

		return this.slider;
	}
};