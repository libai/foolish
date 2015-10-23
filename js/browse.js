/**
 * 浏览器事件监听
 */


"use strict";
(function(){

    browseTabs.init($(".chrome-tabs-shell"));
    browseEvent.on("tab.add", function(id){
        console.log("add");
        var defaultUrl = "http://www.baidu.com";
        browsePage.add(id, defaultUrl)
        browseNavbar.setLocation(defaultUrl);
    });
    browseEvent.on("tab.changeTo", function(id){
        console.log("changeTo"+id);
        browsePage.changeTo(id);
        console.log(browsePage.getCurrentPageUrl())
        browseNavbar.setLocation(browsePage.getCurrentPageUrl());

    });
    browseEvent.on("tab.close", function(id){
        console.log("close");
        browsePage.close(id)
    });
    browseTabs.add();

    browseNavbar.init($("#browser-navbar"))
    browseEvent.on("navbar.refresh", function(){
        console.log("refresh");
    });
    browseEvent.on("navbar.stop", function(){
        console.log("stop");
    });
    browseEvent.on("navbar.jump", function(url){
        var match = url.match(/^((http|ftp|https):\/\/){1}(\S+)$/);
        if (match == null) {
            url = "http://" + url;
        }
        console.log("jump:"+url);
        browsePage.hideTagsbar()
        browsePage.jump(url);
    });
    browseEvent.on("navbar.download", function(){
        browseModule.load("download", true, function(){
            //console.log("OK1")
           var result = browseModule.download.toggleDialog();
            if(result){
                browseEvent.emit("browse.download.dialog.open");
            }else{
                browseEvent.emit("browse.download.dialog.close");
            }
        })
    })
}).call(this);
