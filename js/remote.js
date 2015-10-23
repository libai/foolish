var remote = require("remote");
var downloadManage = remote.require("./app/downloadManage")

"use strict";
(function(){

    //开启下载信息窗口
    var updateLoop = false;
    browseEvent.on("browse.download.dialog.open", function(){
        browseModule.load("download", true, function() {
            updateLoop = true;
            updateDownloadDialog();
        })
    })
    function updateDownloadDialog(){
        var queue = downloadManage.getQueue(5);
        console.log(queue);
        browseModule.download.updateDialog(queue);
        if(updateLoop){
            setTimeout(function(){
                updateDownloadDialog();
            }, 1000);
        }
    }
    browseEvent.on("browse.download.dialog.close", function(){
        updateLoop = false;
    })
    /*
    ipc.on("download.hasDownloaded", function(cid){

        console.log(cid)
    });*/

}).call(this);