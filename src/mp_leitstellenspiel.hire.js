"use strict";

var mp_stopHiding = false;

(($, user_premium, localStorage)=>{

    $('#navbar-main-collapse ul.nav.navbar-nav.navbar-right').append(`
        <li>
            <a class="" id="mp_employee" style="cursor:progress;width:auto;min-width:126px;" onclick="return false;" id="mp_show_employee">
                <span class="label" style="background-color:#aa0;"><i class="glyphicon glyphicon-user"></i> <span>Angestellte</span></span>
                &nbsp;
            </a>
        </li>`
    );
    
    if (typeof user_premium !== "undefined" && user_premium!=true){
        var d=new Date(),s=localStorage.getItem("mp_hire_started");
        if (s==null||d.getTime()>(s*1)) {
            
            mp_hire_load();
            
        }else{
            console.info("mp_leitstellenspiel_extras waiting a few days to start");
            var h = (s-d.getTime())/86400000*24, m = (h - Math.floor(h))*60, sec = (m - Math.floor(m))*60;
            $('#mp_employee > span > span').text('Anheuern läuft wieder in ' + Math.floor(h) + 'h ' + ("00"+Math.floor(m)).substr(-2) + "m oder klicken für jetzt anheuern").attr("title", "Das Anheuern wird auf 3 Tage gestellt (automisch bleibt bestehen)");
            $('#mp_employee').css("cursor", "pointer");
            $('#mp_employee').off().click(()=>{
                $('#mp_employee').off().css("cursor", "wait");
                $('#mp_employee > span > span').text('einstellen läuft ...');
                mp_stopHiding=true;
                mp_hire_load();
                return false;
            });
            window.setTimeout(()=>{
                if (!mp_stopHiding) {
                    $('#mp_employee').hide('fade');
                }
            }, 12000);
        }
    }else{
        console.info("mp_leitstellenspiel_extras premium detected - nothing to do");
        $('#mp_employee > span > span').text('Anheuern bei Premium nicht aktiv').attr("title", "Hier klicken für jetzt anheuern. Das Anheuern wird auf 3 Tage gestellt (\"automisch\" bleibt bestehen)");
        $('#mp_employee').css("cursor", "pointer");
        $('#mp_employee').off().click(()=>{
                $('#mp_employee').off().css("cursor", "wait");
                $('#mp_employee > span > span').text('einstellen läuft ...');
                mp_stopHiding=true;
                mp_hire_load();
                return false;
            });
        window.setTimeout(()=>{
            if (!mp_stopHiding) {
                    $('#mp_employee').hide('fade');
                }
        }, 10000);
    }
    
    
})($, user_premium, localStorage);


function mp_hire(i){
    if (i < mp_buildings.length){
        console.log("einstellen läuft " + Math.round(((i+1)/mp_buildings.length*100),2) + "% (" + (i+1) + "/" + mp_buildings.length + ")");
        $.get(location.origin + "/buildings/" + mp_buildings[i] + "/hire_do/3");
        $('#mp_employee > span > span').text("einstellen läuft " + Math.round(((i+1)/mp_buildings.length*100),2) + "% (" + (i+1) + "/" + mp_buildings.length + ")").attr("title", "" + Math.round(((i+1)/mp_buildings.length*100),2) + "% (" + (i+1) + "/" + mp_buildings.length + ")");
//        $('#mp_employee .p1').css("width", (i/mp_buildings.length*99) + "%");
//        $('#mp_employee .p0').css("width", (100-(i/mp_buildings.length*99)) + "%");
        var v=i+1;
        window.setTimeout(()=>{
            mp_hire(v)
        },1000+(Math.random()*1000+500));
    }else{
        console.info("mp Done.");
        console.groupEnd();
        $('#mp_employee > span > span').text('einstellen beendet');
        window.setTimeout(()=>{
            $('#mp_employee').hide('fade');
        }, 5000);
    }
}

function mp_hire_start() {
    
    var d=new Date(),s=localStorage.getItem("mp_hire_started");
    console.info("mp_leitstellenspiel_extras starting (" + s + ")");
    console.group("mp_leitstellenspiel_extras running");
    d.setDate(d.getDate()+2); // add two days to wait
    localStorage.setItem("mp_hire_started",d.getTime());
    mp_hire(0);
    
}

mp_hire_start();
