"use strict";

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
        
        if (mp_emp_indx >= mp_buildings.length) {
            mp_lookup_personal(0, true);
        }
        
    });
    
    if (localStorage.getItem("mp_employees") && localStorage.getItem("mp_employees").length > 2) {
        
        mp_employee = JSON.parse(localStorage.getItem("mp_employees"));
        console.info("employees found", mp_employee);
    }
    
    console.info("mp_lookup_personal starting",
        //mp_lookup_personal(0)
    );
    
})($, localStorage);