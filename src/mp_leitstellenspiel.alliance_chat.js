"use strict";

(($, localStorage)=> {
    
    if (location.href.indexOf("alliance_chat")>=0 && localStorage.getItem("mp_username")) {
        
        window.setTimeout(()=>{
            
            $('.well p:contains("' + localStorage.getItem("mp_username") + '")').each((i,e)=>{
                
                if ($(e).text().indexOf(localStorage.getItem("mp_username")) === 0) { // starts with username - was maybe personal
                
                    $(e).closest("div").css("outline", "4px solid #600");
                    
                } else {
                    
                    $(e).closest("div").css("outline", "4px solid #d00");
                    
                }
            });
            
            $('.well a:contains("' + localStorage.getItem("mp_username") + '")').closest("div").css("outline", "4px solid #0d0");
            
        }, 100);
    }

})($, localStorage);
