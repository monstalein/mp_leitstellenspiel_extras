"use strict";

(($, sessionStorage)=> {
    
    if (location.href.indexOf("alliance_chat")>=0 && sessionStorage.getItem("mp_username")) {
        
        window.setTimeout(()=>{
            
            $('.well p:contains("' + sessionStorage.getItem("mp_username") + '")').each((i,e)=>{
                
                if ($(e).text().indexOf(sessionStorage.getItem("mp_username")) === 0) { // starts with username - was maybe personal
                
                    $(e).closest("div").css("outline", "4px solid #600");
                    
                } else {
                    
                    $(e).closest("div").css("outline", "4px solid #d00");
                    
                }
            });
            
            $('.well a:contains("' + sessionStorage.getItem("mp_username") + '")').closest("div").css("outline", "4px solid #0d0");
            
        }, 100);
    }

})($, sessionStorage);
