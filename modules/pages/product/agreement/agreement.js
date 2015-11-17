/**
 * @require style.css  
 */
var $ 				= require("zepto");
var api 			= require("api/api");
var user 			= require("kit/user");
var validate 		= require("kit/validate");
var moneyCny 		= require("kit/money_cny");
var serverTime 		= require("kit/server_time");
var queryString 	= require("kit/query_string");

var DATE_UNIT = {
	"1": "天",
	"2": "个月"
};

//1：天添牛，2：指数牛，3：活期宝 4:惠房宝 5: 信托一号

var agreement = {
	init: function () {
		
		this.ui = {}
		this.ui.name 		= $(".span-name");
		this.ui.mobile 		= $(".span-mobile");
		this.ui.idcard 		= $(".span-idcard");
		this.ui.date 		= $(".span-date");
		this.ui.dateHz		= $(".span-date-hz");
		this.ui.bankCard 	= $(".span-bank-card");
		
		this.queryString = queryString();

		if(this.isGetData()){
			this.getData();
		}
	},
	getData: function () {
		var options = {
			data: {}
		};

		if(this.queryString.typeValue){
			options.data.typevalue  = this.queryString.typeValue;
		}
		
		if(this.queryString.fId){
			options.data.recordId  = this.queryString.fId;
		}

		options.success = function (e) {
			var result 	= e.data;

			this.setIdentity(result);

			if(this.queryString.fId){
				this.setProduct(this.format(result));
			}
		};

		options.error = function (e) {

		};

		api.send(api.PRODUCT, "getProtocol", options, this);
	},
	setIdentity: function (result) {
		var context = $("body");
		var date = serverTime.getServerTime();

		if(!validate.isEmpty(result.investTime)){
			date = result.investTime.parseDate();
		}

		this.setText(this.ui.date, date.format("yyyy-MM-dd"));
		this.setText(this.ui.dateHz, date.format("yyyy年MM月dd日"));

		this.setText(this.ui.name, result.memberName);
		this.setText(this.ui.idcard, result.certNo);
		this.setText(this.ui.bankCard, result.bankCardNo);
		this.setText(this.ui.mobile, this.getMobile(result.mobile));
		this.setText(context.find(".span-day-num"), this.queryString.deadLineValue);
	},
	setProduct: function (result) {
		var context = $("body");

		this.setText(context.find(".span-amount-big"), result.amountBig);
		this.setText(context.find(".span-amount-small"), result.amountSmall);

		this.setText(context.find(".span-start-year"), this.getYear(result.startYear));
		this.setText(context.find(".span-start-month"), result.startMonth);
		this.setText(context.find(".span-start-day"), result.startDay);

		this.setText(context.find(".span-end-year"), this.getYear(result.endYear));
		this.setText(context.find(".span-end-month"), result.endMonth);
		this.setText(context.find(".span-end-day"), result.endDay);

		this.setText(context.find(".span-day-num"), result.dayNum);
		this.setText(context.find(".span-day-unit"), result.dayUnit);
		this.setText(context.find(".span-interest"), result.interest);
	},
	setText: function (dom, value) {
		if(dom.length == 0){
			return;
		}

		if(!validate.isEmpty(value)){
			dom.text(value);
			return;
		}
	},
	getMobile: function (mobile) {
		if(!validate.isEmpty(mobile)){
			return mobile;
		}

		if(!validate.isEmpty(user.get("loginName"))){
			return user.get("loginName");
		}

		return "";
	},

	isGetData: function () {
		if(this.ui.name.length > 0){
			return true;
		}

		if(this.ui.mobile.length > 0){
			return true;
		}

		if(this.ui.idcard.length > 0){
			return true;
		}

		if(this.ui.bankCard.length > 0){
			return true;
		}

		return false;
	},

    ///<summery>小写金额转化大写金额</summery>
    ///<param name=num type=number>金额</param>
	AmountLtoU: function (num) {
        if(isNaN(num)) return "无效数值！";

        var strPrefix = "";

        if(num < 0){
        	strPrefix ="(负)";
    	}

        num = Math.abs(num);

        if(num >= 1000000000000) return "无效数值！";

        var strOutput = "";
        var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        var strCapDgt='零壹贰叁肆伍陆柒捌玖';

        num += "00";

        var intPos = num.indexOf('.');

        if (intPos >= 0){
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        }

        strUnit = strUnit.substr(strUnit.length - num.length);

        for (var i=0; i < num.length; i++){
            strOutput += strCapDgt.substr(num.substr(i,1),1) + strUnit.substr(i,1);
        }

        return strPrefix + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    },
    getYear: function  (year) {
    	if(validate.isEmpty(year)){
    		return "";
    	}

    	return year.toString().substring(3);
    },

    format: function (result) {
    	var data = {};
    	var endDate 	= null; 
    	var startDate 	= null; 
    	var amount 		= moneyCny.toYuan(result.investMoney);

    	if(!validate.isEmpty(result.endDate)){
    		endDate = result.endDate.parseDate();
    	}

    	if(!validate.isEmpty(result.startDate)){
    		startDate = result.startDate.parseDate();
    	}
    	
    	if(!validate.isEmpty(result.fixRate)){
	    	data.interest 	= result.fixRate + "%";
	    }

	    if(Number(result.investMoney) > 0){
	    	data.amountSmall = amount;
	    	data.amountBig 	 = this.AmountLtoU(amount);
	    }

    	if(!validate.isEmpty(result.startDate)){
	    	data.startYear	= startDate.getFullYear();
	    	data.startMonth = startDate.getMonth() + 1;
	    	data.startDay 	= startDate.getDate();
	    }

	    if(!validate.isEmpty(result.endDate)){
	    	data.endYear	= endDate.getFullYear();
	    	data.endMonth 	= endDate.getMonth() + 1;
	    	data.endDay 	= endDate.getDate();
	    }

	    if(!validate.isEmpty(result.deadLineValue)){
	    	data.dayNum		= result.deadLineValue;
	    }

	    if(!validate.isEmpty(result.deadLineType)){
	    	data.dayUnit 	= DATE_UNIT[result.deadLineType];
	    }

    	return data;
    }
};

agreement.init();