var $ 				= require("zepto");
var appApi 		 	= require("kit/app_api");
var eventFactory 	= require("base/event_factory");
var dialogs 		= require("ui/dialogs/dialogs");
var keyboard 		= require("ui/keyboard/keyboard");


var dialogsPwd = function (options) {

	this.container 	= options.container || $("body");
	this.onClose 	= options.onClose || this.onClose;
	this.onUpdate 	= options.onUpdate || this.onUpdate;

	this.init();
};

dialogsPwd.prototype.init = function () {
	this.ui = {};
	this.ui.body 	= $("body");
	this.ui.html 	= $("#html");
	this.ui.input 	= $("input");

	this.template = {};
	this.template.context = __inline("context.tmpl");

	//隐藏系统滚动条, 解决自定义键盘定位问题
	this.ui.body.scrollTop(0);
	this.ui.html.css({overflow: "hidden"});

	this.removeBlur();

	setTimeout($.proxy(function () {
		this.createDialogs();	
	}, this), 100);
	
};

dialogsPwd.prototype.removeBlur = function () {
	for(var i = 0; i < this.ui.input.length; i++){
		this.ui.input.get(i).blur();
	}
};

dialogsPwd.prototype.createDialogs = function () {
	var _this = this;
	var context = this.template.context;

	this.dialogs = dialogs.create({
		context: context,
		onReady: function (dom) {
			
			_this.ui.wrap 		= dom;
			_this.ui.li 		= dom.find("li");
			_this.ui.context 	= dom.find('.div-context');
			_this.ui.btnCancel 	= dom.find(".btn-cancel");
			_this.ui.btnSubmit 	= dom.find(".btn-submit");
			_this.ui.btnForget 	= dom.find(".btn-forget");

			_this.keyboard = new keyboard({
				onChange: function (result) {
					_this.change(result);
				}
			});

			_this.regEvent();
			_this.keyboard.show();
		}
	});
};

dialogsPwd.prototype.regEvent = function () {
	var _this = this;

	this.ui.context.on("touchstart", $.proxy(function () {
		this.keyboard.show();

		return false;
	}, this));

	this.ui.btnCancel.on("touchstart", $.proxy(function () {
		this.close();

		return false;
	}, this));

	this.ui.btnSubmit.on("touchstart", $.proxy(function () {
		if(this.check()){
			this.onUpdate(this.keyboard.getValue());
		}

		return false;
	}, this));

	//防止用户误点
	setTimeout(function () {
		_this.ui.btnForget.on("touchstart", $.proxy(function () {			
			eventFactory.exec({
				wap: function () {
					window.location.href = "$root$/account/findpay_password1.html";
				},
				app: function () {
					window.location.href = appApi.getForgetPayPassword();
				}
			});
		}, _this));
	}, 1200);
};

dialogsPwd.prototype.close = function (result) {
	this.dialogs.close();
	this.keyboard.close();
	this.ui.html.css({"overflow": ""});

	this.onClose();
};

dialogsPwd.prototype.show = function () {
	this.ui.wrap.show();
	this.keyboard.show();
};

dialogsPwd.prototype.change = function (result) {
	this.ui.li.removeClass('z-on');

	for(var i = 0; i < result.length ; i++){
		this.ui.li.eq(i).addClass('z-on');
	}

	this.toggleButton();
};

dialogsPwd.prototype.toggleButton = function () {
	if(this.keyboard.getValue().length >= 6){
		this.ui.btnSubmit.removeClass("btn-gray");

		return;
	}

	this.ui.btnSubmit.addClass("btn-gray");
};

dialogsPwd.prototype.check = function () {
	if(this.ui.btnSubmit.hasClass('btn-gray')){
		return false;
	}

	return true;
};

dialogsPwd.prototype.onUpdate = function () {

};

dialogsPwd.prototype.onClose = function () {

};

module.exports = { 
	create: function (options) {
		return new dialogsPwd(options || {});
	}	
};