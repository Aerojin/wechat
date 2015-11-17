var $ 			= require("zepto");
var api			= require("api/api");
var tipMessage	= require("ui/tip_message/tip_message");

var pay = {
	lianlian: {
		pay: function(loading) {

			var options = {
				data: this.voucherData.getData()
			};

			options.success = function (e) {
				var result = e.data;

				this.voucherData.clear();

				loading.close();
				$("#req-data").val(result.payParaMap.req_data);
				$("#form-pay").attr("action", result.payUrl);

				$("#form-pay").submit();
			};

			options.error = function (e) {
				loading.close();
				tipMessage.show(e.msg || this.TIPS.SYS_ERROR, {delay: 1800});
			};
			
			api.send(api.ACCOUNT, "directPay", options, this);
		}
	},
	kuaiqian: {
		pay: function (loading) {			
			window.location.href = "$root$/account/kuaiqian_pay.html";
		}
	}
};

module.exports = pay