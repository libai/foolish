/**
 *tab组件
 * method init add close on
 *
 */
"use strict";

(function(){
    var tabs = [];
    //初始化tabs

    var $el = null;
    var id = 1;  //tab id自增

    var browseTabs = {
        //初始化
        init:function(el){
           var self = this;
           $el = el;
            //事件绑定
            self.bind($el.find(".chrome-tab"));

            $el.find(".chrome-new-tab").on("click",function(){
                self.add();
            });

        },
        add:function(index){
            var zindex = 0;
            var tabobj = {
                'id':id,
                'title':'新标签'
            };
            tabs.push(tabobj);
            id++;
            var zindex = 40;
            var template = '<div id="tab-'+tabobj.id+'" class="chrome-tab chrome-tab-current" style="z-index: '+zindex+';">'+
                '<div class="chrome-tab-favicon" '+(tabobj.icon?'style="background-image: url(\''+tabobj.icon+'\')"':"")+'></div>'+
                    '<div class="chrome-tab-title">'+tabobj.title+'</div>'+
                    '<div class="chrome-tab-close"></div>'+
                    '<div class="chrome-tab-curves">'+
                        '<div class="chrome-tab-curves-left-shadow"></div>'+
                        '<div class="chrome-tab-curves-left-highlight"></div>'+
                        '<div class="chrome-tab-curves-left"></div>'+
                        '<div class="chrome-tab-curves-right-shadow"></div>'+
                        '<div class="chrome-tab-curves-right-highlight"></div>'+
                        '<div class="chrome-tab-curves-right"></div>'+
                    '</div>'+
                  '</div>';
            //$el.append()
            $(".chrome-tabs>.chrome-tab-current").removeClass("chrome-tab-current");

            //$(template).insertBefore( $el.find(".chrome-new-tab"));
            $(".chrome-tabs").append(template)

            this.fixIndex();
            this.resize();
            //console.log(template);
            //$el.find(".chrome-new-tab").insertBefore(template);
            this.bind($("#tab-"+tabobj.id));

            browseEvent.emit("tab.add", tabobj.id);
        },
        close: function (index) {
            var id = index;
            if(typeof(index) == "string"){
                var id = Number(index.replace("tab-", ""));
            }
            $("#tab-"+id).remove();
            var lastid;
            for(var i in tabs){
                if(tabs[i].id == id){
                    delete tabs[i];
                }else{
                    lastid = tabs[i].id;
                }
            }

            /*
            $el.find(".chrome-tab-current").removeClass("chrome-tab-current")
            var zIndex = tabs.length+40;
            $(this).addClass("chrome-tab-current").css({"z-index":zIndex});

            self.fixIndex();
            var index =  $(this).attr("id").replace("tab-", "");
            browseEvent.emit("tab.changeTo", index);
            */
            changeTo(lastid);

            this.resize();
            browseEvent.emit("tab.close", id);
        },
        resize:function (animate){
            return ;
           // console.log("resize");
           // var spaceWidth = $("#space").width();
          //  console.log(spaceWidth);
            //空白区域
           // if(spaceWidth>1)return;
            var totalWidth = $el.width()-$el.find(".chrome-new-tab").width()-$el.find(".window-min").width()-$el.find(".window-max").width()-$el.find(".window-close").width()
            console.log(targetWidth);
            var targetWidth = totalWidth/tabs.length;
            if(targetWidth>210)targetWidth = 210
            console.log(targetWidth);
            if(animate){



            }else{
                $el.find(".chrome-tab").css({"width":targetWidth+"px"});
            }
        },
        fixIndex:function (){
            var index = tabs.length+1;
            $el.find(".chrome-tab").not(".chrome-tab-current").each(function(i, n){
                $(n).css({"z-index":index});
                index--;
            });
        },
        bind: function($tab){
            var self = this;

            $tab.find(".chrome-tab-close").on("click", function(e){
                e.stopPropagation();
                var id = $(e.target).closest(".chrome-tab").attr("id");
                self.close(id);
                self.resize();
            });
           $tab.on("mousedown", function(e) {
                //console.log(e.which)
                if (e.which == 1) {
                    // 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键

                    var index =  $(this).attr("id").replace("tab-", "");
                    changeTo(index);

                    //browseEvent.emit("tag.drag.start")
                }else if(e.which == 3) {
                    browseEvent.emit("tab.contentmenu")
                }
            });
            $tab.find(".chrome-tab-close").on("mousedown mouseup", function(e){
                e.stopPropagation();
            });

        }
    }
    function changeTo(id){
        $el.find(".chrome-tab-current").removeClass("chrome-tab-current")
        var zIndex = tabs.length+40;
        $("#tab-"+id).addClass("chrome-tab-current").css({"z-index":zIndex});
        browseTabs.fixIndex();
        browseEvent.emit("tab.changeTo", id);
    }

    window.browseTabs = browseTabs;

}).call(this);