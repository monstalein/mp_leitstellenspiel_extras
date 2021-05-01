
(($, mp_intervall, localStorage)=>{
    
    let mp_missions = [];
    
    $('#search_input_field_missions').after('<label for="mp_mission_filter">Mission filter:</label> <select id="mp_mission_filter"></select> <small id="mp_mission_hidden"></small>');
    
    var o = "<option value=\"-1\">Alle</option>";

    var m = JSON.parse(localStorage.getItem("aMissions"));
    
    for (var i = 0; i < mp_intervall.length; i++) {
        
        o += `<option value="${i}">Ab ${mp_intervall[i].n} Credits</option>`;

        let x = mp_intervall[i];

        mp_missions[i] = m.value.filter(function (m) {return m.average_credits >= this.val.n && m.average_credits < this.val.x; }, {val: x});

    }
    
    $('#mp_mission_filter').append(o);
        
    $('#mp_mission_filter').val(mp_mission_filter_selected);
    
    $('#mp_mission_filter').on("change", ()=> {
        
        mp_mission_filter_selected = $('#mp_mission_filter option:selected').val();
    });
    
    var missions = [];
    
    mp_missions.map(function(m,i){ 
    
        m.map(function(e) {
            
            this.m[e.id] = this.i;
            
        }, { m: this.m, i: i});

    }, { m: missions });
    
    var filter = () => {
        
        var h = 0, s = 0;
      
        $('#missions-panel-body .missionSideBarEntry').each((i,e)=> {

            var id = $(e).attr("mission_type_id");
            
            if (missions[id] < mp_mission_filter_selected) {
                
                $(e).hide();
                h++;
                
            } else {
            
                $(e).show();
                s++;
            }

        });

        if (h == 0) {
            $('#mp_mission_hidden').text("");
        } else {
            $('#mp_mission_hidden').text("(Versteckt: " + h + ")");
        }
    };
    
    window.setInterval(function () {
        
        filter();
        
    }, 1000);

})($, mp_intervall, localStorage);
