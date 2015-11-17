var $ 				= require("zepto");
var api 			= require("api/api");
var serverTime 		= require("kit/server_time");
var artTemplate 	= require("artTemplate");
var moneyCny 		= require("kit/money_cny");
var appApi 		 	= require("kit/app_api");
var tipMessage		= require("ui/tip_message/tip_message");
var scroll 			= require("scroll");

var STATUS = {
	OVERDUE: "OVERDUE",
	EXCHANGED: "EXCHANGED",
	UNEXCHANGE: "UNEXCHANGE"
};

var TIPS = {
	RED_TIPS: "“返现{0}元”",
	EXCHANGE_TIPS: "兑换{0}元红包需单笔投资满{1}元以上"
};


var packet = function (options) {
	options = options || {};

	this.index 		= -1;
	this.data 		= [];
	this.isLoad 	= false;
	this.use 		= [];
	this.money 		= options.money || 0;
	this.options  	= options.data || {};
	this.productId 	= options.productId || "";

	this.init();
};

packet.prototype.init = function () {

	this.ui = {};
	this.ui.wrap 		= $("#packet-wrap");
	this.ui.packet 		= $("#div-packet");
	this.ui.redTips 	= $("#span-redTips");
	this.ui.context 	= $("#div-context");
	this.ui.container 	= this.ui.context.parent();
	this.ui.btnComplete	= $("#btn-complete");
	this.ui.pRedTips	= $("#p-redTips");
	this.ui.empty 		= $("#div-empty");
	this.ui.pNoSelected = $("#p-noSelected");

	this.template = artTemplate.compile(__inline("redpacket.tmpl"));

	this.getRedPacket();
	this.regEvent();
};

packet.prototype.regEvent = function () {
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


	this.ui.context.on("tap", ".bag-box", function () {
		_this.selected($(this).data("index"));
	});
};

packet.prototype.getRedPacket = function () {
	var options = {};

	options.data = {
		status: STATUS.UNEXCHANGE,
		productId: this.productId || ""
	};

	options.success = function (e) {
		var result = e.data || {};
		var data = this.format(result.list || []);
		
		this.data = data;

		if(this.data.length == 0){
			this.showEmpty();
			return;
		}
			
		this.ui.context.html(this.template({
			data: data
		}));

		this.isLoad = true;
	};

	options.error = function (e) {
		this.isLoad = true;
		this.showEmpty();
	};

	api.send(api.ACTIVITY, "findRedPacketList", options, this);
};

packet.prototype.rander = function () {
	var item = this.ui.context.find(".bag-box");

	this.use = [];
	item.removeClass("ico-zon");
	item.removeClass("un-have");

	for(var i = 0; i < this.data.length; i++){
		if(this.getIsUsable(this.data[i])){
			this.use.push(this.data[i]);
			item.eq(i).addClass("ico-zon");
		}else{
			item.eq(i).addClass("un-have");
		}
	}
};

packet.prototype.format = function (data) {
	var _this = this;

	data.map(function(value, index){
		value.index 			= index;
		value.isSelected 		= index == _this.index;
		value.isUsable	 		= _this.getIsUsable(value);
		value.newMoney 	 		= moneyCny.toYuan(value.fMoney);
		value.newOriginMoney	= moneyCny.toYuan(value.fOriginMoney);
		value.newExpireDay 		= _this.getDiffTime(value.fExpireDate).fExpireDay;
	});

	return data;
};

packet.prototype.getDiffTime = function (date) {
	var date2 = date.parseDate();
	var date1 = serverTime.getServerTime();		
	var diffTime = serverTime.getServerDiff(date1, date2);

	if(diffTime.day > 0){
		return {
			expireDay: diffTime.day,
			fExpireDay: diffTime.day + "天"
		};
	}

	if(diffTime.hour > 0){
		return {
			expireDay: diffTime.hour,
			fExpireDay: diffTime.hour + "个小时"
		};
	}

	if(diffTime.minute > 0){
		return {
			expireDay: diffTime.minute,
			fExpireDay: diffTime.minute + "分钟"
		};
	}

	return {
		expireDay: 0, 
		fExpireDay: date2.format("yyyy-MM-dd")
	};
};

packet.prototype.showEmpty = function () {
	this.ui.pRedTips.hide();
	this.ui.context.hide();
	this.ui.empty.show();
	this.ui.pNoSelected.show();
};

packet.prototype.close = function () {
	this.ui.wrap.hide();
	this.onClose(this.getData(this.index));
};

packet.prototype.show = function () {
	this.ui.wrap.show();
	this.initScroll();

	if(this.index > -1){
		var top = this.getScrollTop();

		this.scroll.setScrollTop(top * -1);
		//this.ui.context.parent().scrollTop(top);
	}
};

packet.prototype.setMoney = function (money) {
	if(!this.isLoad){
		var callee = arguments.callee;

		setTimeout($.proxy(function () {
			callee.call(this, money);
		}, this), 50);

		return;
	}

	this.money = money;

	this.rander();
	this.autoSelected(money);
};

packet.prototype.setSelectText = function (data) {
	if(data){
		this.ui.pRedTips.show();
		this.ui.pNoSelected.hide();
		this.ui.redTips.text(TIPS.RED_TIPS.format(data.newMoney));
		return false;
	}

	this.ui.pRedTips.hide();
	this.ui.pNoSelected.show();
};

packet.prototype.getData = function (index) {
	if(index === undefined){
		return this.data || [];
	}

	return this.data[index] || {};
};

packet.prototype.getIsUsable = function (data) {
	var money = moneyCny.toHao(this.money);

	return data.fOriginMoney <= money;
};

packet.prototype.autoSelected = function (money) {
	var data  = null;
	var index = -1;

	for(var i = 0; i < this.data.length; i++){
		if(this.getIsUsable(this.data[i])){
			if(!data || data.fMoney < this.data[i].fMoney){
				index = i;
				data  = this.data[i];
			}
		}
	}

	this.index = -1;
	this.selected(index);
};

packet.prototype.selected = function (index) {
	var data 	= this.data[index];
	var item 	= this.ui.context.find(".bag-box");

	if(this.index == index){
		this.index = -1;
		item.removeClass('ico-selected');
		
		this.setSelectText(null);
		this.onChange(null, this.data.length);
		return false;	
	}

	if(data && this.getIsUsable(data)){
		this.index = index;
		item.removeClass('ico-selected');
		item.eq(this.index).addClass('ico-selected');

		if(this.scroll){
			this.scroll.setScrollTop(this.getScrollTop() * -1);
		}

		this.setSelectText(data);
		this.onChange(data, this.data.length);
		return false;
	}

	tipMessage.show(TIPS.EXCHANGE_TIPS.format(data.newMoney, data.newOriginMoney), {delay: 2000});
};

packet.prototype.getSelected = function () {
	return this.data[this.index] || {};
}

packet.prototype.initScroll = function () {
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

packet.prototype.getScrollTop = function () {
	var dom = this.ui.context.find(".bag-box").eq(this.index);
	
	return dom.height() * this.index;
};

packet.prototype.getUse = function () {
	return this.use || [];
}

packet.prototype.onChange = function (data) {
	
};

packet.prototype.onClose = function (data) {
	
};

module.exports = packet; 