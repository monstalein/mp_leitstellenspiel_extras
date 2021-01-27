

function mp_fnc(i){if (i < mp_arr.length){console.log(i,mp_arr.length,mp_arr[i]);$.get("https://www.leitstellenspiel.de/buildings/" + mp_arr[i] + "/hire_do/3");var v=i+1;window.setTimeout(()=>{mp_fnc(v)},1000+(Math.random()*1000+500));}else{console.info("mp Done.");console.groupEnd()}};
var mp_types=[0,2,6,9,11],mp_arr=[];
$(function(){

  $("#building_list > li").each((i,e)=>{ var t=jQuery(e).data("building_type_id");if (mp_types.indexOf(t)){mp_arr.push(jQuery(e).children("ul").data("building_id"))}});
  if (user_premium!=true) {
    console.info("starting");
    console.group("running");
    mp_fnc(0);
  }


});
