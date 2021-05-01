"use strict";

var mp_employee={},mp_emp_running=false,mp_emp_indx=0;

(($, localStorage)=>{

   
    $('#logout_button').parent().after('<li role="presentation"><a id="mp_employee_show" data-toggle="modal" data-target="#mp_peronal_dlg" style="cursor: pointer;"><i class="glyphicon glyphicon-user"></i> Angestellte</a></li>');
    
    $('#mp_peronal_dlg table').tablesorter();
    
    $('#mp_peronal_dlg').on("shown.bs.modal", ()=>{
        
        $('#mp_peronal_dlg').width($('body').width() + "px");console.info("resize");
        
        $('#mp_employee_list_body').empty();
        
        var s = "", i = 0, ausb = {};
        
        /*
        for (var i = 0; i < mp_employee.length; i++) {
        */
        for (var x in mp_employee) {
            
            for (var i = 0; i < mp_employee[x].personal.length; i++) {
            
                s += `<tr data-ausb="${mp_employee[x].personal[i][1]}">`;
                s += `<td>${mp_employee[x].buildingname}</td>`;
                
                for (var j = 0; j < 3; j++) {
                    
                    s += `<td>${mp_employee[x].personal[i][j]}</td>`;
                    
                }
                s += "</tr>";
                
                if (mp_employee[x].personal[i][1]) {
                    ausb[mp_employee[x].personal[i][1]] = 1;
                }
            }
            
            //if (i++ > 5) break;
        }
        
        $('#mp_employee_qualification').empty()
            .append("<option value=\"0\">Alle</option>")
            .append("<option value=\"1\">Ohne Ausbildung</option>")
        ;
        
        var ordered = Object.keys(ausb).sort().reduce((o,k)=>{o[k]=ausb[k];return o}, {});
        
        for (var x in ordered) {
            $('#mp_employee_qualification').append("<option value=\"" + x + "\">" + x + "</option");
        }
        
        $('#mp_employee_qualification').on("change", ()=>{
            
            var o = $('#mp_employee_qualification option:selected').val();
            
            $('#mp_employee_list').parent().parent().css("background-color", "#ddd");
            
            $('#mp_employee_qualification').prop("disabled", "disabled").after(" <span class=\"loading\">Loading... <i class=\"fa fa-hourglass-half\"></i></span>");;
            
            window.setTimeout(()=>{
                
                if (o == "1") {
                    
                    $('#mp_employee_list_body tr[data-ausb!=""]').hide();
                    $('#mp_employee_list_body tr[data-ausb=""]').show();
                    
                } else if (o != "0") {
                    
                    $('#mp_employee_list_body tr[data-ausb!="' + o + '"]').hide();
                    $('#mp_employee_list_body tr[data-ausb="' + o + '"]').show();
                    
                } else {
                    
                    // alle anzeigen
                    $('#mp_employee_list_body tr').show();
                    
                }
                
                $('#mp_employee_list').parent().parent().css("background-color", "#fff");
                
                $('#mp_employee_qualification').removeProp("disabled").next("span").remove();
                
            },250);
        });
        
        $('#mp_employee_list_body').append(s);
        
        $('#mp_peronal_dlg table.sortable').trigger("update", [true, null]);
        
        $('#mp_employee_list').parent().parent().scroll((e)=>{
            
            if (e.currentTarget.scrollTop < 50) {
                $('.mp_header').hide();
            } else {
                $('.mp_header').show();
            }
        });
        
    });
    
    $('#mp_personal_export').click(()=> {
        
        var s = "[";
        
        for (var i in mp_employee) {
            s += 
                mp_employee[i].personal.map((p)=>(
                    JSON.stringify({   
                        name: p[0],
                        ausbildung: p[1],
                        bid: mp_employee[i].buildingid
                    })
                )
            ) + ",";
        }
        
        var w = window.open("data:application/json;charset=utf-8," + s, "_blank");
        
        w.document.write(s.substr(0, s.length - 1) + "]");
        
        return false;
    });
    
    $('#mp_personal_refresh').on("click", ()=>{
        
        $('#mp_employee_force').parent().hide("fade");
        
        if ($('#mp_employee_force').is(":checked")) {
            
            mp_lookup_personal(0, true);
            
        } else {
            
            mp_lookup_personal(0, false);
            
        }
        
    });
    
    if (localStorage.getItem("mp_employees") && localStorage.getItem("mp_employees").length > 2) {
        
        mp_employee = JSON.parse(localStorage.getItem("mp_employees"));
        console.info("employees found", mp_employee);
    }
    
    
})($, localStorage);

function mp_lookup_personal(indx, forceLoad = false) {
    if (mp_emp_running) {
        return false;
    }
    
    mp_emp_running = true;
    mp_emp_indx = indx;
    
    if (indx < mp_buildings.length) {
        $('#mp_personal_refresh span').text("(wird geladen " + (indx + 1) + "/" + mp_buildings.length + ")");
    } else {
        $('#mp_personal_refresh span').text("(fertig geladen " + (indx + 1) + "/" + mp_buildings.length + ")");
    }

    if (indx <= mp_buildings.length && typeof mp_buildings[indx] !== "undefined") {
//    if (indx <= 25 && typeof mp_buildings[indx] !== "undefined") {
        
// 1. buildings/[id]
// 2. buildings/[id]/peronals
        
        var o = typeof mp_employee["b" + mp_buildings[indx]] !== "undefined" ? mp_employee["b" + mp_buildings[indx]] : null;
        
        if (o == null || ((new Date()).getTime() > (o.updatetime + 86400000)) || forceLoad ) { // wenn nicht geladen, oder aelter als 24h
        
console.log("load employee", indx, o);

        // make fraud detection harder
            $.get('https://www.leitstellenspiel.de/buildings/' + mp_buildings[indx])
                .done((dxx)=>{
                    
                    window.setTimeout(()=>{
                        
                        $.get('https://www.leitstellenspiel.de/buildings/' + mp_buildings[indx] + '/personals')
                            .done((d)=>{
                                
                                var t=$(d).find("#back_to_building").attr("href"),w=t.substring(t.lastIndexOf("/")+1);
                                //alert("ID: " + w + "\n" + $(d).find("#personal_table").text());
                                
                                var s={
                                        "buildingid": mp_buildings[indx], 
                                        "buildingname": $(d).find('#back_to_building').text(), 
                                        "updatetime": (new Date()).getTime(), 
                                        "personal": []
                                    };
                                
                                $(d).find("#personal_table tbody tr").each((i,e)=>{
                                    
                                    var p=[];
                                    
                                    //$(e).children().each((i2,e2)=>{
                                    //    p.push($(e2).text());
                                    //});
                                    for(var x=0;x<3;x++) {
                                        p.push($($(e).children()[x]).text());
                                    }
                                    
                                    s.personal.push(p);
                                });
                                
                                mp_employee["b" + mp_buildings[indx]] = s;

                                localStorage.setItem("mp_employees", JSON.stringify(mp_employee));
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
                                    mp_lookup_personal(v, forceLoad);
                                },i);
                            })
                        ;
                        
                    }, 300 + (Math.random() * 100));
                    
                })
                .fail((d,e,f)=>{
                    console.error("mp_lookup_personal ERROR", d, e, f);
                });
            ;
            
        } else { // Gebaeude ueberspringen
console.log("not loading employee", indx);
            // next building
            var v=indx+1;
            mp_emp_running=false;
            return mp_lookup_personal(v, forceLoad);
            
        }
        
    }else{
        $('#mp_personal_refresh span').text("");
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
