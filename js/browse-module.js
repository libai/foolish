"use strict";

(function(){
    var loadfiles = [],
    loading =false,
    queue = [];//加载队列
    var browseModule = {

        load:function(moduleName, auto, onsuccess, onerror){
            queue.push({
                moduleName:moduleName,
                auto:auto,
                onsuccess:onsuccess,
                onerror:onerror
            });
            if(loading == false){
                this._loadNext();
            }
        },
        _loadNext:function(){
             if(queue.length>0){
                   var opt = queue.pop();
                   console.log(queue);
                   loading = true;
                   this._load(opt.moduleName, opt.auto, opt.onsuccess, opt.onerror);

             }else{
                 loading = false;
             }
        },
        /**
         * 加载一个模块
         * @param moduleName
         * @param auto   自动执行模块下的init方法
         * @param onsuccess
         * @param onerror
         */
        _load:function(moduleName, auto, onsuccess, onerror){
            var self = this
            var progress = {
                'main':false,
                'dependencies':false,
                'resource':false
            }
            var error = false;
            console.log("_load")
            if(typeof(browseModule[moduleName]) == "undefined" ){
                console.log("load start")
                //先加载模块入口
                self.loadMain(moduleName, function(){
                    console.log("load main success")

                    progress.main = true;
                    self.loadDependencies(moduleName,function(){
                        console.log("load Dependencies success")
                        progress.dependencies = true;
                        self.loadResource(moduleName, function(){
                            if(auto!== false &&  browseModule[moduleName].init){
                                browseModule[moduleName].init();
                            }
                            if(onsuccess){
                                console.log("success")
                                onsuccess()
                            }
                            self._loadNext()
                        },function(){
                            if(!error && onerror){
                                onerror()
                                error = true;
                            }
                            self._loadNext()

                        })
                    }, function(){
                        if(onerror)
                            onerror();
                        self._loadNext()

                    });
                },function(){
                    if(onerror)
                        onerror();

                      self._loadNext()
                })

            }else{
                if(auto!== false &&  browseModule[moduleName].init){
                    browseModule[moduleName].init();
                }
                if(onsuccess)
                    onsuccess();
                self._loadNext()

            }
        },
        loadMain:function(moduleName, onsuccess, onerror){
            var modulemain = "js/module/"+moduleName+"/"+moduleName+".js"
            this.loadFile(modulemain, 'js', onsuccess, onerror);
        },
        loadDependencies:function(moduleName, onsuccess, onerror){

            if(browseModule[moduleName].dependencies && browseModule[moduleName].dependencies.length>0){
                console.log("has dependencies")
                var error = false;
                var length = browseModule[moduleName].dependencies.length;
                for(var i in browseModule[moduleName].dependencies){
                    if(error === false){
                        browseModule._load(browseModule[moduleName].dependencies[i], false, function(){
                            length--;
                            if(length == 0) {
                                if(onsuccess)onsuccess();
                            }
                        }, function(){
                            error = true;
                            if(onerror) onerror();
                        })
                    }else{
                        break;
                    }
                }

            }else{
                onsuccess();
            }
        },
        loadResource:function(moduleName, onsuccess, onerror){
            if(browseModule[moduleName].resource){
                var length = 0;
                var error = false;
                var loading = true;
                if(browseModule[moduleName].resource.css)
                    length += browseModule[moduleName].resource.css.length
                if(browseModule[moduleName].resource.js)
                    length += browseModule[moduleName].resource.js.length
                if(length == 0 && onsuccess)onsuccess()
                if(browseModule[moduleName].resource.css){
                        for(var i in browseModule[moduleName].resource.css){

                            browseModule.loadFile(browseModule[moduleName].resource.css[i] ,'css', function(){

                                length--;
                                if(length == 0 && onsuccess)onsuccess()
                            },function(){
                                error = true;
                                if(onerror)onerror()
                            })
                        }
                }
                if(browseModule[moduleName].resource.js){
                    for(var i in browseModule[moduleName].resource.js){
                        browseModule.loadFile(browseModule[moduleName].resource.js[i], 'js', function(){
                            length--;
                            if(length == 0 && onsuccess)onsuccess()
                        },function(){
                            error = true;
                            if(onerror)onerror()
                        })
                    }
                }
            }
            //if(onsuccess)onsuccess()
        },
        loadFile:function (filename, filetype, onload, onerror) {
            if(this.inArray(filename, loadfiles)){
               if(onload)onload()
                return
            }
            loadfiles.push(filename)

            if (filetype == "js") {
                var fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", filename);
            } else if (filetype == "css") {
                var fileref = document.createElement('link');
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
            }
            if (typeof fileref != "undefined") {
               if(onload) fileref.onload = onload;
               if(onerror)fileref.onerror = onerror;
               document.getElementsByTagName("head")[0].appendChild(fileref);
            }
        },
        inArray:function(needle, array){
            for(var i in array){
                if(needle == array[i]){
                    return true
                }
            }
            return false
        }
    }
    window.browseModule = browseModule;

}).call(this)
