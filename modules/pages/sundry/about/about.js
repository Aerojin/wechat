/**
 * @require common.css
 */
var $ 	= require("zepto");


var about = {
    init: function () {
        var winHeightfu = function(){
            var winHeight = document.querySelectorAll("section");
            var swipercontainer=document.getElementById('swiper-container');
            var myHeight = document.documentElement.clientHeight;
            for(var i=0;i<winHeight.length;i++){
                winHeight[i].style.height = myHeight  + 'px';
            };
            swipercontainer.style.height = myHeight+'px';

        };

        window.onresize = function () {
            winHeightfu();
        };
        winHeightfu();
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            direction: 'vertical',
        });
    }
};
about.init();