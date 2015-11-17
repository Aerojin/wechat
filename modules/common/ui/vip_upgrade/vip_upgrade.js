/**
 * @require style.css
 */
var $ 			= require("zepto");
var artTemplate = require("artTemplate");
var vipConfig 	= require("ui/vip_config/vip_config");

var vip = function (options) {

	this.min 			= 1;
	this.max 			= 4;
	this.vipLevel 		= options.vipLevel || 0;
	this.container 		= options.container || $("body");

	this.init();
};

vip.prototype.init = function () {

	if(this.vipLevel > this.max){
		this.vipLevel = this.max;
	}

	if(this.vipLevel < this.min){
		return;
	}

	var template = artTemplate.compile(__inline("context.tmpl"));
		template = template(vipConfig.getVipConfig(this.vipLevel));
		/*{
			vipIco: vipConfig.getVipIco(this.vipLevel),
			vipName: vipConfig.getVipName(this.vipLevel),
			context: this.getContext()
		}
		);*/

	this.ui = {};
	this.ui.wrap 		= $(template);
	this.ui.btnClose 	= this.ui.wrap.find(".btn-close");
	this.ui.btnSubmit 	= this.ui.wrap.find(".btn-submit");

	this.container.append(this.ui.wrap);
	this.regEvent();
};

vip.prototype.regEvent = function () {
	this.ui.btnSubmit.on("touchstart click", $.proxy(function () {
		window.location.href = "$root$/vip/vip.html";
		
		return false;
	}, this));

	this.ui.btnClose.on("touchstart click", $.proxy(function () {
		this.close();

		return false;
	}, this));
};

vip.prototype.close = function () {
	this.ui.wrap.remove();
};

/*vip.prototype.getContext = function () {
	var array 	= [];
	var tmpl 	= "<li>{0}、{1}</li>";
	var config 	= vipConfig.getPrivilege(this.vipLevel);

	for(var i = 0; i < config.length; i++){
		var html = tmpl.format(i + 1, config[i]);

		array.push(html);
	}

	return array.join("\n");
};*/


module.exports = {
	create: function (options) {
		return new vip(options || {});
	}
};