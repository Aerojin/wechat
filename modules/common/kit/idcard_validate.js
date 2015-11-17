module.exports = function (idCard) {

	this.idCard = idCard.trim();
	this.valideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];   				 // 身份证验证位值.10代表X 
	this.wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子   	

	this.init = function () {
		if(this.idCard.length != 18){
			return false;
		}

		return this.isValidityBrith(this.idCard) && this.isTrueValidateCode(this.idCard.split(""));
	};

	/**  
	 * 判断身份证号码为18位时最后的验证位是否正确  
	 * @param idCard 身份证号码数组  
	 * @return  
	 */ 
	this.isTrueValidateCode = function (idCard) {
		var sum = 0; 	// 声明加权求和变量   

		if(idCard[17].toLowerCase() == "x"){
			idCard[17] = 10;
		}

		for(var i = 0; i < 17; i++){
			sum += this.wi[i] * idCard[i];
		}

		return idCard[17] == this.valideCode[sum % 11];
	};

	/**  
	  * 验证18位数身份证号码中的生日是否是有效生日  
	  * @param idCard 18位书身份证字符串  
	  * @return  
	  */
	this.isValidityBrith = function (idCard) {
		var year =  parseFloat(idCard.substring(6,10));   
	    var month = parseFloat(idCard.substring(10,12));
	    var day = parseFloat(idCard.substring(12,14));
	    var date = new Date(year, month - 1, day);

	    // 这里用getFullYear()获取年份，避免千年虫问题
	    return date.getFullYear() == year && date.getMonth() == month - 1 && date.getDate() == day;
	};
	

	return this.init();
};