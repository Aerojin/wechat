/**
 * @require style.css
 */
var $ 			= require("zepto");
var artTemplate = require("artTemplate");

var TIPS = {
	EMPTY_TEXT: "暂无数据",
	LOADING_TEXT: "数据加载中..."
};

var DEF

var views = function (options) {
	
	this.isLoad 		= false;	
	this.pageCount  	= options.pageCount  > 0 ? options.pageCount : 1;
	this.pageIndex 		= options.pageIndex || 1;
	this.pageSize  		= options.pageSize || 5;
	this.container 		= options.container;
	this.selector   	= options.selector || ".iscroll-item";
	this.header			= options.header;
	this.emptyHtml 		= options.emptyHtml;
	this.emptyText 		= options.emptyText || TIPS.EMPTY_TEXT;
	this.onLoad 		= options.onLoad || this.onLoad;
	this.id 			= Math.random(); //主键, 唯一值

	this.init();
};

views.prototype.init = function () {

	this.ui = {};
	this.ui.win 		= $(window);
	this.ui.wrap 		= $(this.getTemplate());
	this.ui.empty 		= this.ui.wrap.find(".iscroll-empty");
	this.ui.header	 	= this.ui.wrap.find(".iscroll-header");
	this.ui.context 	= this.ui.wrap.find(".iscroll-context");
	this.ui.loading 	= this.ui.wrap.find(".iscroll-loading");


 	this.container.empty().append(this.ui.wrap);	

	//this.scroll();
	this.regEvent();
};

views.prototype.regEvent = function () {
	var _this = this;

	this.ui.win.on("scroll", $.proxy(function () {
		if(window.iscrollID == this.id){
			this.scroll();
		}
	}, this));

	this.ui.wrap.on("touchstart", $.proxy(function () {
		window.iscrollID = this.id;
	}, this));
};

views.prototype.scroll = function () {
	var pageIndex = this.pageIndex;
    var pageCount = this.pageCount;
	var last = this.ui.context.find(this.selector).eq(-1);

	 if(this.isLoading || last.size() == 0){
        return;
    }

    var documentH = this.ui.win.scrollTop() + document.documentElement.clientHeight;
    var lastPinHeight = Math.floor(last.height() / 2) + last.offset().top;
        
    if(documentH > lastPinHeight && pageIndex + 1 <= pageCount){
    	this.pageIndex++;
        this.isLoading = true;
        this.onLoad(this.pageIndex);
    }
};

views.prototype.getTemplate = function (result) {
	var template = artTemplate.compile(__inline("context.tmpl"));

	return template({		
		emptyText: this.emptyText,
		emptyHtml: this.emptyHtml,
		loadingText: TIPS.LOADING_TEXT
	});
};

views.prototype.setHeader = function (dom) {
	this.header = true;
	this.ui.header.show();
	this.ui.header.empty().append(dom);
};

views.prototype.setLoading = function (result) {
	this.isLoading = result;
};

views.prototype.reloading = function (result) {
	this.ui.context.empty();
	this.ui.loading.show();
};

views.prototype.showEmpty = function () {
	this.ui.context.hide();
	this.ui.loading.hide();
	this.ui.empty.show();

	(this.header && this.ui.empty.children().eq(0).addClass("top1"));
};

views.prototype.showLoading = function () {
	this.ui.loading.show();
};

views.prototype.hideLoading = function () {
	this.ui.loading.hide();
};

views.prototype.setPageCount = function (pageCount) {
	this.pageCount = pageCount;
};

views.prototype.appendContext = function (html, noEmpty) {
	var _this = this;

	if(this.pageIndex == 1 && !noEmpty){
		this.hideLoading();
		this.ui.context.empty();
	}

	this.ui.context.show();
	this.ui.loading.hide();

	this.ui.empty.hide();
	this.ui.context.append(html);

	//dom渲染完成后再重新处理是否要继续加载数据
	setTimeout(function () {
		_this.setLoading(false);
		_this.scroll();	
	}, 50);	
};

views.prototype.onLoad = function () {

};

module.exports = {
	create: function (options) {
		return new views(options || {});
	}
};