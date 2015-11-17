/**
 * @require style.css
 */
var $ 			= require("zepto");
var validate 	= require("kit/validate");

var sliderBar = function (options) {
	this.data 		= options.data || [];
	this.container 	= options.container;		
	this.pageCount 	= this.data.length;
	this.pageSize 	= options.pageSize || 1;
	this.pageIndex 	= options.pageIndex || 0;
	this.timeout 	= options.timeout || 3800;

	this.template = {
		context: ['<div style="overflow: hidden; height: 2.03rem;">',
			'<ul  class="slider-context"></ul>',
		'</div>'].join("\n"),

		item: '<li class="ico-gift  float-left"><a href="{0}"><img id="img-ad" src="{1}" /></a></li>'
	};

	this.init();
};

$.extend(sliderBar.prototype, {

	init: function () {

		this.ui = {};
		this.ui.wrap 	= $(this.template.context);
		this.ui.context = this.ui.wrap.find(".slider-context");

		if(this.pageCount > 0){
			this.data.push(this.data[0]);
			this.pageCount = this.data.length;

			this.winWidth  = document.documentElement.clientWidth;
			this.ui.wrap.width(this.winWidth);
			this.ui.context.width(this.winWidth * this.pageCount);

			this.addAnimateClass();
			

			this.render();
			this.start();
		}

		this.regEvent();
	},

	regEvent: function () {
		var _this = this;

		this.ui.context.on("touchstart", function (event) {
		   _this.moveStatrt(event.touches[0]);
		});

	},

	start: function(){
		var _this = this;
		
		if(this.pageCount >= 2){
			this.stop();
			this.interid = setInterval(function(){
				_this.next();
			}, this.timeout);
		}
		
	},

	stop: function(){
		clearInterval(this.interid);
	},

	moveStatrt: function (touch) {
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
	},

	move: function (pageX, pageY) {
		var index = this.pageIndex;

	    this.endPos = {
	        x: pageX - this.startPos.x,
	        y: pageY - this.startPos.y
	    };

	    if(this.pageIndex == 0 && this.endPos.x > 0){
	    	index = this.pageCount - 1;
	    }

	    this.removeAnimateClass();
	    this.ui.context.css({
	    	"margin-left": this.getMove(index) + this.endPos.x
	    });
	},

	end: function () {
		var duration = +new Date - this.startPos.time;    // 滑动的持续时间
	 
	 	this.addAnimateClass();

	    if (Number(duration) > 80 && this.endPos) {
	        // 判断是左移还是右移，当偏移量大于100时执行
	        if (this.endPos.x > 100) {
	            this.prev();
	        } else if(this.endPos.x < -100) {
	            this.next();
	        }else{
	        	this.setIndex(this.pageIndex);
	        }
	    }

	   	this.ui.context.off("touchmove");
	   	this.ui.context.off("touchend");
	},

	prev: function(){
		var index = this.pageIndex - 1;
		this.setIndex( index );
	},
	next: function(){
		var index = this.pageIndex + 1;
		this.setIndex( index );
	},

	setIndex: function (pageIndex) {
		var behavior = "";
		var index = pageIndex;
			index = index < 0 ? this.pageCount - 1 : index;
			index = index >= this.pageCount ? 0 : index;

		if(pageIndex < this.pageIndex){
			behavior = "prev";
		}else{
			behavior = "next";
		}

		this.stop();
		this.changePage(index, behavior);
		this.start();
	},

	changePage: function (index, behavior) {
		this.animate(index, behavior);
		this.onChange(this.pageIndex);
	},

	render: function () {
		var array = [];

		for(var i = 0; i < this.data.length; i++){
			var data = this.data[i];

			if(validate.isEmpty(data.link)){
				data.link = "javascript:void(0);"
			}

			array.push(this.template.item.format(data.link, data.src));
		}

		this.ui.context.html(array.join("\n"));
		this.container.empty().append(this.ui.wrap);
	},

	animate: function (index, behavior) {
		var _this = this;

		index = this.resetIndex[behavior].call(this, index);

		setTimeout(function () {
			_this.animateMargin(_this.getMove(index), function () {
				if(index + 1 == _this.pageCount){
					_this.pageIndex = 0;
					_this.animateMove(_this.getMove(0));
				}
			});
		}, 20);

		/*
		if(true == false){
			this.ui.context.animate({
				"margin-left": this.getMove(index)
			}, function () {
				if(index + 1 == _this.pageCount){
					_this.pageIndex = 0;
					_this.animateMove(_this.getMove(0));

					/*
					_this.ui.context.css({
						"margin-left": _this.getMove(0)
					});
					
				}
			});
		}
		*/

		if(index == this.pageCount - 1){
			this.pageIndex = 0;
		}else{
			this.pageIndex = index;
		}
	},

	animateMargin: function (move, callback) {
		this.ui.context.one("webkitTransitionEnd", function () {
			callback();
		});

		this.ui.context.css({
			"margin-left": move
		});
	},


	getMove: function (index) {
		var move = index * this.winWidth;

		return move == 0 ? move : move * -1;
	},

	animateMove: function (move) {
		this.removeAnimateClass();
		this.ui.context.css({
			"margin-left": move
		});
		this.addAnimateClass();
	},

	addAnimateClass: function () {
		setTimeout($.proxy(function () {
			this.ui.context.addClass('slider-pages-tabboxs');
		}, this), 20);
	},

	removeAnimateClass: function () {
		this.ui.context.removeClass('slider-pages-tabboxs');
	},

	resetIndex: {
		prev: function (index) {
			if(this.pageIndex == 0 && index == this.pageCount - 1){
				/*
				if(index == this.pageCount - 2){
					index = index + 1;
				}
				*/
				
				var move = this.getMove(index);

				if(this.endPos && this.endPos.x != 0){
					move += this.endPos.x;
				}	

				this.animateMove(move);
				//this.ui.context.css({'margin-left':  + move});
				index = index - 1;
			}

			/*
			if(this.pageIndex == this.pageCount - 2 && index == 0){
				index = this.pageCount - 1;
			}
			*/
			
			return index;
		},
		next: function (index) {			
			return index;
		}
	},

	onChange: function () {

	}
});

module.exports = {
	create: function (options) {
		return new sliderBar(options || {});
	}
};