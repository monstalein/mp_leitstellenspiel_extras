"use strict";

(($, localStorage)=> {

    $('#iframe-inside-container > form > h3').after("<div id=\"mp_loading_building\">loading</div>");

    var mp_tmp = "mp_buildings" in localStorage ? localStorage.mp_buildings : "";

    var buildings_there = {};
    
    $('input.vehicle_remove_checkbox').each((i,e)=>{
        buildings_there["building_" + $(e).attr("building_id")] = 1;
    });

    if (mp_tmp != "") {

        var tmp_builds = JSON.parse(mp_tmp);

        var s = "<select id=\"mp_buildings\">";
        
        $(tmp_builds).each((i,e)=>{
            if (typeof buildings_there["building_" + e.building_id] !== "undefined") {
                s += "<option value=\""+ e.building_id +"\">" + e.building_name + "</option>";
            }
        });

        s += "</select>";
        
        $('#mp_loading_building').html("<label>Fahrzeuge von Wachen vor Ort: </label> " + s + " <button type=\"button\" id=\"mp_sel_dept\">Ausw&auml;hlen</button>");
        
        $('#mp_sel_dept').click(()=>{
        
            var id = $('#mp_buildings option:checked').val();
            
            $('input[building_id="' + id + '"]').prop("checked", "checked");//.each((i,e)=>{});
        
        });

    }


})($, localStorage);
