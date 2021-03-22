"use strict";

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
    
    var d=new Date();
    console.info("mp_leitstellenspiel_extras starting (" + s + ")");
    console.group("mp_leitstellenspiel_extras running");
    d.setDate(d.getDate()+2); // add two days to wait
    localStorage.setItem("mp_hire_started",d.getTime());
    mp_hire(0);
    
}

mp_hire_start();
