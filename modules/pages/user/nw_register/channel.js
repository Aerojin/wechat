var $ 			= require("zepto");
var versions	= require("base/versions");
var queryString = require("kit/query_string");
var validate 	= require("kit/validate");

var channel = {
	keyword: {
		"baidu": {
			keyword: "wd",
			source: "shh"
		},
		"sougou": {
			keyword: "query",
			source: "_asf"
		},
		"360": {
			keyword: "q",
			source: "shh"
		},
		"shenma": {
			keyword: "word",
			source: ""
		},
		"webchat": {
			keyword: "keyword",
			source: "source"
		},
		"sina": {
			keyword: "keyword",
			source: "source"
		},
		"juanjiyun": {
			keyword: "keyword",
			source: "source"
		}
	},
	init: function () {
		var param = queryString() || {};
		var result = this.getParameter(param);

		if(!validate.isEmpty(result.keyword)){
			$.fn.cookie("keyword", result.keyword);
		}

		if(!validate.isEmpty(result.regSource)){
			$.fn.cookie("regSource", result.regSource);
		}

		if(!validate.isEmpty(result.source)){
			$.fn.cookie("searchEngine", result.source);
		}

		if(!validate.isEmpty(result.regChannel)){
			$.fn.cookie("regChannel", result.regChannel);
		}		
	},
	getParameter: function (param) {
		var result = {};

		result.source 		= param.source;
		result.regChannel 	= param.regChannel;
		result.keyword 		= this.getKeyword(param);
		result.regSource 	= versions.getCurrentSource();

		return result;
	},
	getKeyword: function (param) {
		if(param.source && this.keyword[param.source]){
			var key = this.keyword[param.source].keyword;

			if(param[key]){
				return param[key];
			}
		}else if(param.keyword){
			return param.keyword;
		}

		return "";
	}

};

channel.init();

