/**
 *下载组件
 *
 */
"use strict";

(function(){

    var dialogId = 0;

    var dialog = {
        //依赖列表加载前先加载此模块
       // dependencies:[],
        //执行需加载的资源文件列表
        resource: {
            'css': ['css/chrome-bootstrap.css']
        },
       show:function(opt){
            var option = {
                left:0,
                top:0,
                title:"",
                content:"",
                width:400,
                height:300,
                action:"",
                dragable:false,//todo
                modal:false, //todo
                autoClose:false,//todo
                closeBtn:false,
                multi:false,
                id:null
            }
            //option =  $.extend(option, opt)
          for(var i in opt){
              if(opt[i] ) option[i] = opt[i]
          }
           console.log(option)
            var template = '<div '+(option.id?'id="'+option.id+'"':'')+' class="browse-dialog" style="width:'+option.width+'px;height:'+option.height+'px;left:'+option.left+'px;top:'+option.top+'px">'+
                '<div class="page">'+
                (option.title?'<h1>'+option.title+'</h1>':"")+
                    (option.closeBtn?'<div class="close-button"></div>':'')+
                    '<div class="content-area">'+option.content+'</div>'+
                    '<div class="action-area">'+option.action+'</div>'+
                '</div>'+
                '</div>';
           if($(".chrome-bootstrap").length == 0){
               $("body").append('<div class="chrome-bootstrap"></div>');
           }
           if(option.multi == false){
               $(".chrome-bootstrap").empty()
               browseEvent.emit("browse.dialog.closeAll");

               browseEvent.emit("browse.download.dialog.close");
           }
           $(".chrome-bootstrap").append(template);
       },
       hide:function(id){
           id = "browse-dialog-"+id.replace("browse-dialog-", "");
           $(".chrome-bootstrap").find("#"+id).hide();
       },
       remove:function(id){
           id = "browse-dialog-"+id.replace("browse-dialog-", "");
           $(".chrome-bootstrap").find("#"+id).remove();
       },
       empty:function(){
           $(".chrome-bootstrap").empty()
       }
    }
    browseModule.dialog = dialog
}).call(this)
