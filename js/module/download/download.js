/**
 *下载组件
 *
 */
"use strict";

(function(){
    var tasks = [];

    function format(byts){
        if(byts>1024*1024*1024){
            var size = Math.round(byts/(1024*1024*1024)*10)/10;
            return size+"G";
        }else if(byts>1024*1024){
            var size = Math.round(byts/(1024*1024)*10)/10;
            return size+"M";
        }else if(byts>1024){
            var size = Math.round(byts/1024*10)/10;
            return size+"KB";
        }else{
            return byts+"Byts";
        }
    }
    var download = {

        $el:null,
        //依赖列表加载前先加载此模块
        dependencies:['dialog'],
        //执行需加载的资源文件列表
        resource:{
            'css':['css/browse-progress-bar.css', "js/module/download/download.css"],
            'js':[]
        },
        //初始化加载模块后自动执行
        init:function(){
            console.log("模块初始化完毕");
        },
        toggleDialog:function(){
            if($("#download-panel").length > 0){
                $("#download-panel").remove();
                this.$el = null;
                return false;
            }else{
                var opt = {
                    id:"download-panel",
                    left:$("#browse-download").offset().left+ $("#browse-download").width()-400,
                    top:$(".window-titlebar").height()+ $("#browser-navbar").height(),
                    width:400,
                    height:300
                };
                browseModule.dialog.show(opt)
                this.$el = $("#download-panel");
                return true;
            }
        },
        updateDialog:function(queue){

            for(var i in queue){
                var downloadItem = queue[i];

                if($("#download-item-"+queue[i].$cid).length>0){
                    var oldDownload = parseInt($("#download-item-"+downloadItem.$cid+" .speed").attr("data-download"));
                    if(!oldDownload>0)oldDownload = 0;
                    var speed = downloadItem.downloaded - oldDownload;
                    $("#download-item-"+downloadItem.$cid+" .speed").attr("data-download", downloadItem.downloaded);

                    $("#download-item-"+downloadItem.$cid+" .speed").text(format(downloadItem.total)+'/'+format(downloadItem.downloaded)+'------'+format(speed)+"/s");
                    var progress = Math.round((downloadItem.downloaded/downloadItem.total)*1000)/10;

                    $("#download-item-"+downloadItem.$cid+" .progress__bar--download").css({'width':progress+"%"})

                    $("#download-item-"+downloadItem.$cid+" .progress__text").html( 'Progress: <em>'+progress+'%</em>')
                }else{
                    //console.log("add download Item")
                    var progress = Math.round((downloadItem.downloaded/downloadItem.total)*1000)/10;
                    var template = '<div class="download-item" id="download-item-'+downloadItem.$cid+'">'+
                        '<div class="icon"><i class="iconfont icon-filezip"></i></div>'+
                        '<div class="info">'+
                        '<div class="title">'+downloadItem.name+'</div>'+
                        '<div class="progress progress--active">'+
                            '<b class="progress__bar progress__bar--download" style="width: '+progress+'%;">'+
                            '<span class="progress__text">'+
                            'Progress: <em>'+progress+'%</em>'+
                            '</span>'+
                            '</b>'+
                        '</div>'+
                        '<div class="speed" data-download="'+downloadItem.downloaded+'">'+format(downloadItem.total)+'/'+format(downloadItem.downloaded)+'------'+format(0)+'/s</div>'+
                        '</div>'+
                        '<div class="operate"><i class="iconfont icon-close"></i><i class="iconfont icon-arrow-right-solid play"></i></div>'+
                        '</div>';
                    $(".content-area").append(template);

                    /*
                    <div class="htmleaf-content">
                        <div class="progress progress--active">
                            <b class="progress__bar progress__bar--orange progress__bar--yellow progress__bar--green" style="width: 87.2%;">
                                <span class="progress__text">
                                Progress: <em>87.2%</em>
                                </span>
                            </b>
                        </div>
                        </div>*/

                }
            }
        }
    }
    browseModule.download = download
}).call(this)
