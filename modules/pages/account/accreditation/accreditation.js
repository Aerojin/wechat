/**
 * @require style.css  
 */
 var $ 				= require("zepto");
 var api			= require("api/api");
 var validate 		= require("kit/validate");
 var select 		= require("ui/select/select");
 var idCardValidate	= require("kit/idcard_validate");
 var queryString 	= require("kit/query_string");
 var smartbar		= require("ui/smartbar/smartbar");
 var backConfig		= require("ui/bank_config/bank_config");
 var loading 		= require("ui/loading_button/loading_button");
 var tipMessage		= require("ui/tip_message/tip_message");

var TIPS = {
	SAVE_SUCCESS: "保存成功",
	IDCARD_ERROR: "身份证格式错误",
	SYS_ERROR: "网络异常,请稍后重试"
};

var accreditation = {

	data: {},

	isEdit: true,

	init: function () {

		this.ui = {};
		this.ui.cardForm 	= $("#card-form");
		this.ui.txtName 	= $("#txt-name");
		this.ui.txtIdCard 	= $("#txt-idcard");
		this.ui.txtCard 	= $("#txt-card");
		this.ui.txtInput 	= $(".txt-input");
		this.ui.btnSave		= $("#btn-save");
		this.ui.btnChange	= $("#btn-change");
		this.ui.btnRecharge	= $("#btn-recharge");
		this.ui.divSelect 	= $("#div-select");
		this.ui.divCard 	= $("#div-card");
		this.ui.edit 		= $("#edit");
		this.ui.views 		= $("#views");
		this.ui.btnCancel 	= $("#btn-cancel");

		this.smartbar = smartbar.create();
		
		this.regEvent();
		this.getBank();
		this.getIdentityInfoByUser();
	},
	regEvent: function () {
		var _this = this;

		this.ui.btnSave.on("touchstart click", $.proxy(function () {
			if(this.check()){

				this.loading = loading(this.ui.btnSave);
				this.improveIdentityInfo();
			}

			return false;
		}, this));

		this.ui.btnChange.on("touchstart click", $.proxy(function () {
			this.ui.edit.show();
			this.ui.views.hide();

			return false;
		}, this));

		this.ui.btnCancel.on("touchstart click", $.proxy(function () {
			this.ui.edit.hide();
			this.ui.views.show();

			return false;
		}, this));

		this.ui.btnRecharge.on("touchstart click", $.proxy(function () {
			window.location.href = "$root$/account/voucher.html";

			return false;
		},this));

		this.ui.txtInput.on("input", function () {
			_this.toggleButton();
		});

		this.ui.txtCard.on("change", $.proxy(function () {
			this.checkAccount();
		}, this));

		this.ui.txtCard.on("input", $.proxy(function () {
			var value = this.ui.txtCard.val().trim();
				value = value.replace(/(\d{4})/ig, "$1  ");

			if(value.length > 0){
				this.ui.divCard.show().text(value);
				return;
			}

			this.ui.divCard.hide();
		}, this));
	},
	check: function () {
		var card = this.ui.txtIdCard.val().trim();

		if(this.ui.btnSave.hasClass('oper-btn-gray')){
			return false;
		}

		if(!idCardValidate(card)){
			tipMessage.show(TIPS.IDCARD_ERROR, {delay: 2000});
			return false;
		}

		return true;
	},
	toggleButton: function () {
		var name = this.ui.txtName.val().trim();
		var card = this.ui.txtCard.val().trim();
		var idCard = this.ui.txtIdCard.val().trim();

		if(name.length >= 2 && card.length >= 15 && idCard.length >= 18){
			this.ui.btnSave.removeClass('oper-btn-gray');
			return false;
		}

		this.ui.btnSave.addClass('oper-btn-gray');
	},
	getIdentityInfoByUser: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data;		

			result.userName = result.userName.replace(/\d+/g,'');

			this.setDataByUI(result);
			this.toggleButton();

			if(this.check()){
				this.ui.edit.hide();
				this.ui.views.show();
			}else{
				this.ui.edit.show();
				this.ui.views.hide();
			}

			//实名认证后,姓名,身份证不能修改
			if(result.authentication){
				this.ui.txtName.attr("readonly", "readonly");
				this.ui.txtIdCard.attr("readonly", "readonly");
			}
			
		};

		options.error = function (e) {
			this.toggleButton();
		};

		api.send(api.USER,"getIdentityInfoByUser", options, this);
	},

	improveIdentityInfo: function () {
		var options = {};

		options.data = {
			name: this.ui.txtName.val().trim(),
			idCardNo: this.ui.txtIdCard.val().trim(),
			bankCardNo: this.ui.txtCard.val().trim(),
			bankName: this.select.getSelected().bank_name,
			bankCode: this.select.getSelected().bank_code
		};

		options.success = function (e) {
			var result = e.data;

			var data = $.extend(options.data,{
				userName: options.data.name,
				identityCard: options.data.idCardNo
			});

			this.setDataByUI(data);
			tipMessage.show(TIPS.SAVE_SUCCESS, {delay: 1800});

			this.ui.edit.hide();
			this.ui.views.show();

			this.loading.close();
		};


		options.error = function (e) {
			this.loading.close();
			tipMessage.show(e.msg || TIPS.SYS_ERROR, {delay: 1800});
		};

		api.send(api.USER,"improveIdentityInfo", options, this);
	},

	checkAccount: function () {
		var options = {};

		options.data = {
			//uid: XN.User.getData().uid,
			bankCardNo: this.ui.txtCard.val().trim()
		};

		options.success = function (e) {
			var result = e.data;
			var cardInfo = result["cardInfoData"];

			this.select.setDefaultKey("bank_code", cardInfo["bank_code"]);
		};

		options.error = function (e) {
			//console.log("error", e);
		};

		api.send(api.ACCOUNT, "getBankCardInfo", options, this);
	},

	setSelect: function (bankCode) {
		var _this = this;

		if(!this.select){
			this.timer = window.setTimeout(function () {
				_this.setSelect(bankCode);
			}, 50);

			return;
		}

		this.select.setDefaultKey("bank_code", bankCode);
	},

	initSelect: function (result) {
		var _this = this;
		var options = {
			data: result,
			container: this.ui.divSelect
		};

		this.select = new select(options);

		this.select.onChange = function (obj) {
			_this.data.bankcode = obj.bank_code;
		};
	},
	getBank: function () {
		var options = {
			data: {}
		};

		options.success = function (e) {
			var result = e.data;

			for(var i = 0; i < result.list.length; i++){
				result.list[i].text = result.list[i].bank_name;
			}

			this.initSelect(result.list);
		};

		options.error = function (e) {
			tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 2000});
		};

		api.send(api.ACCOUNT, "queryBankList", options, this);
	},
	setDataByUI: function(result) {
		if(!validate.isEmpty(result.userName)){
			this.ui.txtName.val(result.userName);	
			this.ui.views.find(".lbl-name").text(result.userName);
		}

		if(!validate.isEmpty(result.identityCard)){
			this.ui.txtIdCard.val(result.identityCard);	
			this.ui.views.find(".lbl-idcard").text(result.identityCard);
		}

		if(!validate.isEmpty(result.bankCardNo)){
			this.ui.txtCard.val(result.bankCardNo);	
			this.ui.views.find(".lbl-cardno").text(result.bankCardNo);
		}

		if(!validate.isEmpty(result.bankCode)){
			this.setSelect(result.bankCode);
			this.ui.views.find(".card-ico").attr({src: backConfig.getBankIco(result.bankCode)});
		}
	}

};

accreditation.init();