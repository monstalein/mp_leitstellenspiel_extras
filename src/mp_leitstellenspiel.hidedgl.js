
console.log("hidedgl", location);

$(function()
{
   
    window.setTimeout(mp_hidedgl_add_button, 500);
   
});

var mp_hidedgl_active = false, mp_hidegl_interval = null;

function mp_hidedgl_add_button()
{
    if ($('#iframe-inside-container h1').length == 0)
    {
        window.setTimeout(mp_hidedgl_add_button, 500);
        return;
    }
    $('#iframe-inside-container h1').append(`
        <div style="display: inline-block;">
            <button type="button" class="mp_hidedgl btn">DGL-Eins&auml;tze angezeigt</button>
        </div>
    `);
    
    $('body').append(`
        <style>
            button.mp_hidedgl { background-color: #0d0; }
            button.mp_hidedgl.active { background-color: red; }
        </style>
    `);
    
    $('#iframe-inside-container h1 button.mp_hidedgl').click(()=>
    {
        if (!mp_hidedgl_active)
        {
            $('#iframe-inside-container h1 button.mp_hidedgl').addClass("active").html("DGL-Eins&auml;tze ausgeblendet");
            
            $('tr.mission_type_index_searchable').find('td:contains("Dienstgruppen")').parent().hide()
            
            mp_hidegl_interval = window.setInterval(function()
            {
                $('tr.mission_type_index_searchable').find('td:contains("Dienstgruppen")').parent().hide()
            }, 250);
            
            mp_hidedgl_active = true;
        }
        else
        {
            $('#iframe-inside-container h1 button.mp_hidedgl').removeClass("active").html("DGL-Eins&auml;tze angezeigt");
            
            window.clearInterval(mp_hidegl_interval);
            
            $('tr.mission_type_index_searchable').find('td:contains("Dienstgruppen")').parent().show()
            
            mp_hidedgl_active = false;
        }
        
        console.info("click");
    });
}