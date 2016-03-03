/**
* @require style.css
*/
var $ 				= require("zepto");
var artTemplate 	= require("artTemplate");
var moneyCny 		= require("kit/money_cny");
var tipMessage		= require("ui/tip_message/tip_message");
var scroll 			= require("kit/scroll");
var model 			= require("model");

var TIPS = {
	RED_TIPS: "“返现{0}元”",
	RED_EMPTY: "暂无可用",
	RED_NO_USABLE: "未使用",
	CURRENT_APPLY: "当前不适用",
	EXCHANGE_TIPS: "兑换{0}元红包需单笔投资满{1}元以上",
	RED_AMOUNT: "<span class='first'>已选择使用</span> <span class='last'>“返现{0}元”</span>"
};


var views = function (options) {
	options = options || {};

	this.index 		= -1;
	this.isLoad 	= false;
	this.use 		= [];
	this.money 		= options.money || 0;
	this.options  	= options.data || {};
	this.productId 	= options.productId || "";
	this.container 	= options.container || $("body");

	this.onChange 	= options.onChange || function () {};
	this.onClose 	= options.onClose || function () {};
	this.onLoad 	= options.onLoad || function () {};

	this.model  	= new model({productId: this.productId});

	this.init();
};

views.prototype.init = function () {

	this.template = {};
	this.template.item 		= artTemplate.compile(__inline("item.tmpl"));
	this.template.context 	= artTemplate.compile(__inline("context.tmpl"));

	this.ui = {};
	this.ui.wrap 		= $(this.template.context());
	this.ui.packet 		= this.ui.wrap.find(".js-packet");
	this.ui.amount 		= this.ui.wrap.find(".js-amount");
	this.ui.context 	= this.ui.wrap.find(".js-context");
	this.ui.container 	= this.ui.wrap.find(".js-container");
	this.ui.btnComplete	= this.ui.wrap.find(".js-complete");
	this.ui.redTips		= this.ui.wrap.find(".js-redTips");
	this.ui.empty 		= this.ui.wrap.find(".js-empty");
	this.ui.noSelected = this.ui.wrap.find(".js-noSelected");

	this.getRedPacket();

	this.regEvent();
	this.container.append(this.ui.wrap);
};


views.prototype.regEvent = function () {
	var _this = this;

	this.ui.btnComplete.on("click", $.proxy(function () {
		this.close();
	}, this));

	this.ui.wrap.on("click", $.proxy(function () {
		this.close();
	}, this));

	this.ui.packet.on("click", $.proxy(function () {
		return false;
	}, this));


};

views.prototype.getRedPacket = function () {
	var _this = this;

	var options = {
		data: {}
	};

	options.success = function (data) {
		//初始化红包提示
		this.onLoad(this.getSateText());

		if(data.length == 0){
			this.showEmpty();
			return;
		}
			
		this.ui.context.html(this.template.item({
			data: data
		}));

		this.ui.context.find(".js-item").on("tap", function () {
			_this.selected($(this).data("index"));
		});

		this.isLoad = true;	
	};

	options.error = function (e) {
		this.isLoad = true;
		this.showEmpty();
	};


	this.model.getList(options, this);	
};

views.prototype.rander = function () {
	var data = this.getData();
	var item = this.ui.context.find(".js-item");

	this.use = [];
	item.removeClass("pack-selected");
	item.removeClass("gray");

	for(var i = 0; i < data.length; i++){
		if(this.model.getIsUsable(data[i])){
			this.use.push(data[i]);
		}else{
			item.eq(i).addClass("gray");
		}
	}
};

views.prototype.showEmpty = function () {
	this.ui.redTips.hide();
	this.ui.context.hide();
	this.ui.empty.show();
	this.ui.noSelected.show();
};

views.prototype.close = function () {
	this.ui.wrap.hide();
	this.onClose(this.getData(this.index));
};

views.prototype.show = function () {
	this.ui.wrap.show();
	this.initScroll();

	if(this.index > -1){
		var top = this.getScrollTop();

		this.scroll.setScrollTop(top * -1);
		//this.ui.context.parent().scrollTop(top);
	}
};

views.prototype.setMoney = function (money) {
	if(!this.isLoad){
		var callee = arguments.callee;

		setTimeout($.proxy(function () {
			callee.call(this, money);
		}, this), 50);

		return;
	}

	this.model.setMoney(money);

	this.rander();
	this.autoSelected(money);
};

views.prototype.setSelectText = function (data) {
	if(data){
		this.ui.redTips.show();
		this.ui.noSelected.hide();
		this.ui.amount.text(TIPS.RED_TIPS.format(data.newMoney));
		return false;
	}

	this.ui.redTips.hide();
	this.ui.noSelected.show();
};

views.prototype.getData = function (index) {
	return this.model.getData(index);
};

views.prototype.autoSelected = function (money) {
	var list  = this.getData();
	var data  = null;
	var index = -1;

	for(var i = 0; i < list.length; i++){
		if(this.model.getIsUsable(list[i])){
			if(!data || data.fMoney < list[i].fMoney){
				index = i;
				data  = list[i];
			}
		}
	}

	this.index = -1;
	this.selected(index);
};

views.prototype.selected = function (index) {
	var data 	= this.getData(index);
	var item 	= this.ui.context.find(".js-item");

	if(this.index == index){
		this.index = -1;
		item.removeClass('pack-selected');
		
		this.setSelectText(null);
		this.onChange(this.getSateText());
		return false;	
	}

	if(data && this.model.getIsUsable(data)){
		this.index = index;
		item.removeClass('pack-selected');
		item.eq(this.index).addClass('pack-selected');

		if(this.scroll){
			this.scroll.setScrollTop(this.getScrollTop() * -1);
		}

		this.setSelectText(data);
		this.onChange(this.getSateText());
		return false;
	}

	tipMessage.show(TIPS.EXCHANGE_TIPS.format(data.newMoney, data.newOriginMoney), {delay: 2000});
};

views.prototype.getSelected = function () {
	return this.getData(this.index);
}

views.prototype.initScroll = function () {
	if(!this.scroll){
		var padding 	= 50;
		var context 	= this.ui.context.height();
		var container 	= this.ui.container.height();
		var height 		= context - container + padding;
			height 		= height < 0 ? 0 : height; 

		this.scroll = new scroll({
			maxHeight: height,
			context: this.ui.container
		});
	}
};

views.prototype.getScrollTop = function () {
	var dom = this.ui.context.find(".js-item").eq(this.index);
	
	return dom.height() * this.index;
};

views.prototype.getUse = function () {
	return this.use || [];
}

views.prototype.getSateText = function () {
	if(this.getData().length == 0){
		return TIPS.RED_EMPTY;
	}

	if(this.getUse().length == 0 && this.model.getMoney() == 0){
		return TIPS.CURRENT_APPLY;
	}

	if(this.index > -1){
		var data = this.getData(this.index);

		return TIPS.RED_AMOUNT.format(data.newMoney);
	}

	return TIPS.RED_NO_USABLE;
}

 module.exports = views;