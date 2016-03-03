/**
 * @require yy.css
 */
var $               = require("zepto");
var getDefaultUri   = require("kit/default_uri");
var queryString     = require("kit/query_string");
var sliderBar       = require("ui/slider_bar/slider_bar");
var tipMessage      = require("ui/tip_message/tip_message");
var registerViews   = require("pages/user/register/register_views");
var replaceMobile   = require("kit/replace_mobile.js");

var register = {
    init: function () {
        var _this = this;

        this.ui = {};
        this.ui.txtMobile       = $("#txt-mobile");
        this.ui.txtCode         = $("#txt-code");
        this.ui.txtPassword1    = $("#txt-password1");
        this.ui.txtPassword2    = $("#txt-password2");
        //推荐人
        this.ui.txtRecommend    = $("#txt-recommend");
        this.ui.btnSubmit       = $("#btn-submit");
        this.ui.btnSend         = $("#btn-send");
        this.ui.btnDisSend      = $("#btn-dis-send");
        this.ui.btnShowPass     = $("#btn-showpass");
        this.ui.btnPact         = $("#btn-pact");
        this.ui.txtImgCode      = $("#txt-imgCode");
        this.ui.btnCode         = $("#btn-code");
        this.ui.successPage     = $("#success-page");
        this.ui.mobileNum       = $("#mobile-num");
        this.ui.page1           = $("#page1");
        this.ui.btnSubmit1      = $("#btn-submit1");
        this.ui.btnHome         = $("#btn-home");

        this.queryString = queryString() || {};

        this.views = new registerViews({
            param: this.queryString,
            redirect: this.queryString.redirect,
            txtCode: this.ui.txtCode,
            txtMobile: this.ui.txtMobile,
            txtPassword1: this.ui.txtPassword1,
            txtPassword2: this.ui.txtPassword2,
            txtRecommend: this.ui.txtRecommend,
            btnSubmit: this.ui.btnSubmit,
            btnSend: this.ui.btnSend,
            btnDisSend: this.ui.btnDisSend,
            btnShowPass: this.ui.btnShowPass,
            txtImgCode: this.ui.txtImgCode,
            btnCode: this.ui.btnCode
        });

        this.views.onCheckMobile = function (result) {
            if (result) {
                tipMessage.show("该号码已注册，请直接登录", {delay: 2000});
            }
        };

        this.views.onSuccess = function (result) {
            var mobileNum = replaceMobile(_this.ui.txtMobile.val().trim());
            _this.data = result;
            $("title").html("下载APP领取新手福利");
            _this.ui.mobileNum.html('('+mobileNum+')');
            _this.ui.successPage.show();
            _this.ui.page1.hide();
        };
        this.regEvent();
    },
    regEvent: function () {
        this.ui.btnPact.on("touchstart", $.proxy(function () {
            var state = this.ui.btnPact.data("state");

            if (state == 1) {
                this.setDisSubmit();
                this.ui.btnPact.data('state', 0);
                this.ui.btnPact.removeClass('hover');
                return false;
            }

            this.activateSubmit();
            this.ui.btnPact.data('state', 1);
            this.ui.btnPact.addClass('hover');

            return false;
        }, this));

        this.ui.btnSubmit1.on("touchstart", $.proxy(function () {
            $("body").scrollTop(0);
            return false;
        }, this));

        this.ui.btnHome.on("touchstart", $.proxy(function () {
            this.views.complete(this.data);
        }, this));


        $(window).on("scroll", $.proxy(function () {
            this.btnPositionY = parseFloat(this.ui.btnSubmit.offset().top)+parseFloat(this.ui.btnSubmit.height());
            if($("body").scrollTop() >this.btnPositionY){
                //this.ui.btnSubmit1.show();
                this.ui.btnSubmit1.css('position','fixed');
                return false;
            }else {
                //this.ui.btnSubmit1.hide();
                this.ui.btnSubmit1.css('position','absolute');
                return false;
            }
        }, this));

    },

    setDisSubmit: function () {
        this.ui.btnSubmit.addClass('oper-btn-gray');
    },
    activateSubmit: function () {
        this.ui.btnSubmit.removeClass('oper-btn-gray');
    },
};
register.init();