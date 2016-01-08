/**
 * @require style.css
 */
var $ 				= require("zepto");
var appApi 		 	= require("kit/app_api");
var redirect 		= require("kit/redirect");
var eventFactory 	= require("base/event_factory");

var keyboard = function (options) {
	this.isShow 	= false;
	this.value 		= options.value || [];
	this.maxLength 	= options.maxLength || 6;
	this.container 	= options.container || $("body");
	this.onClose 	= options.onClose || function () {};
	this.onUpdate 	= options.onUpdate || function () {};

	this.init = function () {
		this.ui = {};
		this.ui.wrap 			= $(__inline("context.tmpl"));
		this.ui.btnClose 		= this.ui.wrap.find(".btn-close");
		this.ui.btnBackspace 	= this.ui.wrap.find(".btn-backspace");
		this.ui.btnNumber   	= this.ui.wrap.find(".btn-number");
		this.ui.btnForget   	= this.ui.wrap.find(".btn-forget");
		this.ui.loading 	 	= this.ui.wrap.find(".loading-wrap");
		this.ui.context 	 	= this.ui.wrap.find(".loading-context");
		this.ui.keyboard   		= this.ui.wrap.find(".keyboard-wrap");		
		this.ui.pwdLi 	 		= this.ui.wrap.find(".div-context li");
		this.ui.btnLi 			= this.ui.wrap.find("li");
		this.ui.input 			= $("input");

		this.regEvent();
		this.ui.wrap.appendTo(this.container);	
		this.show();		

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

		this.ui.btnClose.on("touchstart click", $.proxy(function () {
			this.hide();
			this.onClose();

			return false;
		}, this));

		this.ui.btnBackspace.on("touchstart", $.proxy(function () {
			this.pop();

			return false;
		}, this));

		this.ui.btnForget.on("touchstart", $.proxy(function () {			
			eventFactory.exec({
				wap: function () {
					//设置交易密码后, 回跳的页面;
					redirect.set(window.location.href);
					window.location.href = "$root$/account/findpay_password1.html";
				},
				app: function () {
					window.location.href = appApi.getForgetPayPassword();
				}
			});
		}, _this));
	};

	this.showLoading = function () {
		this.ui.loading.show();
		this.ui.context.hide();
	};

	this.hideLoading = function () {
		this.ui.loading.hide();
		this.ui.context.show();
	};

	this.show = function () {
		var _this = this;

		if(this.isShow){
			return;
		}
		
		this.removeBlur();
		this._show();

		return this;
	};


	this._show = function () {		
		this.hideLoading();
		this.ui.wrap.show();
		this.ui.keyboard.css({
			bottom: -this.ui.keyboard.height()
		});

		this.ui.keyboard.animate({
			bottom: "0px"
		}, 200, function () {
			//		
		});

		this.isShow = true;
		this.ui.loading.css({height: this.ui.keyboard.height()});
	};

	this.hide = function (callback) {
		var _this = this;

		if(!this.isShow){
			return ;
		}

		this.ui.keyboard.css({
			bottom: "0px"
		});

		this.ui.keyboard.animate({
			bottom: -this.ui.keyboard.height()
		}, 200, function () {
			_this.ui.wrap.hide();

			if(callback){
				callback();
			}
		});

		this.isShow = false;
	};

	this.removeBlur = function () {
		for(var i = 0; i < this.ui.input.length; i++){
			this.ui.input.get(i).blur();
		}
	};

	this.close = function () {
		var _this = this;

		this.isShow = true;
		this.hide(function () {
			_this.ui.wrap.remove();			
		});
	},

	this.push = function (number) {
		if(this.value.length < this.maxLength){
			this.value.push(number);
		}

		this.change(this.getValue());
	};

	this.pop = function () {
		this.value.pop();

		this.change(this.getValue());
	}

	this.getValue = function () {
		return this.value.join("");
	};

	this.resetValue = function () {
		this.value = [];
		this.change(this.getValue());
	};

	this.change = function (value) {
		this.ui.pwdLi.removeClass('z-on');

		for(var i = 0; i < value.length ; i++){
			this.ui.pwdLi.eq(i).addClass('z-on');
		}

		if(value.length >= this.maxLength){
			//this.ui.context.hide();
			//this.ui.loading.show();
			this.onUpdate(value);
		}
	};

	return this.init();
}

module.exports = { 
	create: function (options) {
		return new keyboard(options || {});
	}	
};