
var versions = require("versions");

var factory = function (options, context) {
	this.obServer 	= {};
	this.defaults 	= versions.getConstant().WAP;
	this.source 	= versions.getCurrentSource();
	this.context 	= context || this;

	for(var key in versions.getConstant()){
		this[key] = versions.getConstant()[key];
	}

	this.init(options)
};

factory.prototype.init = function (data) {
	if(data === undefined){
		return;
	}

	this.addObj(data);
	this.update();
};

factory.prototype.addFun = function (fun, source) {
	if(source === undefined){
		source = this.defaults;
	}

	this.obServer[source] = fun || function () {};
};

factory.prototype.addObj = function (options) {
	options = options || {};

	for(var key in options){
		this.obServer[key] = options[key];
	}
};

factory.prototype.getDefault = function () {
	var source = versions.getConstant();
	
	if(versions.isApp()){
		return this.obServer[source.APP];
	}

	return this.obServer[source.WAP]
};


factory.prototype.update = function () {
	if(this.obServer[this.source]){
		this.obServer[this.source].apply(this.context, arguments)
		return;
	}

	if(this.getDefault()){
		this.getDefault().apply(this.context, arguments);
	}
};


module.exports = {
	exec: function (options, context) {
		return new factory(options || {}, context);
	}
};