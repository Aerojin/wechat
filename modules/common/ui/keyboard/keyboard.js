/**
 * @require style.css
 */
var $ = require("zepto");

module.exports = function (options) {

	this.isShow 	= false;
	this.value 		= options.value || []; 					//初始密码
	this.maxLength 	= options.maxLength || 6;				//密码长度
	this.container 	= options.container || $("body");		//容器
	this.onChange 	= options.onChange || function () {};	//每次改变回调函数

	this.init = function () {
		
		this.ui = {};
		this.ui.wrap 			= $(__inline("keyboard.tmpl"));
		this.ui.btnDropdown 	= this.ui.wrap.find(".drop-down");
		this.ui.btnBackspace 	= this.ui.wrap.find(".back-space");
		this.ui.btnNumber   	= this.ui.wrap.find(".btn-number");
		this.ui.btnLi 			= this.ui.wrap.find("li");

		this.regEvent();
		this.ui.wrap.css({bottom: "-261px"}).appendTo(this.container);

		return this;
	};	

	this.regEvent = function () {
		var _this = this;


		this.ui.btnLi.on("touchstart", function () {
			$(this).addClass('active');

			//return false;
		});

		this.ui.btnLi.on("touchend", function () {
			$(this).removeClass('active');

			//return false;
		});

		this.ui.btnNumber.on("touchstart", function () {
			_this.push($(this).data("number"));

			return false;
		});

		this.ui.btnDropdown.on("touchstart", $.proxy(function () {
			this.hide();

			return false;
		}, this));

		this.ui.btnBackspace.on("touchstart", $.proxy(function () {
			this.pop();

			return false;
		}, this));
	};

	this.show = function () {
		//var _this = this;

		if(this.isShow){
			return;
		}

		this.ui.wrap.css({
			bottom: "-261px"
		});

		this.ui.wrap.animate({
			bottom: "0px"
		}, 200, function () {
			//_this.ui.wrap.hide();
		});

		this.isShow = true;
	};

	this.hide = function (callback) {
		//var _this = this;

		if(!this.isShow){
			return ;
		}

		this.ui.wrap.css({
			bottom: "0px"
		});

		this.ui.wrap.animate({
			bottom: "-261px"
		}, 200, function () {
			if(callback){
				callback();
			}
			//_this.ui.wrap.remove();
		});

		this.isShow = false;
	};

	this.close = function () {
		var _this = this;

		this.hide(function () {
			_this.ui.wrap.remove();
		});
	},

	this.push = function (number) {
		if(this.value.length < this.maxLength){
			this.value.push(number);
		}

		this.onChange(this.getValue());
	};

	this.pop = function () {
		this.value.pop();

		this.onChange(this.getValue());
	}

	this.getValue = function () {
		return this.value.join("");
	};

	this.resetValue = function () {
		this.value = [];
	};

	return this.init();
}