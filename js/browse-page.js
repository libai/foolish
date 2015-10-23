"use strict";

(function(){

    var pages = {},currentId

    var browsePage = {

        add:function(id, url, show){

            var template = '<div id="browser-page-'+id+'" class="browse-page-content" '+(show!==false?"":"style=\"display\"")+'>'+
                '<div id="browser-page-search" class="hidden">'+
                '<input type="text" placeholder="搜索">'+
                '</div>'+
                '<webview preload="./preload/main.js"  tabindex="-1" src="'+url+'"></webview>'+
                '<div id="browser-page-status" class="hidden"></div>'+
                '</div>';
            $(template).insertAfter($(".chrome-shell-bottom-bar"));
            currentId = id;
            browseEvent.emit("page.add", id);
        },
        close:function(id){
            if(!id)id = currentId
            $("#browser-page-"+currentId).remove();
            browseEvent.emit("close");
        },
        changeTo:function(id){
            $("#browser-page-"+currentId).css({"display":"none"})
            currentId = id;
            $("#browser-page-"+id).css({"display":"block"})
        },
        jump:function(url){
            if(!url)return;
            console.log( $("#browser-page-"+currentId).find("webview"));
            $("#browser-page-"+currentId).find("webview").attr("src", url);
        },
        showTagsbar:function(){
            $(".chrome-shell-bottom-bar").css({"display":"block"})
        },
        hideTagsbar:function(){
            $(".chrome-shell-bottom-bar").css({"display":"none"})
        },
        getCurrentId:function(){
            return currentId;
        },
        getCurrentPageUrl:function(){
            console.log($("#browser-page-"+currentId));
            console.log($("#browser-page-"+currentId).find("webview"))
            return  $("#browser-page-"+currentId).find("webview").attr("src");
        }

    }

    window.browsePage = browsePage;

}).call(this)
