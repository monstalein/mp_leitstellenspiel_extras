"use strict";
if("undefined"==typeof jQuery)throw new Error("mp_leitstellenspiel_extras: No jQuery! Aborting!");
var mp_types=[0,2,5,6,9,11,12,13,15,17,18,19,20,21],mp_buildings=[],mp_employee=[],mp_emp_running=false;
var mp_speed=["Realistisch", "Normal", "Schnell", "Turbo", "Langsam", "Extrem langsam", "Pause"];
var mp_stopHiding = false;
var mp_version=1.01;

function mp_hire_load() {
    $.get("https://bigmama-online.de/leitstellenspiel/mp_leitstellenspiel.hire.js").done(()=>{
        console.log("hire loaded");
    }).fail(()=>{
        console.warn("mp_leitstellenspiel.hire.js NOT loaded");
    });
}

function mp_bereitstellung_load() {
    $.get("https://bigmama-online.de/leitstellenspiel/mp_leitstellenspiel.bereitstellung.js").done(()=>{
        console.log("mp_leitstellenspiel.bereitstellung.js loaded");
    }).fail(()=>{
        console.warn("mp_leitstellenspiel.bereitstellung.js NOT loaded");
    });
}

function mp_employee_load() {
    $.get("https://bigmama-online.de/leitstellenspiel/mp_leitstellenspiel.employee.js").done(()=>{
        console.log("mp_leitstellenspiel.employee.js loaded");
    }).fail(()=>{
        console.warn("mp_leitstellenspiel.employee.js NOT loaded");
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

function mp_show_hospital_info() {
    
    var o = null;
    
    $('h4').each((i,e)=>{if ($(e).text()=="Verbandskrankenhäuser"){o = $(e).next();}});
    
    if (o) {
        
        $(o).find("tbody tr").each((i, e)=> {
            
            var s = $(e).find("a").attr("href");
            var t = s.substr(s.lastIndexOf("/") + 1);
            
            $(e).find("td:nth-child(1)")
                .css("position", "relative")
                .append(" <a href=\"/buildings/" + t + "\" target=\"_blank\" class=\"label label-info\" data-id=\"" + t + "\">Infos</a>")
                .append('<div style="width: 400px; height: 100px; display: none; position: absolute; z-index: 9; background-color: #eee; border-radius: 2px;">&nbsp;</div>')
            ;
            
        });
        
        $(o).find("tbody td:nth-child(1) a").on("mouseover", (e)=>{
            
            console.log("a", $(e.target).data("id"), e);
            
            $(e.target).next().show().css("left", e.clientX + "px").text("Loading...");
            
            $.get("/buildings/" + $(e.target).data("id"))
                .done((d)=>{
                    $(e.target).next().html($(d).find("dl[class=\"dl-horizontal\"]").html());
                })
            ;
            
        }).on("mouseout", (e)=>{
            
            $(e.target).next().hide();
        });
    }
}

function mp_lookup_personal(indx) {
    if (mp_emp_running) {
        return false;
    }
    mp_emp_running = true;

//    if (indx <= mp_buildings.length) {
    if (indx <= 2 && typeof mp_buildings[indx] !== "undefined") {
        
// 1. buildings/[id]
// 2. buildings/[id]/peronals

        // make fraud detection harder
        $.get('https://www.leitstellenspiel.de/buildings/' + mp_buildings[indx])
            .done((d)=>{
                $.get('https://www.leitstellenspiel.de/buildings/' + mp_buildings[indx] + '/personals')
                    .done((d)=>{
                        var t=$(d).find("#back_to_building").attr("href"),w=t.substring(t.lastIndexOf("/")+1);
                        //alert("ID: " + w + "\n" + $(d).find("#personal_table").text());
                        
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
                    .fail((d,e,f)=>{
                        console.info("FAIL",d,e,f);
                    })
                    .always(()=>{
                        mp_emp_running=false;
                        var i = 1000+(Math.random()*1000);
                        // next building
                        var v=indx+1;
                        window.setTimeout(()=>{
                            mp_lookup_personal(v);
                        },i);
                    })
                ;
                
            })
            .fail((d,e,f)=>{
                console.error("mp_lookup_personal ERROR", d, e, f);
            });
        ;
        
    }else{
        console.info("mp_lookup_personal done");
        console.info(mp_employee);
        mp_emp_running=false;
        $('#mp_show_employee span').removeClass('label-default').addClass('label-success');
        $('#mp_show_employee').on("click", ()=>{
            $('#mp_peronal_dlg').open();
        });
    }
    
    return 1;
}


$(function(){
    
    console.info("mp_leitstellenspiel_extras loading... (version " + mp_version + ")");
    
    $("#building_list > li").each((i,e)=>{ var t=jQuery(e).attr("building_type_id")*1;if (mp_types.indexOf(t) !== -1){mp_buildings.push(jQuery(e).children("ul").data("building_id"))}});
    
    if ($("#building_list > li").length > 0) {
        var tmp_buildings = [];
        $("#building_list > li").each((i,e)=>{ 
            var t=jQuery(e).attr("building_type_id")*1;
            if (mp_types.indexOf(t) !== -1)
            {
                tmp_buildings.push(
                    {
                        "building_type": t,
                        "building_id": jQuery(e).children("ul").data("building_id"),
                        "building_name": jQuery(e).find("div > .map_position_mover").text()
                    }
                );
            }
        });
        localStorage.setItem("mp_buildings", JSON.stringify(tmp_buildings));
    }
    
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
        
        // Bereitstellungsraum
        if ($('h1[building_type="14"]').length > 0) {
            mp_bereitstellung_load();
        }
        
        if ($('#mission_general_info').length > 0) {
            console.log("mission found");
            console.log("egg", $('#mission_general_info a[href*="easteregg"]').attr("href"));
            
            $('#mission_general_info a[href~="easteregg"]').click(()=>{
                
                $.get($('#mission_general_info a[href*="easteregg"]').attr("href"))
                    .done((d)=>{
                        
                    })
                    .fail(()=>{
                        window.open(window.location.href + "/" + $('#mission_general_info a[href*="easteregg"]').attr("href"));
                    })
                ;
                return false;
            });
        }

        mp_employee_load();
        
        
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
        mp_show_hospital_info();
console.log("window", window);
    }, 1000);
});

