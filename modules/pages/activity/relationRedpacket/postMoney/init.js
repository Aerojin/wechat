var init = {
  initScroll : function(win,doc){
    var head_ght = doc.getElementById('headHeight');
       var listHd1 = doc.getElementById('list_hd1');
       var listHd2 = doc.getElementById('list_hd2');
       var bgHeight1 = doc.getElementById('bgHeight1');
       var bgHeight2 = doc.getElementById('bgHeight2');
       var polistBox1 = doc.getElementById('polistBox1');
       var polistBox2 = doc.getElementById('polistBox2');

       var headHeight = head_ght.offsetHeight;

       function getScrollTop(){  

           var scrollTop=0;  
             
           if(doc.documentElement&&doc.documentElement.scrollTop){  

               scrollTop=doc.documentElement.scrollTop;


           }else if(doc.body){  

               scrollTop=doc.body.scrollTop; 

           }  
           return scrollTop; 

       };
      win.onscroll = function(){
       if(getScrollTop()>polistBox1.offsetTop){
         list_hd1.className = 'fixeding list_hd';
         bgHeight1.style.display='block';

       }else if(getScrollTop()<polistBox1.offsetTop){
         list_hd1.className ='list_hd';
         bgHeight1.style.display='none';
       };


       if(getScrollTop()>polistBox2.offsetTop-listHd1.offsetHeight){

         list_hd1.className ='fixout list_hd';

       }; 

       if(getScrollTop()>polistBox2.offsetTop){
         list_hd2.className = 'fixeding list_hd';
         bgHeight2.style.display='block';

       }else if(getScrollTop()<polistBox2.offsetTop){
         list_hd2.className ='list_hd';
         bgHeight2.style.display='none';
       };  
     };
  }
};

module.exports = {
  create : function(win,doc){
    init.initScroll(win,doc);
  }
};