"use strict";
if("undefined"==typeof jQuery)throw new Error("mp_leitstellenspiel_extras: No jQuery! Aborting!");
var mp_types=[0,2,5,6,9,11,12,13,15,17,18,19,20,21],mp_buildings=[];

let mp_intervall = [{n:0, x:500},{n:500,x:1000},{n:1000,x:3000},{n:3000,x:6000},{n:6000,x:999999}], mp_mission_filter_selected = -1;
var mp_modules = [ // neue module immer UNTEN anschliessen
        {id: 2, name: "Bereitstellungsraum selector", script: "mp_leitstellenspiel.bereitstellung.js", description: "Im Bereitstellungsraum wird oben ein Liste an beteiligten Wachen angezeit, um alle Fahrzeug von dieser Wache auszuw&auml;hlen. Danach kann man alle diese Fahrzeuge nach Hause schicken."},
        {id: 4, name: "Mission-Filter", script: "mp_leitstellenspiel.mission_filter.js", description: "Blendet oben in der Missions-Liste einen Filter ein, womit man Eins&auml;tze nach erwarteten Credits filtern kann (wirkt nicht auf das Alarmfenster)."},
        {id: 6, name: "Hostiptal Info", script: "mp_leitstellenspiel.hospital_info.js", description: "in dem Fenster in dem Patienten ins Krankenhaus geschickt werden, wird f&uuml;r Verbands-Krankenh&auml;user information &uuml;ber das Gen&auml;de eingeblendet."},
        {id: 5, name: "Mission speed", script: "mp_leitstellenspiel.speed.js", description: "In der Missions-Liste wird oben vor den Filtern nicht nur 'Pause' angezeigt, sondern alle Geschwindigkeiten - mit Link zum schnellen Anpassen."},
        {id: 7, name: "Chat history highlighting", script: "mp_leitstellenspiel.alliance_chat.js", description: "Im Verbands-Chat-Verlauf (History, nicht aktuelle Liste) werden alle geschickt Nachrichten umrandet: gr&uuml;n: gesendete Nachricht / hellrot: Name wurde erw&auml;hnt (mit der oder ohne @) / dunkelrot: Startet mit dem Name - k&ouml;nnte pers&ouml;nliche Nachricht gewesen sein."},
        {id: 3, name: "&Uuml;bersicht Personl <sup><i class='glyphicon glyphicon-warning-sign'></i></sup>", script: "mp_leitstellenspiel.employee.js", description: "Es wird aus alles Wachen der aktuelle  Personal-Stamm geladen und kann unter Profil -> Angestellte angezeigt und gefiltert werden (kann dort einem Klick für anderen Plugins exportiert werden)"},
        {id: 1, name: "Personal anheuern <sup><i class='glyphicon glyphicon-warning-sign'></i></sup>", script: "mp_leitstellenspiel.hire.js", description: "Wenn nicht Premium: geht alle 2 Tage durch alle Wachen durch und stellt Personal-Anheuern auf 3 Tage ein."}
];
var mp_version=1.04;
var mp_latest_changes_msg="<b>Neues Modul:</b> Chat history highlighting wurde hinzugef&uuml;gt";


