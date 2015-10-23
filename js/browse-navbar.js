"use strict";

(function(){
    var $el = null;


    var browseNavbar = {

        init:function(el){
            $el = el

           $el.find(".icon-refresh").parent().on("click", function(e){
               e.stopPropagation();
               var iconDom = $(this).find(".iconfont");
               if(iconDom.hasClass("icon-refresh")) {
                   iconDom.removeClass("icon-refresh").addClass("icon-close");
                   browseEvent.emit("navbar.refresh");
               }else if(iconDom.hasClass("icon-close")){
                   iconDom.removeClass("icon-close").addClass("icon-refresh");
                   browseEvent.emit("navbar.stop");
               }
            });
            this.inputBind();
            this.downloadBind();
            this.toolBind();

        },
        inputBind:function(){
            var locationInput = $("#location");
            var firstIn = true;
            locationInput.on("mousedown", function(e){
                if(firstIn){
                    this.select();
                    e.preventDefault();
                }

            })
            locationInput.on("blur", function(){
                firstIn = true;
            })
            locationInput.on("keydown", function(e){
                if (e.keyCode == 13) {
                    e.preventDefault()
                    browseEvent.emit("navbar.jump", this.value);
                }
            })
            locationInput.on("mouseup", function(e){
                if(firstIn)
                    e.preventDefault()
                firstIn = false;
            })
        },
        downloadBind:function(){
            $("#browse-download").on("click", function(){

                browseEvent.emit("navbar.download");

            })
        },
        toolBind:function(){


        },
        setLocation:function(url){
            $("#location").val(url)
        }


    };

    window.browseNavbar = browseNavbar;

}).call(this);
