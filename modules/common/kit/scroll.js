var scroll = function (options) {

	this.lastY 		= 0;
	this.overflow 	= 100;
	this.context 	= options.context; 
	this.maxHeight 	= options.maxHeight;

	this.init();
};

scroll.prototype.init = function () {

	this.regevent();
};

scroll.prototype.regevent = function () {
	var _this = this;

	this.context.on("touchstart", function (event) {
		_this.removeAnimate();
		_this.start(event.touches[0]);
	});
};

scroll.prototype.start = function (touch) {
	var _this = this;
	
	 // 取第一个touch的坐标值
    this.startPos = {
        x: touch.pageX,
        y: touch.pageY
    };

     // 绑定事件
    this.context.on("touchmove", function (event) {
    	//event.preventDefault();                  // 阻止触摸事件的默认行为，即阻止滚屏
    	
    	var pageX = event.touches[0].pageX;
	    var pageY = event.touches[0].pageY;
	    var absX = Math.abs(pageX - _this.startPos.x);
	    var absY = Math.abs(pageY - _this.startPos.y);

	    if (absY > absX){
	    	event.preventDefault();
	    }

        // 当屏幕有多个touch或者页面被缩放过，就不执行move操作
        if (event.touches.length > 1 || event.scale && event.scale !== 1) {
        	return false;
        }

        _this.move(pageX, pageY);
    });

    this.context.on("touchend", function () {
	    _this.end();
    });
};

scroll.prototype.move = function (pageX, pageY) {
	this.endPos = {
        x: pageX - this.startPos.x,
        y: pageY - this.startPos.y
    };

    var minY = this.overflow;
    var maxY = (this.maxHeight + this.overflow) * -1;
    var topY = this.endPos.y + this.lastY;

    if(topY > minY){
    	topY = minY;
    }

    if(topY < maxY){
    	topY = maxY;
    }  

    this.moveAnimate(topY);   
};

scroll.prototype.end = function () {
	if(this.endPos){
		var absY = this.endPos.y + this.lastY;
			absY = this.endPos.y * 0.7 + absY;

		this.setScrollTop(absY);
	}

	this.context.off("touchmove");
   	this.context.off("touchend");
};

scroll.prototype.setScrollTop = function (absY) {
	var minY = 0;
    var maxY = this.maxHeight * -1;

    if(absY > minY){
    	absY = minY;
    }

    if(absY < maxY){
    	absY = maxY;
    }

    this.addAnimate();

	setTimeout($.proxy(function () {
		this.lastY = absY;
		this.moveAnimate(absY);
	}, this), 10);
};

scroll.prototype.removeAnimate = function () {
	this.context.css({
		"transition": "",
		"-webkit-transition": ""
    });
};

scroll.prototype.addAnimate = function () {
	this.context.css({
		"transition": "all 0.6s ease-out",
		"-webkit-transition": "all 0.6s ease-out"
    });
};

scroll.prototype.moveAnimate = function (absY) {
	this.context.css({
		"transform": "translateY(" + absY + "px)",
		"-webkit-transform": "translateY(" + absY + "px)"
    });
};


module.exports = scroll; 