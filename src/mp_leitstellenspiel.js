"use strict";
if("undefined"==typeof jQuery)throw new Error("mp_leitstellenspiel_extras: No jQuery! Aborting!");
var mp_types=[0,2,6,9,11],mp_buildings=[],mp_employee=[],mp_emp_running=false;
var mp_speed=["Realistisch", "Normal", "Schnell", "Turbo", "Langsam", "Extrem langsam", "Pause"];
var mp_stopHiding = false;
var mp_version=1.01;

function mp_hire_load() {
    $.get("https://bigmama-online.de/leitstellenspiel/mp_leitstellenspiel.hire.js").done(()=>{
        console.log("hire loaded");
    });
}

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

function mp_lookup_personal(indx) {
    if (mp_emp_running) {
        //return false;
    }
    mp_emp_running=true;

//    if (indx <= mp_buildings.length) {
    if (indx <= 2) {
        
        
        $.get('https://www.leitstellenspiel.de/buildings/' + mp_buildings[indx] + '/personals')
            .done((d)=>{
                var t=$(d).find("#back_to_building").attr("href"),w=t.substring(t.lastIndexOf("/")+1);
                //alert("ID: " + w + "\n" + $(d).find("#personal_table").text());
                mp_employee = [];
                $(d).find("#personal_table tbody tr").each((i,e)=>{
                    var p=[];
                    p.push($(d).find('#back_to_building').text());
                    //$(e).children().each((i2,e2)=>{
                    //    p.push($(e2).text());
                    //});
                    for(var x=0;x<3;x++) p.push($($(e).children()[x]).text());
                    mp_employee.push(p);
                });
            })
            .fail((d,e,f)=>{console.info("FAIL",d,e,f);})
        ;

        
        var v=indx+1;
        window.setTimeout(()=>{
            mp_lookup_personal(v);
        },1000+(Math.random()*1000+500));
    }else{
        console.info("mp_lookup_personal done");
        console.info(mp_employee);
        mp_emp_running=false;
        $('#mp_show_employee span').removeClass('label-default').addClass('label-success');
        $('#mp_show_employee').on("click", ()=>{
            $('#mp_peronal_dlg').open();
        });
    }
}


$(function(){
    
    console.info("mp_leitstellenspiel_extras loading... (version " + mp_version + ")");
    
    $("#building_list > li").each((i,e)=>{ var t=jQuery(e).data("building_type_id");if (mp_types.indexOf(t)){mp_buildings.push(jQuery(e).children("ul").data("building_id"))}});
    
    window.setTimeout(()=>{
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
            $('#mp_employee > span > span').text('Anheuern bei Premium nicht aktiv oder hier klicken für jetzt anheuern').attr("title", "Das Anheuern wird auf 3 Tage gestellt (\"automisch\" bleibt bestehen)");
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
    }, 2500);

    
    window.setTimeout(()=>{
        $('#navbar-main-collapse ul.nav.navbar-nav.navbar-right').append(`
            <li>
                <a class="" id="mp_employee" style="cursor:progress;width:auto;min-width:126px;" onclick="return false;" id="mp_show_employee">
                    <span class="label" style="background-color:#aa0;"><i class="glyphicon glyphicon-user"></i> <span>Angestellte</span></span>
                    &nbsp;
                </a>
            </li>`
        );
//                    <div style="position:absolute;min-width:85px;">
//                        <div class="p1 label" style="padding:0;margin:0;display:inline-block;background-color:#0f0;width:0%;border-top-right-radius:0px;border-bottom-right-radius:0px;">&nbsp;</div>
//                        <div class="p0 label" style="padding:0;margin:0;display:inline-block;background-color:#e00;width:100%;border-top-left-radius:0px;border-bottom-left-radius:0px;">&nbsp;</div>
//                    &nbsp;</div>
//        //
        //$('#mp_show_employee').on("click",()=>{
        //    window.setTimeout(()=>{
        //        $('#lightbox_box').children("iframe").remove();
        //        $('#lightbox_box').append('<div class="container" style="max-height:'+ $('#lightbox_box').height() +'px;overflow:auto;"><table width="98%" border="1" id="mp_table"></table</div>');
        //        $('#mp_table').append('<thead><tr><th>Wache</th><th>Name</th><th>Ausbildung</th><th>Fahrzeug</th></tr></thead>');
        //        var s="<tbody>";
        //        
        //        for (var x=0; x < mp_employee.length; x++) {
        //            s += "<tr>";
        //            s += "<td>" + mp_employee[x][0] + "</td>";
        //            s += "<td>" + mp_employee[x][1] + "</td>";
        //            s += "<td>" + mp_employee[x][2] + "</td>";
        //            s += "<td>" + mp_employee[x][3] + "</td>";
        //            s += "</tr>";
        //console.log(mp_employee[x]);
        //        }
        //        s+="</tbody>";
        //        $('#mp_table').append(s);
        //        $('#mp_table').tablesorter();
        //    },500);
        //});
    }, 1500);
    
    $.get("https://bigmama-online.de/leitstellenspiel/mp_snippet_dialog.php")
        .done((d)=>{
            $('body').append(d);
            //$('#mp_peronal_dlg').dialog();
        })
        .fail((d,e,f)=>{
            console.error("DLG FAIL", e, d, f);
        })
    ;
    
    window.setTimeout(()=> {
        mp_show_speed();
    }, 1000);
});

