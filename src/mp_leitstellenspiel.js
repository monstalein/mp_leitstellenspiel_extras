"use strict";
if("undefined"==typeof jQuery)throw new Error("mp_leitstellenspiel_extras: No jQuery! Aborting!");
var mp_types=[0,2,5,6,9,11,12,13,15,17,18,19,20,21],mp_buildings=[];

// filling at the end of file
var mp_vehicle_type = [];

let mp_intervall = [{n:0, x:500},{n:500,x:1000},{n:1000,x:3000},{n:3000,x:6000},{n:6000,x:999999}], mp_mission_filter_selected = -1;
var mp_modules = [ // neue module immer UNTEN anschliessen
        {id: 2, name: "Bereitstellungsraum selector", script: "mp_leitstellenspiel.bereitstellung.js", description: "Im Bereitstellungsraum wird oben ein Liste an beteiligten Wachen angezeit, um alle Fahrzeug von dieser Wache auszuw&auml;hlen. Danach kann man alle diese Fahrzeuge nach Hause schicken."},
        {id: 4, name: "Mission-Filter", script: "mp_leitstellenspiel.mission_filter.js", description: "Blendet oben in der Missions-Liste einen Filter ein, womit man Eins&auml;tze nach erwarteten Credits filtern kann (wirkt nicht auf das Alarmfenster)."},
        {
            id: 6, 
            name: "Hospital Info", 
            pathname: "/vehicles",
            pathStartsWith: true,
            script: "mp_leitstellenspiel.hospital_info.js", 
            description: "in dem Fenster in dem Patienten ins Krankenhaus geschickt werden, wird f&uuml;r Verbands-Krankenh&auml;user information &uuml;ber das Gen&auml;de eingeblendet."
        },
        {id: 5, name: "Mission speed", script: "mp_leitstellenspiel.speed.js", description: "In der Missions-Liste wird oben vor den Filtern nicht nur 'Pause' angezeigt, sondern alle Geschwindigkeiten - mit Link zum schnellen Anpassen."},
        {
            id: 7, 
            name: "Chat history highlighting", 
            pathname: "/alliance_chats",
            pathStartsWith: true,
            script: "mp_leitstellenspiel.alliance_chat.js", 
            description: "Im Verbands-Chat-Verlauf (History, nicht aktuelle Liste) werden alle geschickt Nachrichten umrandet: gr&uuml;n: gesendete Nachricht / hellrot: Name wurde erw&auml;hnt (mit der oder ohne @) / dunkelrot: Startet mit dem Name - k&ouml;nnte pers&ouml;nliche Nachricht gewesen sein."
        },
        {id: 8, name: "Geb&auml;ude zuklappen (beta)", script: "mp_leitstellenspiel.building_toggle.js", description: "Geb&auml;ude k&ouml;nnen zu- und aufgeklappt werden, damit die Liste etwas &uuml;bersichtlicher wird.<br>Noch manuell - automatisch ist in Entwicklung"},
        {
            id: 9, 
            name: "M&ouml;gliche Eins&auml;tze: DGL ausblenden", 
            pathname: "/einsaetze",
            pathStartsWith: false,
            script: "mp_leitstellenspiel.hidedgl.js", 
            description: "Auf der Seite &quot;M&ouml;gliche Eins&auml;tze&quot; alle Eins&auml;tze die Dienstgruppen-Erweiterung ben&ouml;tigen ausblenden."
        },
		{
            id: 10, 
            name: "Freies Personal zuweisen (beta)", 
            pathname: "/vehicles",
            pathStartsWith: true,
            script: "mp_leitstellenspiel.employeeassign.js", 
            description: "Bei der Personal-Zuweisung im Fahrzeug kann jetzt per Knopf immer der erste freie Mitarbeiter zugewiesen werden (unten in der Liste, weil neue immer oben hin kommen). Fahrzeug-Liste ist noch unvollständig, gerne weitere Typen mit Anzahl in Github melden."
        },
        {id: 3, name: "&Uuml;bersicht Personal <sup><i class='glyphicon glyphicon-warning-sign'></i></sup>", script: "mp_leitstellenspiel.employee.js", description: "Es wird aus alles Wachen der aktuelle  Personal-Stamm geladen und kann unter Profil -> Angestellte angezeigt und gefiltert werden (kann dort einem Klick für anderen Plugins exportiert werden)"},
        {id: 1, name: "Personal anheuern <sup><i class='glyphicon glyphicon-warning-sign'></i></sup>", script: "mp_leitstellenspiel.hire.js", description: "Wenn nicht Premium: geht alle 2 Tage durch alle Wachen durch und stellt Personal-Anheuern auf 3 Tage ein."},
];
var mp_version=1.06;
var mp_latest_changes_msg="<b>Neues Modul:</b> M&ouml;gliche Eins&auml;tze: DGL ausblenden";


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
            
            localStorage.setItem("mp_username", user_name);
        }
        
        if (typeof username !== "undefined") {
            
            localStorage.setItem("mp_username", username);
        }
        
        
    }, 100);
    
    window.setTimeout(()=>{
        
        // load modules
        
        var mods = JSON.parse(localStorage.getItem("mp_modules_active") || "[]");

        for (var i = 0; i < mods.length; i++) {
            
            // load module by id
            var mod = mp_modules.filter(function (e) {return e.id == this.i}, {i: mods[i]});

            if (mod.length >= 1) {
                
                // if pathname for module is set
                if (mod[0].pathname)
                {
                    console.log("location", location);
                    if (mod[0].pathStartsWith && location.pathname.startsWith(mod[0].pathname))
                    {
                        // modul laden
                        mp_load_module(mod[0].script);
                    }
                    else if(location.pathname == mod[0].pathname)
                    {
                        // modul laden
                        mp_load_module(mod[0].script);
                    }
                }
                else
                {
                    // modul laden
                    mp_load_module(mod[0].script);
                }
            }
            
        }
        
        //https://www.leitstellenspiel.de/api/vehicles/34428298
        
        var chunks = location.pathname.substr(1).split("/");
        
        if (chunks.length == 3 && chunks[2] == "zuweisung") {
            $.getJSON("https://www.leitstellenspiel.de/api/vehicles/" + chunks[1])
                .done(function(d) {
                    console.info(d);
                })
                .fail(function(a,b,c){console.warn(b,c,a);})
            ;
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

mp_vehicle_type[0] = { max_personnel: 9, building_types: [0, 18], caption: "FW LF 20" };
mp_vehicle_type[1] = { max_personnel: 9, building_types: [0, 18], caption: "FW LF 10" };
mp_vehicle_type[2] = { max_personnel: 3, building_types: [0, 18], caption: "FW DLK 23" };
mp_vehicle_type[3] = { max_personnel: 3, building_types: [0, 18], caption: "FW ELW 1" };
mp_vehicle_type[4] = { max_personnel: 3, building_types: [0, 18], caption: "FW RW" };
mp_vehicle_type[5] = { max_personnel: 3, building_types: [0, 18], caption: "FW GW-A" };
mp_vehicle_type[6] = { max_personnel: 9, building_types: [0, 18], caption: "FW LF 8/6" };
mp_vehicle_type[7] = { max_personnel: 9, building_types: [0, 18], caption: "FW LF 20/16" };
mp_vehicle_type[8] = { max_personnel: 9, building_types: [0, 18], caption: "FW LF 10/16" };
mp_vehicle_type[9] = { max_personnel: 9, building_types: [0, 18], caption: "FW LF 16-TS" };
mp_vehicle_type[10] = { max_personnel: 3, building_types: [0, 18], caption: "FW GW-Öl" };
mp_vehicle_type[11] = { max_personnel: 3, building_types: [0, 18], caption: "FW GW-L2-Wasser" };
mp_vehicle_type[12] = { max_personnel: 3, building_types: [0, 18], caption: "FW GW-Messtechnik" };
mp_vehicle_type[13] = { max_personnel: 3, building_types: [0, 18], caption: "FW SW 1000" };
mp_vehicle_type[14] = { max_personnel: 6, building_types: [0, 18], caption: "FW SW 2000" };
mp_vehicle_type[15] = { max_personnel: 3, building_types: [0, 18], caption: "FW SW 2000-Tr" };
mp_vehicle_type[16] = { max_personnel: 3, building_types: [0, 18], caption: "FW SW Kats" };
mp_vehicle_type[17] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 2000" };
mp_vehicle_type[18] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 3000" };
mp_vehicle_type[19] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 8/8" };
mp_vehicle_type[20] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 8/18" };
mp_vehicle_type[21] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 16/24-Tr" };
mp_vehicle_type[22] = { max_personnel: 6, building_types: [0, 18], caption: "FW TLF 16/25" };
mp_vehicle_type[23] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 16/45" };
mp_vehicle_type[24] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 20/40" };
mp_vehicle_type[25] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 20/40-SL" };
mp_vehicle_type[26] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 16" };
mp_vehicle_type[27] = { max_personnel: 3, building_types: [0, 18], caption: "GW Gefahrgut" };
mp_vehicle_type[28] = { max_personnel: 2, building_types: [0, 1, 18], caption: "FW/Rett/SEG/BergRett RTW" };
mp_vehicle_type[29] = { max_personnel: 2, building_types: [0, 1, 18], caption: "FW/Rett/BergRett NEF" };
mp_vehicle_type[30] = { max_personnel: 9, building_types: [0, 18], caption: "FW HLF 20" };
mp_vehicle_type[31] = { max_personnel: 1, caption: "RTH" };
mp_vehicle_type[32] = { max_personnel: 2, caption: "FuStW" };
mp_vehicle_type[33] = { max_personnel: 9, building_types: [0, 18], caption: "GW-H" };
mp_vehicle_type[34] = { max_personnel: 6, building_types: [0, 18], caption: "ELW 2" };
mp_vehicle_type[35] = { max_personnel: 3, caption: "leBefKw" };
mp_vehicle_type[36] = { max_personnel: 9, building_types: [0, 18], caption: "MTW" };
mp_vehicle_type[37] = { max_personnel: 6, caption: "FW TSF-W" };
mp_vehicle_type[38] = { max_personnel: 2, caption: "FW/Rett/BergRett KTW" };
mp_vehicle_type[39] = { max_personnel: 9, caption: "THW GKW" };
mp_vehicle_type[40] = { max_personnel: 4, caption: "THW MTW-TZ" };
mp_vehicle_type[41] = { max_personnel: 9, caption: "THW MzGW (FGr N)" };
mp_vehicle_type[42] = { max_personnel: 3, caption: "THW LKW K 9" };
mp_vehicle_type[43] = { max_personnel: 0, caption: "THW BRmG R" };
mp_vehicle_type[44] = { max_personnel: 0, caption: "Anh DLE" };
mp_vehicle_type[45] = { max_personnel: 6, caption: "MLW 5" };
mp_vehicle_type[46] = { max_personnel: 3, caption: "FW WLF" };
mp_vehicle_type[47] = { max_personnel: 0, caption: "FW AB-Rüst" };
mp_vehicle_type[48] = { max_personnel: 0, caption: "FW AB-Atemschutz" };
mp_vehicle_type[49] = { max_personnel: 0, caption: "FW AB-Öl" };
mp_vehicle_type[50] = { max_personnel: 9, caption: "GruKw" };
mp_vehicle_type[51] = { max_personnel: 3, caption: "FüKw" };
mp_vehicle_type[52] = { max_personnel: 2, caption: "GefKw" };
mp_vehicle_type[53] = { max_personnel: 6, building_types: [0, 18], caption: "FW Dekon-P" };
mp_vehicle_type[54] = { max_personnel: 0, building_types: [0, 18], caption: "FW AB-Dekon-P" };
mp_vehicle_type[55] = { max_personnel: 1, caption: "Rett KdoW-LNA" };
mp_vehicle_type[56] = { max_personnel: 1, caption: "Rett KdoW-Orgl" };
mp_vehicle_type[57] = { max_personnel: 2, building_types: [0, 18], caption: "FW FwK" };
mp_vehicle_type[58] = { max_personnel: 2, caption: "SEG KTW Typ B" };
mp_vehicle_type[59] = { max_personnel: 2, caption: "SEG ELW 1 (SEG)" };
mp_vehicle_type[60] = { max_personnel: 6, caption: "SEG GW-San" };
mp_vehicle_type[61] = { max_personnel: 3, caption: "Polizeihubschrauber" };
mp_vehicle_type[62] = { max_personnel: 0, caption: "FW AB-Schlauch" };
mp_vehicle_type[63] = { max_personnel: 2, caption: "FW/SEG/WasserRett GW-Taucher" };
mp_vehicle_type[64] = { max_personnel: 6, caption: "FW/SEG/WasserRett GW-Wasserrettung" };
mp_vehicle_type[65] = { max_personnel: 2, caption: "THW LKW 7 Lkr 19 tm" };
mp_vehicle_type[66] = { max_personnel: 0, caption: "THW Anh MzB" };
mp_vehicle_type[67] = { max_personnel: 0, caption: "THW Anh SchlB" };
mp_vehicle_type[68] = { max_personnel: 0, caption: "THW Anh MzAB" };
mp_vehicle_type[69] = { max_personnel: 2, caption: "THW Tauchkraftwagen" };
mp_vehicle_type[70] = { max_personnel: 0, caption: "FW/SEG/WasserRett MZB" };
mp_vehicle_type[71] = { max_personnel: 0, caption: "FW AB-MZB" };
mp_vehicle_type[72] = { max_personnel: 5, caption: "WaWe" };
mp_vehicle_type[73] = { max_personnel: 7, building_types: [0, 1, 18], caption: "FW/Rett/BergRett GRTW" };
mp_vehicle_type[74] = { max_personnel: 3, building_types: [0, 1, 18], caption: "FW/Rett/BergRett NAW" };
mp_vehicle_type[75] = { max_personnel: 3, caption: "FW FLF" };
mp_vehicle_type[76] = { max_personnel: 2, caption: "FW Rettungstreppe" };
mp_vehicle_type[77] = { max_personnel: 0, caption: "FW AB-Gefahrgut" };
mp_vehicle_type[78] = { max_personnel: 0, caption: "FW AB-Einsatzleitung" };
mp_vehicle_type[79] = { max_personnel: 4, caption: "SEK - ZF" };
mp_vehicle_type[80] = { max_personnel: 9, caption: "SEK - MTF" };
mp_vehicle_type[81] = { max_personnel: 4, caption: "MEK - ZF" };
mp_vehicle_type[82] = { max_personnel: 9, caption: "MEK - MTF" };
mp_vehicle_type[83] = { max_personnel: 9, building_types: [0, 18], caption: "FW GW-Werkfeuerwehr" };
mp_vehicle_type[84] = { max_personnel: 3, building_types: [0, 18], caption: "FW ULF mit Löscharm" };
mp_vehicle_type[85] = { max_personnel: 3, building_types: [0, 18], caption: "FW TM 50" };
mp_vehicle_type[86] = { max_personnel: 3, building_types: [0, 18], caption: "FW Turbolöscher" };
mp_vehicle_type[87] = { max_personnel: 3, building_types: [0, 18], caption: "FW TLF 4000" };
mp_vehicle_type[88] = { max_personnel: 6, building_types: [0, 18], caption: "FW KLF" };
mp_vehicle_type[89] = { max_personnel: 6, building_types: [0, 18], caption: "FW MLF" };
mp_vehicle_type[90] = { max_personnel: 9, caption: "FW HLF 10" };
mp_vehicle_type[91] = { max_personnel: 5, caption: "SEG Rettungshundefahrzeug" };
mp_vehicle_type[92] = { max_personnel: 0, caption: "THW Anh Hund" };
mp_vehicle_type[93] = { max_personnel: 5, caption: "THW MTW-O Hund" };
mp_vehicle_type[94] = { max_personnel: 3, caption: "DHuFüKw" };
mp_vehicle_type[95] = { max_personnel: 1, caption: "Polizeimotorrad" };
mp_vehicle_type[96] = { max_personnel: 0, caption: "Außenlastbehälter (allgemein)" };
mp_vehicle_type[97] = { max_personnel: 3, building_types: [0, 1, 18], caption: "FW/Rett/BergRett ITW" };
mp_vehicle_type[98] = { max_personnel: 2, caption: "Zivilstreifenwagen" };
mp_vehicle_type[99] = { max_personnel: 3, caption: "THW LKW 7 Lbw" };
mp_vehicle_type[100] = { max_personnel: 7, caption: "THW MLW 4" };
mp_vehicle_type[101] = { max_personnel: 0, caption: "THW Anh SwPu" };
mp_vehicle_type[102] = { max_personnel: 0, caption: "THW Anh 7" };
mp_vehicle_type[103] = { max_personnel: 2, caption: "FuStW (DGL)" };
mp_vehicle_type[104] = { max_personnel: 6, caption: "FW GW-L1" };
mp_vehicle_type[105] = { max_personnel: 6, caption: "FW GW-L2" };
mp_vehicle_type[106] = { max_personnel: 6, caption: "FW MTF-L2" };
mp_vehicle_type[107] = { max_personnel: 9, caption: "FW LF-L" };
mp_vehicle_type[108] = { max_personnel: 0, caption: "FW AB-L" };
mp_vehicle_type[109] = { max_personnel: 9, caption: "THW MzGW SB" };
mp_vehicle_type[110] = { max_personnel: 0, caption: "THW NEA50" };
mp_vehicle_type[111] = { max_personnel: 0, caption: "FW NEA50" };
mp_vehicle_type[112] = { max_personnel: 0, caption: "THW NEA200" };
mp_vehicle_type[113] = { max_personnel: 0, caption: "FW NEA200" };
mp_vehicle_type[114] = { max_personnel: 2, caption: "FW GW-Lüfter" };
mp_vehicle_type[115] = { max_personnel: 0, caption: "FW Anh Lüfter" };
mp_vehicle_type[116] = { max_personnel: 0, caption: "FW AB-Lüfter" };
mp_vehicle_type[117] = { max_personnel: 0, caption: "FW AB-Tank" };
mp_vehicle_type[118] = { max_personnel: 3, caption: "FW Kleintankwagen" };
mp_vehicle_type[119] = { max_personnel: 0, caption: "FW AB-Lösch" };
mp_vehicle_type[120] = { max_personnel: 3, caption: "FW Tankwagen" };
mp_vehicle_type[121] = { max_personnel: 3, caption: "FW GTLF" };
mp_vehicle_type[122] = { max_personnel: 3, caption: "THW LKW 7 Lbw (FGr E)" };
mp_vehicle_type[123] = { max_personnel: 3, caption: "THW LKW 7 Lbw (FGr WP)" };
mp_vehicle_type[124] = { max_personnel: 7, caption: "THW MTW-OV" };
mp_vehicle_type[125] = { max_personnel: 7, caption: "THW MTW-Tr UL" };
mp_vehicle_type[126] = { max_personnel: 5, caption: "FW MTF Drohne" };
mp_vehicle_type[127] = { max_personnel: 4, caption: "SEG GW-UAS" };
mp_vehicle_type[128] = { max_personnel: 5, caption: "FW ELW Drohne" };
mp_vehicle_type[129] = { max_personnel: 6, caption: "FW ELW2 Drohne" };
mp_vehicle_type[130] = { max_personnel: 3, caption: "SEG GW-Bt" };
mp_vehicle_type[131] = { max_personnel: 9, caption: "SEG Bt-Kombi" };
mp_vehicle_type[132] = { max_personnel: 0, caption: "SEG FKH" };
mp_vehicle_type[133] = { max_personnel: 3, caption: "SEG Bt LKW" };
mp_vehicle_type[134] = { max_personnel: 4, caption: "BePo/Reiterstaffel Pferdetransporter klein" };
mp_vehicle_type[135] = { max_personnel: 2, caption: "BePo/Reiterstaffel Pferdetransporter groß" };
mp_vehicle_type[136] = { max_personnel: 0, caption: "BePo/Reiterstaffel Anh Pferdetransport" };
mp_vehicle_type[137] = { max_personnel: 6, caption: "BePo/Reiterstaffel Zugfahrzeug Pferdetransport" };
mp_vehicle_type[138] = { max_personnel: 6, caption: "FW GW-Verpflegung" };
mp_vehicle_type[139] = { max_personnel: 3, caption: "FW GW-Küche" };
mp_vehicle_type[140] = { max_personnel: 6, caption: "FW MTW-Verpflegung" };
mp_vehicle_type[141] = { max_personnel: 0, caption: "FW FKH" };
mp_vehicle_type[142] = { max_personnel: 0, caption: "FW AB-Küche" };
mp_vehicle_type[143] = { max_personnel: 0, caption: "FW Anh Schlauch" };
mp_vehicle_type[144] = { max_personnel: 4, caption: "THW FüKW (THW)" };
mp_vehicle_type[145] = { max_personnel: 7, caption: "THW FüKomKW" };
mp_vehicle_type[146] = { max_personnel: 0, caption: "THW Anh FüLa" };
mp_vehicle_type[147] = { max_personnel: 7, caption: "THW FmKW" };
mp_vehicle_type[148] = { max_personnel: 4, caption: "THW MTW-FGr K" };
mp_vehicle_type[149] = { max_personnel: 6, caption: "BergRett GW-Bergrettung (NEF)" };
mp_vehicle_type[150] = { max_personnel: 6, caption: "BergRett GW-Bergrettung" };
mp_vehicle_type[151] = { max_personnel: 3, caption: "BergRett ELW Bergrettung" };
mp_vehicle_type[152] = { max_personnel: 1, caption: "BergRett ATV" };
mp_vehicle_type[153] = { max_personnel: 5, caption: "BergRett Hundestaffel (Bergrettung)" };
mp_vehicle_type[154] = { max_personnel: 1, caption: "BergRett Schneefahrzeug" };
mp_vehicle_type[155] = { max_personnel: 0, caption: "BergRett Anh Höhenrettung (Bergrettung)" };
mp_vehicle_type[156] = { max_personnel: 3, caption: "Polizeihubschrauber mit verbauter Winde" };
mp_vehicle_type[157] = { max_personnel: 2, caption: "Rettungshubschrauber RTH Winde" };
mp_vehicle_type[158] = { max_personnel: 4, caption: "BergRett GW-Höhenrettung (Bergrettung)" };
mp_vehicle_type[159] = { max_personnel: 9, caption: "Seenotrettungskreuzer" };
mp_vehicle_type[160] = { max_personnel: 2, caption: "Seenotrettungsboot" };
mp_vehicle_type[161] = { max_personnel: 4, caption: "Hubschrauber (Seenotrettung)" };
mp_vehicle_type[162] = { max_personnel: 3, caption: "FW RW-Schiene" };
mp_vehicle_type[163] = { max_personnel: 9, caption: "FW HLF Schiene" };
mp_vehicle_type[164] = { max_personnel: 0, caption: "FW AB-Schiene" };
mp_vehicle_type[165] = { max_personnel: 5, caption: "BePo LauKW" };
mp_vehicle_type[166] = { max_personnel: 2, caption: "FW PTLF 4000" };
mp_vehicle_type[167] = { max_personnel: 2, caption: "FW SLF" };
mp_vehicle_type[168] = { max_personnel: 0, caption: "FW Anh Sonderlöschmittel" };
mp_vehicle_type[169] = { max_personnel: 0, caption: "FW AB-Sonderlöschmittel" };
mp_vehicle_type[170] = { max_personnel: 0, caption: "FW AB-Wasser/Schaum" };
mp_vehicle_type[171] = { max_personnel: 5, caption: "SEG GW-TeSi" };
mp_vehicle_type[172] = { max_personnel: 6, caption: "SEG LKW Technik (Notstrom)" };
mp_vehicle_type[173] = { max_personnel: 7, caption: "SEG MTW TeSi" };
mp_vehicle_type[174] = { max_personnel: 0, caption: "SEG Anh TeSi" };
mp_vehicle_type[175] = { max_personnel: 0, caption: "SEG Anh NEA 50" };
mp_vehicle_type[176] = { max_personnel: 3, caption: "THW LKW 7 Lbw (FGr Log-V)" };
mp_vehicle_type[177] = { max_personnel: 5, caption: "THW MTW-FGr Log-V" };
mp_vehicle_type[178] = { max_personnel: 0, caption: "THW Anh 12 Lbw (FGr Log-V)" };
mp_vehicle_type[179] = { max_personnel: 0, caption: "FW AB-NEA50" };
mp_vehicle_type[180] = { max_personnel: 0, caption: "FW AB-NEA200" };
