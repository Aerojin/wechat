/**
 * @require style.css
 */
var $ 				= require("zepto");
var versions 		= require("base/versions");
var getDefaultUri	= require("kit/default_uri");

var KEY = "_SMARTBAR_STATE_";

var STATE = {
	INDEX: "index",
	HOME: "home",
	ACCOUNT: "account",
	SETTING: "setting"
};

var smartbar = function (options) {

	this.container = options.container || $("body");
	this.state = options.state || this.getSate();
	
	this.init();
};

smartbar.prototype.init = function () {

	if(versions.isApp()){
		
		return;
	}

	this.ui = {};
	this.ui.body 		= $("body");
	this.ui.wrap 		= $(__inline("smartbar.tmpl"));
	this.ui.li 			= this.ui.wrap.find("li");
	this.ui.btnIndex 	= this.ui.wrap.find(".btn-index");
	this.ui.btnHome 	= this.ui.wrap.find(".btn-home");
	this.ui.btnAccount 	= this.ui.wrap.find(".btn-account");
	this.ui.btnSetting 	= this.ui.wrap.find(".btn-setting");
	
	this.regEvent();
	this.setState(this.state);

	this.container.append(this.ui.wrap);
	
	//app不需要显示底部导航, 所以需要将主容器底部置空
	this.ui.body.css({"padding-bottom": this.getHeight() + 10});
};

smartbar.prototype.regEvent = function () {

	this.ui.btnIndex.on("tap", $.proxy(function () {
		this.setState(STATE.INDEX);

		window.location.href = getDefaultUri();
		return false;
	}, this));

	this.ui.btnHome.on("tap", $.proxy(function () {
		this.setState(STATE.HOME);

		window.location.href = "$root$/product/home.html";
		return false;
	}, this));

	this.ui.btnAccount.on("tap", $.proxy(function () {
		this.setState(STATE.ACCOUNT);

		window.location.href = "$root$/account/my_account.html";
		return false;
	}, this));

	this.ui.btnSetting.on("tap", $.proxy(function () {
		this.setState(STATE.SETTING);

		window.location.href = "$root$/account/my_setting.html";
		return false;
	}, this));
};

smartbar.prototype.setState = function (state) {
	window.sessionStorage.setItem(KEY, state || STATE.INDEX);

	this.setFocus();
};

smartbar.prototype.getSate = function () {
	return window.sessionStorage.getItem(KEY) || STATE.INDEX;
};

smartbar.prototype.getHeight = function () {
	if(versions.isApp()){
		return 0;
	}

	return this.ui.wrap.height();
};

smartbar.prototype.setFocus = function () {
	if(versions.isApp()){
		return;
	}
	
	var factory = {
		"index": function () {
			return this.ui.btnIndex.parent();
		},
		"home": function () {
			return this.ui.btnHome.parent();
		},
		"account": function () {
			return this.ui.btnAccount.parent();
		},
		"setting": function () {
			return this.ui.btnSetting.parent();
		}
	};

	var fun = factory[this.getSate()] || factory[STATE.INDEX];
	var dom = fun.call(this);

	this.ui.li.removeClass('z-on');
	dom.addClass('z-on');
};


module.exports = {
	create: function (options) {
		if(!this.smartbar){
			this.smartbar = new smartbar(options || {});
		}

		return this.smartbar;
	}
};