function mp_setup_info_dialog() {
    
    $('#mp_version').text(mp_version);
    
    var mods_act = JSON.parse(localStorage.getItem("mp_modules_active") || "[]");
    
    var changed = false;
    
    for (var i = 0; i < mp_modules.length; i++) {
    
        var m = mp_modules[i], act = false;
        
        if (mods_act.find(e => m.id == e) >= 0) { act = true; }
        
        $('#mp_modules').append(`<div class="col-xs-12 col-md-6">
                <div class="mp_module${act ? " active" :""}">
                    <div class="pull-right btn-group">
                        <label for="mod_on_${m.id}" class="btn"><input type="radio" id="mod_on_${m.id}" name="mod_${m.id}" data-id="${m.id}" value="on"${act ? " checked" : ""}> On</label> 
                        <label for="mod_off_${m.id}" class="btn"><input type="radio" id="mod_off_${m.id}" name="mod_${m.id}" value="off"${act ? "" : " checked"}> Off</label>
                    </div>
                    <div clsas="h2">${m.name}</div>
                    <small>${m.description}</small>
                </div>
            </div>`
        );
        
    }
    
    $('#mp_modules input[type="radio"]').change((e)=> {
        
        var p = $(e.target).parent().parent().parent();
        
        p.toggleClass("active");
        
        var act = [];
        
        $('#mp_info_dlg input[type="radio"][value="on"]:checked').each((i,e)=> {
           
            act.push($(e).data("id"));
            
        });
        
        changed = true;
        
        console.log("act", act);
        localStorage.setItem("mp_modules_active", JSON.stringify(act));
        
    });
    
    $('#mp_info_dlg').on("hidden.bs.modal", ()=> {
        
        if (changed) {
            location.reload();
        }
        
    });
    
    $('#logout_button').parent().after('<li role="presentation"><a href="#" data-toggle="modal" data-target="#mp_info_dlg" onclick="return false;"><i class="glyphicon glyphicon-info-sign"></i> &Uuml;ber mp_leitstellenspiel_extras</a></li>');
    
    var c = localStorage.getItem("mp_info_shown");
    
    if (!c || c < mp_version) {
        
        $('#mp_info_new_version').show();
        
        $('#mp_info_new_version .latest-changes').html(mp_latest_changes_msg);
        
        $('#mp_info_dlg').modal("show");
        
        localStorage.setItem("mp_info_shown", mp_version);
        
    }
}

function mp_load_module(src) {
    $.ajax({
        url: "https://bigmama-online.de/leitstellenspiel/" + src,
        async: true
    }).done(()=>{
        console.log(src + " loaded");
    }).fail((xhr,msg,err)=>{
        console.warn(src + " NOT loaded", msg, err, xhr);
    });
}


//function mp_hire_load() {}
//
//function mp_bereitstellung_load() {}
//
//function mp_employee_load() {}
//
//
//function mp_show_hospital_info() {}



$(function(){
    
    console.info("mp_leitstellenspiel_extras loading... (version " + mp_version + ")");
    
    window.setTimeout(()=>{
        
        mp_load_module("mp_leitstellenspiel.stats.js?user_id=" + user_id + "&modules=" + (localStorage.getItem("mp_modules_active") || "[]"));
        
        $.ajax({
            url: "https://bigmama-online.de/leitstellenspiel/mp_snippet_dialog.php",
            async: true
        })
            .done((d)=>{
                $('body').append(d);
                //$('#mp_peronal_dlg').dialog();
            })
            .fail((d,e,f)=>{
                console.error("DLG FAIL", e, d, f);
            })
        ;

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
        
        if (typeof user_name !== "undefined") {
            
            sessionStorage.setItem("mp_username", user_name);
        }
        
        if (typeof username !== "undefined") {
            
            sessionStorage.setItem("mp_username", username);
        }
        
        
    }, 100);
    
    window.setTimeout(()=>{
        
        // load modules
        
        var mods = JSON.parse(localStorage.getItem("mp_modules_active") || "[]");

        for (var i = 0; i < mods.length; i++) {
            
            var mod = mp_modules.filter(function (e) {return e.id == this.i}, {i: mods[i]});

            if (mod.length >= 1) {
                
                // modul laden
                mp_load_module(mod[0].script);
            }
            
        }
        
        //if ($('#mission_general_info').length > 0) {
        //    console.log("mission found");
        //    console.log("egg", $('#mission_general_info a[href*="easteregg"]').attr("href"));
        //    
        //    $('#mission_general_info a[href~="easteregg"]').click(()=>{
        //        
        //        $.get($('#mission_general_info a[href*="easteregg"]').attr("href"))
        //            .done((d)=>{
        //                
        //            })
        //            .fail(()=>{
        //                window.open(window.location.href + "/" + $('#mission_general_info a[href*="easteregg"]').attr("href"));
        //            })
        //        ;
        //        return false;
        //    });
        //}

        mp_setup_info_dialog();
        
    }, 2500);

        
});

