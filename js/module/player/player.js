"use strict";
(function(){
    var player = {
        dependencies:['dialog'],
        playerDialog:function(url){
            console.log("player pannel")
            if($("#player-panel").length == 0){
                var opt = {
                    id:"player-panel",
                    left:200,
                    top:200,
                    width:500,
                    height:400
                };
                browseModule.dialog.show(opt)
                console.log("player pannel show")

            }
            var template = '<video src="'+url+'" controls="controls">'+ '</video>';

            $("#player-panel .content-area").html(template)
        }

    }




    browseModule.player = player

}).call(this)