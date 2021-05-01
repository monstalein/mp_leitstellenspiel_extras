
(($)=> {
    
    var o = null;
    
    $('h4').each((i,e)=>{if ($(e).text()=="Verbandskrankenhäuser"){o = $(e).next();}});
    
    if (o) {
        
        $(o).find("tbody tr").each((i, e)=> {
            
            var s = $(e).find("td:nth-child(6) a").attr("href");
            
            // only if there is a 6th column
            if (s) {
                var t = s.substr(s.lastIndexOf("/") + 1);
                
                $(e).find("td:nth-child(1)")
                    .css("position", "relative")
                    .append(" <a href=\"/buildings/" + t + "\" target=\"_blank\" class=\"label label-info\" data-id=\"" + t + "\">Infos</a>")
                    .append('<div style="width: 400px; height: 100px; display: none; position: absolute; z-index: 9; background-color: #eee; border-radius: 2px;">&nbsp;</div>')
                ;
            }
        });
        
        $(o).find("tbody td:nth-child(1) a").on("mouseover", (e)=>{
            
            console.log("a", $(e.target).data("id"), e);
            
            $(e.target).next().show().css("left", e.clientX + "px").text("Loading...");
            
            $.get("/buildings/" + $(e.target).data("id"))
                .done((d)=>{
                    $(e.target).next().html($(d).find("dl[class=\"dl-horizontal\"]").html());
                })
            ;
            
        }).on("mouseout", (e)=>{
            
            $(e.target).next().hide();
        });
    }

    
})($);