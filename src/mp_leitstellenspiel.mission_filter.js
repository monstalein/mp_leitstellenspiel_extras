
(($, mp_intervall, localStorage)=>{
        
    var m = JSON.parse(localStorage.getItem("aMissions"));
    
    if (m == null) {
        
        //missions - script vom LSSM
        if(!localStorage.aMissions || JSON.parse(localStorage.aMissions).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) {
            $.getJSON('/einsaetze.json').done((data) => {
                localStorage.setItem('aMissions', JSON.stringify({lastUpdate: new Date().getTime(), value: data}));
                m = JSON.parse(localStorage.getItem("aMissions"));
            }).fail((d,e,f)=>{
                console.warn("FAIL", d, e, f);
            });
        }
        
	} else {
        
        mp_start_mission_filter(m);
        
    }
    
    
    
})($, mp_intervall, localStorage);

function mp_start_mission_filter(m) {
    
    let mp_missions = [];

    $('#search_input_field_missions').after(`
       <label for="mp_mission_filter">Mission filter:</label> <select id="mp_mission_filter"></select> 
       <!--label alt="Sonder-Eins&auml;tze wie Muttertag, Halloween, Fussbal, etc."><input type="checkbox" id="mp_mission_filter_events"> Nur Sonder-Eins&auml;tze</label --> 
       <small id="mp_mission_hidden"></small>
    `
    );
    
    var o = "<option value=\"-1\">Alle</option>";

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
        
        $('#missions-panel-body .mission_deleted').remove();
      
        $('#missions-panel-body .missionSideBarEntry').each((i,e)=> {

            var id = $(e).attr("mission_type_id");
            
            if (missions[id] < mp_mission_filter_selected) {
                
                //if ($('#mp_mission_filter_events').prop("checked") != false)
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

}