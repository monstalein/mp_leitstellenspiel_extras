window.mp_show_show_all_vehicles = true;

(function () {
    
    $('.building_list_caption')
        .css("cursor", "pointer")
        .off()
        .on("click", (e)=>{
        
            $(e.target).next().children().toggle();
            
            buildingsVehicleLoadVisible();
        })
    ;
//    $('<div class="btn btn-xs pull-right btn-default" id="mp_toggle_buildings">Toggle all</div><div class="clear"></div><br>').insertBefore('#building_list');
//    
//    $('#mp_toggle_buildings')
//        .off()
//        .on("click", () => {
//            
//            if (mp_show_show_all_vehicles) {
//                $('.building_list_vehicles').children().hide();
//                //buildingsVehicleLoadVisible();
//                //window.setTimeout(()=>{$('.building_list_vehicles').children().hide();},1000);
//            } else {
//                $('.building_list_vehicles').children().show();
//            }
//            mp_show_show_all_vehicles = !mp_show_show_all_vehicles;
//            
//        });
}
)();
