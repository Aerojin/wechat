/**
 * @require style.css
 */
var $ = require("zepto");

var views = function (options) {
	
	this.index 		= options.index || 0;
	this.header 	= options.header || 0;
	this.footer 	= options.footer || 0;
	this.context 	= options.context;
	this.element 	= options.element || [];
	this.allowTouch = options.allowTouch === undefined ? true : options.allowTouch;
	this.onChange 	= options.onChange || function () {};


	this.pageCount 	= this.element.length;
	this.height 	= this.getDefHeight();
	this.width 		= this.getDefWidth();

	this.init();
};

views.prototype.init = function () {

	this.scroll = {
		X: false,
		Y: false
	};

	this.addAnimation();
	this.setHeightOfHack();
	this.setIndex(this.index);

	this.regEvent();//
};

views.prototype.regEvent = function () {
	var _this = this;

	this.context.on("touchstart", function (event) {
		if(!_this.allowTouch) return;

	   _this.start(event.touches[0]);
	});
};

views.prototype.start = function (touch) {
	var _this = this;
	
	 // 取第一个touch的坐标值
    this.startPos = {
        x: touch.pageX,
        y: touch.pageY,
        time: +new Date
    };

    this.removeAnimation();
    
    this.context.on("touchmove", function (event) {
    	//event.preventDefault();                  // 阻止触摸事件的默认行为，即阻止滚屏

    	var pageX = event.touches[0].pageX;
	    var pageY = event.touches[0].pageY;
	    var absX = Math.abs(pageX - _this.startPos.x);
	    var absY = Math.abs(pageY - _this.startPos.y);

	    //第一次移动时锁定滚动的方向
	    if(!_this.isLock()){
	    	_this.setScroll(absX > absY ? "X" : "Y", true);
		}

		//X轴滚动时阻止系统滚动条的默认行为
		if(_this.getScroll("X")){
			event.preventDefault();
		}

		//Y轴滚动时放开系统滚动条默认行为并且终止后续操作
		if(_this.getScroll('Y')){
			_this.end();
			return;
		}

        // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
        if (event.touches.length > 1 || event.scale && event.scale !== 1) {
        	return false;
        }

        _this.move(pageX, pageY);
    });  

    //绑定事件
    this.context.on("touchend", function () {    	
    	_this.end();
    });  
};

views.prototype.move = function (pageX, pageY) {
	var index = this.pageIndex;

    this.endPos = {
        x: pageX - this.startPos.x,
        y: pageY - this.startPos.y
    };

    this.moveAnimate(this.getMove() + this.endPos.x);
};

views.prototype.end = function () {
	var _this 	 = this;
	var duration = +new Date - this.startPos.time;    // 滑动的持续时间

	this.addAnimation();

	if(this.endPos && this.getScroll("X")){
		var pageX = Math.abs(this.endPos.x);
		var pageY = Math.abs(this.endPos.y);	

	    if (Number(duration) > 80 && pageX > pageY) {
	        // 判断是左移还是右移，当偏移量大于100时执行
	        if (this.endPos.x > 100) {
	            this.setIndex(this.index - 1);
	        } else if(this.endPos.x < -100) {
	            this.setIndex(this.index + 1);
	        }else{
	        	this.setIndex(this.index);
	        }
	    }else{
	    	this.setIndex(this.index);
	    }
	}
	
	this.setScroll("X", false);
	this.setScroll("Y", false);
   	this.context.off("touchmove");
   	this.context.off("touchend");
};

views.prototype.moveAnimate = function (absX) {
	var _this = this;

	this.context.one("webkitTransitionEnd", function () {
		//$("body").scrollTop(0);
		_this.setHeight();
	}).css({
		"transform": "translateX(" + absX + "px)",
		"-webkit-transform": "translateX(" + absX + "px)"
    });
};

views.prototype.isLock = function () {
	var value = false;

	for(var key in this.scroll){
		if(this.scroll[key]){
			value = true;
			break;
		}
	}

	return value;
};

views.prototype.setScroll = function (coord, value) {
	this.scroll[coord] = value;
};

views.prototype.getScroll = function (coord, value) {	
	return this.scroll[coord];
};

views.prototype.getMove = function () {
	var move = this.index * this.width;

	return move == 0 ? move : move * -1;
};

views.prototype.setIndex = function (index) {
	index = index < 0 ? 0 : index;
	index = index >= this.pageCount ? this.pageCount - 1 : index;

	this.index = index;

	this.onChange(index);
	this.moveAnimate(this.getMove());
};

views.prototype.setHeightOfHack = function() {
	//专门解决ios7下页面底部会多出一块空白区域的问题
	var dom = this.element.eq(this.index);

	var contentHeight = dom.children().height();
	contentHeight = contentHeight < this.height ? this.height : contentHeight;

	dom.removeAttr('style');
	dom.css({height: contentHeight});
}

views.prototype.setHeight = function () {
	var dom = this.element.eq(this.index);
	this.element.css({height: this.height});

	dom.removeAttr('style');
	dom.css({height: 'auto'});
};

views.prototype.getDefHeight = function () {
	var winHeight 	= document.documentElement.clientHeight;

	return winHeight - this.header - this.footer;	
};

views.prototype.getDefWidth = function () {
	return document.documentElement.clientWidth;
};

views.prototype.addAnimation = function () {
	this.context.addClass('ui-transition');
};

views.prototype.removeAnimation = function () {
	this.context.removeClass('ui-transition');
};

module.exports = {
	create: function (options) {
		return new views(options || {});
	}
};