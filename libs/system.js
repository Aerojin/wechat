;(function (win, doc) {
    var max = 414;

    var setFontSize = function () {
        var myHTML = doc.querySelector("html");
        var myWidth = doc.documentElement.clientWidth > max ? max : doc.documentElement.clientWidth;

        myHTML.style.fontSize = 100 * myWidth / max  + 'px';
    };

    win.onresize = function () {
        setFontSize();
    };

    setFontSize();
})(window, document);

;(function (win, doc) {

	win.String.prototype.trim = function () {
		return this.replace(/(^\s*)|(\s*$)/g, '');
	};

	win.String.prototype.format = function (args) {
		var result = this;
        if (arguments.length > 0) {    
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
    　　　　　　　　　　var reg= new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
	};

    win.String.prototype.parseDate = function () {
        var str = this;

        if (/^\d{10}$/.test(str)) {
            return new Date(str * 1000);
        } else if (/^\d{13}$/.test(str)) {
            return new Date(str * 1);
        }

        str = str.trim();
        var reg = /^(\d{4})[\.\/-]?(\d{1,2})[\.\/-]?(\d{1,2})\s?(\d{1,2})?[:\s]?(\d{1,2})?[:\s]?(\d{1,2})?$/;
        var m = str.match(reg);
        if (m) {
            var year = m[1];
            var month = parseInt(m[2] - 1, 10);
            var day = parseInt(m[3], 10);
            var hour = parseInt(m[4] || 0, 10);
            var minutes = parseInt(m[5] || 0, 10);
            var seconds = parseInt(m[6] || 0, 10);
            return new Date(year, month, day, hour, minutes, seconds);
        } else {
            return null;
        }
    }

})(window, document);

;(function (win, doc) {

    var accDiv = function (arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {}
        with(Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }

    var accMul = function (arg1,arg2) {
        var m=0,s1=arg1.toString(),s2=arg2.toString();
        try{m+=s1.split(".")[1].length}catch(e){}
        try{m+=s2.split(".")[1].length}catch(e){}
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
    }

    var accAdd = function (arg1,arg2){   
        var r1,r2,m;   
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}   
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}   
        m=Math.pow(10,Math.max(r1,r2))   
        return (arg1*m+arg2*m)/m   
    } 

    Number.prototype.plus = function (arg){
        return accAdd(this, arg);
    };

    Number.prototype.mul = function (arg){
        return accMul(arg, this);
    };

    Number.prototype.div = function (arg){
        return accDiv(this, arg);
    };
})(window, document);


;(function (win, doc) {
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    Date.prototype.format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})(window, document);
