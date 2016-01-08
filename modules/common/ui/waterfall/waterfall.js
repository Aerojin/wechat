/**
 * @require style.css
 */
var $ 			= require("zepto");
var artTemplate = require("artTemplate");

var TIPS = {
	EMPTY_TEXT: "暂无数据",
	LOADING_TEXT: "数据加载中..."
};

var waterfall = function (options) {

	this.isLoad 		= false;
	this.noScroll 		= options.noScroll; //是否需要内置滚动条, 如果设置为true则启用系统滚动条
	this.padding 		= options.padding || 0;
	this.pageCount  	= options.pageCount  > 0 ? options.pageCount : 1;
	this.pageIndex 		= options.pageIndex || 1;
	this.pageSize  		= options.pageSize || 5;
	this.container 		= options.container;
	this.selector   	= options.selector;
	this.header			= options.header;
	this.emptyHtml 		= options.emptyHtml;
	this.emptyText 		= options.emptyText || TIPS.EMPTY_TEXT;
	this.onLoad 		= options.onLoad || this.onLoad;

	this.init();
};

waterfall.prototype.init = function () {

	this.ui = {};
	this.ui.wrap 		= $(this.getTemplate());
	this.ui.empty 		= this.ui.wrap.find(".waterfall-empty");
	this.ui.container 	= this.ui.wrap.find(".waterfall-container");
	this.ui.header	 	= this.ui.container.find(".waterfall-header");
	this.ui.context 	= this.ui.container.find(".waterfall-context");
	this.ui.loading 	= this.ui.container.find(".waterfall-loading");

	this.rezise();
 	this.container.empty().append(this.ui.wrap);
 	(this.header && this.ui.header.append(this.header));

	//this.scroll();
	this.regEvent();
};


waterfall.prototype.regEvent = function () {

	$(window).resize($.proxy(function () {
		this.rezise();
	}, this));

	this.ui.container.on("scroll", $.proxy(function () {
		this.scroll();		
	}, this));
};

waterfall.prototype.rezise = function () {
	if(!this.noScroll){
		var offset 	= this.container.offset();
		var height 	= document.documentElement.clientHeight - offset.top - this.padding;
		
	 	this.ui.container.height(height);
	 }
};

waterfall.prototype.scroll = function () {
	var pageIndex = this.pageIndex;
    var pageCount = this.pageCount;
	var last = this.ui.context.find(this.selector).eq(-1);

	 if(this.isLoading || last.size() == 0){
        return;
    }

    var documentH = this.container.scrollTop() + document.documentElement.clientHeight;
    var lastPinHeight = Math.floor(last.height() / 2) + last.offset().top + this.container.scrollTop();
        
    if(documentH > lastPinHeight && pageIndex + 1 <= pageCount){
    	this.pageIndex++;
        this.isLoading = true;
        this.onLoad(this.pageIndex);
    }
};

waterfall.prototype.getTemplate = function (result) {
	var template = artTemplate.compile(__inline("context.tmpl"));

	return template({
		emptyText: this.emptyText,
		emptyHtml: this.emptyHtml,
		loadingText: TIPS.LOADING_TEXT
	});
};

waterfall.prototype.setLoading = function (result) {
	this.isLoading = result;
};

waterfall.prototype.reloading = function (result) {
	this.ui.context.empty();
	this.ui.loading.show();

};

waterfall.prototype.showEmpty = function () {
	this.ui.context.hide();
	this.ui.loading.hide();
	this.ui.empty.show();
	
	(this.header && this.ui.empty.children().eq(0).addClass("top1"));
};

waterfall.prototype.showLoading = function () {
	this.ui.loading.show();
};

waterfall.prototype.hideLoading = function () {
	this.ui.loading.hide();
};

waterfall.prototype.setPageCount = function (pageCount) {
	this.pageCount = pageCount;
};

waterfall.prototype.appendContext = function (html, noEmpty) {
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

waterfall.prototype.getFontSize = function (pageCount) {
	var max   = 414;
	var width = window.innerWidth > max ? max : window.innerWidth;
	var size  = width / max;

    return size;
};

waterfall.prototype.onLoad = function () {

};


module.exports = {
	create: function (options) {
		return new waterfall(options);
	}
};