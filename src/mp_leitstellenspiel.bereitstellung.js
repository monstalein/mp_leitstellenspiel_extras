"use strict";

(($, localStorage)=> {
    
    if ($('h1[building_type="14"]').length > 0) {

        $('#iframe-inside-container > form > h3').after("<div id=\"mp_loading_building\">loading</div>");

        var mp_tmp = "mp_buildings" in localStorage ? localStorage.mp_buildings : "";

        var buildings_there = {};
        
        $('input.vehicle_remove_checkbox').each((i,e)=>{
            buildings_there["building_" + $(e).attr("building_id")] = 1;
        });

        if (mp_tmp != "") {

            var tmp_builds = JSON.parse(mp_tmp);

            var s = "<select id=\"mp_buildings\" class=\"btn\">";
            
            $(tmp_builds).each((i,e)=>{
                if (typeof buildings_there["building_" + e.building_id] !== "undefined") {
                    s += "<option value=\""+ e.building_id +"\">" + e.building_name + "</option>";
                }
            });

            s += "</select>";
            
            $('#mp_loading_building').html("<label>Fahrzeuge von Wachen vor Ort: </label> " + s + 
                " <button class=\"btn btn-secondary\" type=\"button\" id=\"mp_sel_dept\" title=\"Es k&ouml;nnen nacheinander auch mehrere Wachen ausgew&auml;hlt werden, und dann einmal aufgehoben werden\">Wache ausw&auml;hlen</button> " +
                //" oder <button class=\"btn btn-primary\" type=\"button\" id=\"mp_sel_trailer\" title=\"Zugfahrzeuge fahren automatisch mit - so bleiben keine Anh&auml;nger im Status 9 hier\">Alle Anh&auml;nger ausw&auml;hlen</button>" + 
                " dann <button class=\"btn btn-warning\" type=\"submit\" name=\"submit\">Bereitstellung der Fahrzeuge aufheben</button>"
            );
            
            $('#mp_sel_dept').click(()=>{
            
                var id = $('#mp_buildings option:checked').val();
                
                $('input[building_id="' + id + '"]').prop("checked", "checked");//.each((i,e)=>{});
            
            });
            
            $('#mp_sel_trailer').click(()=>{
                
                var vehi = JSON.parse(localStorage.aVehicleTypesNew);
                
                for (var i = 0; i < vehi.value.length; i++) {
                    
                    var t = vehi.value[i];
    console.log("vehi", t);
                    if (typeof t.additional.trailer !== "undefined") {
                        // ist ein Anh&auml;nger
                        $('img[vehicle_type_id="' + t.id + '"]').parent().parent().find('input[class="vehicle_remove_checkbox"]').prop("checked", "checked");
                    }
                }
               
            });

        }
    }

})($, localStorage);
