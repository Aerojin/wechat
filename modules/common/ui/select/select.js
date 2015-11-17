/**
 * @require style.css
 */

var $ 			= require("zepto");
var artTemplate = require("artTemplate");

var select = function (options) {

	/*
		data 数据列表
		[{text: "湖北", value: "123"}, {text: "广东", value: "456"}]
		
		defaultText  默认显示的text
		defaultIndex 默认显示的索引
		
		如果两个值都设定了, 则以索引为准

		container  	 父容器
	*/

	options = options || {};

	this.data 			= options.data || [];
	this.defaultText 	= options.defaultText || "";
	this.defaultIndex 	= options.defaultIndex || 0;
	this.container 		= options.container;
	this.isShowMenu		= false;

	this.init();
};

$.extend(select.prototype, {
	init: function () {

		var template =  artTemplate.compile(__inline("select.tmpl"));
			template = template({
				data: this.data
			});

		this.ui = {};
		this.ui.body 		= $("body");
		this.ui.wrap 		= $(template);
		this.ui.selected 	= this.ui.wrap.find(".selected");
		this.ui.selectMenu 	= this.ui.wrap.find(".select-menu");
		this.ui.btnSelect 	= this.ui.wrap.find(".btn-select");

		if(this.defaultText){
			this.setDefaultText(this.defaultText);
		}

		if(this.defaultIndex >= 0 ){
			this.setDefaultIndex(this.defaultIndex);
		}

		this.regEvent();

		this.onChange(this.getSelected());
		this.container.empty().append(this.ui.wrap);
	},
	regEvent: function () {
		var _this = this;

		this.ui.body.on("click", $.proxy(function () {
			if(this.isShowMenu){
				this.hide();
			}

			//return false;
		}, this));

		this.ui.wrap.on("touchstart click", $.proxy(function () {
			if(!this.isShowMenu){
				this.show();
			}else{
				this.hide();
			}

			return false;
		}, this));

		this.ui.selectMenu.delegate("li", "touchstart click", function () {
			_this.change(parseInt($(this).data("index")));

			return false;
		});
	},
	hide: function () {
		this.isShowMenu = false;
		this.ui.selectMenu.hide();
	},
	show: function () {
		this.isShowMenu = true;
		this.ui.selectMenu.show();
	},
	setDefaultText: function (text) {
		for(var i = 0; i < this.data.length; i++){
			if(this.data[i].text == text){
				this.setDefaultIndex(i);
				break;
			}
		}
	},
	setDefaultKey: function (key, value) {
		for(var i = 0; i < this.data.length; i++){
			if(this.data[i][key] == value){
				this.setDefaultIndex(i);
				break;
			}
		}
	},
	setDefaultIndex: function (index) {
		index = index < 0  ? 0 : index;
		index = index >= this.data.length ? this.data.length - 1 : index;

		this.change(index);
	},
	getSelected: function () {
		return this.data[this.defaultIndex];
	},
	change: function (index) {
		this.defaultIndex = index;
		this.ui.selected.text(this.getSelected().text);

		this.hide();
		this.onChange(this.getSelected());
	},
	onChange: function () {

	}
});

module.exports = select;