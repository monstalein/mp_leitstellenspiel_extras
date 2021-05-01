"use strict";

var mp_speed=["Realistisch", "Normal", "Schnell", "Turbo", "Langsam", "Extrem langsam", "Pause"];

(()=>{

    mp_show_speed();    
    
})();

function mp_show_speed() {
    
    if (typeof mission_speed !== "undefined") {
        
        if (!$('#mission_speed_pause').is(':visible')) {
            
            $('#mission_speed_pause').show();
        }
        
        $('#mission_speed_pause').removeClass("label-info").removeClass("label-warning");
        
        if (mission_speed == 6) {
            
            $('#mission_speed_pause').addClass("label-warning").empty().append('<span class="glyphicon glyphicon-pause"></span> Pause');
            
        } else {
            
            $('#mission_speed_pause').addClass("label-info").empty().append('<span class="glyphicon glyphicon-play"></span> ' + mp_speed[mission_speed]);
            
        }
    }
    window.setTimeout(()=> {
        
        mp_show_speed();
        
    }, 1000);
}
