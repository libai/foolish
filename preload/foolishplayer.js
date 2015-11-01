var remote = require("remote");
var downloadManage = remote.require("./app/downloadManage")

console.log(downloadManage)
/**
 * 播放组件
 */
"use strict";
(function() {
    var $els = [];
    function createPlayer($el){
        var template =  '<div class="foolish-overlay">'+
                                '<div id="popup">'+
                                    '<div id="playlist-popup">'+
                                        '<div class="header">播放列表</div>'+
                                        '<div id="playlist-entries"></div>'+
                                        '<div id="playlist-add-media" class="button bottom">Add media</div>'+
                                    '</div>'+
                                '</div>'+
                         '<div class="foolish-titlebar"></div>'+

                         '<video class="idle" preload><source  type="video/mp4"></video>'+

                         '<div class="foolish-controls">'+
                         '<div id="foolish-controls-timeline">'+
                            '<div id="foolish-controls-timeline-tooltip"></div>'+
                            '<div id="controls-timeline-position"></div>'+
                         '</div>'+
            '<div id="controls-main">'+
            '<div id="controls-play">'+
            '<span class="mega-octicon octicon-playback-play"></span>'+
            '</div>'+
            '<div id="controls-volume">'+
            '<input type="range" id="controls-volume-slider">'+
            '</div>'+
            '<div id="controls-time" class="center">'+
            '<span id="controls-time-current">‒‒:‒‒</span>'+
            '<span id="controls-time-separator">/</span>'+
            '<span id="controls-time-total">‒‒:‒‒</span>'+
            '</div>'+
            '<div id="controls-name" class="center"></div>'+
            '</div>'+
            '<div class="controls-secondary">'+
            '<div id="player-downloadspeed">正在连接....</div>'+
            '<div id="controls-playlist">'+
            '<span class="button"><span class="mega-octicon octicon-three-bars"></span></span>'+
            '</div>'+
            '<div id="controls-fullscreen">'+
            '<span class="button"><span class="mega-octicon octicon-screen-full"></span></span>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';

        $el.innerHTML = template;

        return  {

            init: function(url){
                var self = this;
                var $video =  $el.querySelector("video");

                var totalWidth = $el.offsetWidth;
                var totalHeight = $el.offsetHeight - 50;

                $video.style.width = totalWidth+"px";
                $video.style.height = totalHeight+"px";
                //$video.style.left = "-20px";

                console.log(totalWidth)
                console.log(totalHeight)



                if(url){
                    if (/^magnet/i.test(url)) {
                        downloadManage.playTorrent(url, function(item){
                            console.log(item.getPlayUrl())

                            $video.src = item.getPlayUrl();
                            $el.querySelector("#player-downloadspeed").innerText = "正在缓冲..."
                        });
                    }else if(/^foolish/i.test(url)){
                        url = url.substr(10)
                        downloadManage.playTorrent(url, function(item){
                            console.log(item.getPlayUrl())

                            $video.src = item.getPlayUrl();
                            $el.querySelector("#player-downloadspeed").innerText = "正在缓冲..."
                        });
                    }else{
                        $video.src = url;
                    }
                }

                $video.addEventListener('loadedmetadata',function(){
                   $el.querySelector("#controls-time-total").innerText  = formatTime(this.duration)
                })
                //时间进度更新
                $video.addEventListener('timeupdate',function(){
                    console.log("timeupdate")
                    $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime);
                    var width = Math.ceil(this.currentTime/this.duration*100);
                    $el.querySelector("#controls-timeline-position").style.width = width+'%';
                });
                //暂停时触发
                $video.addEventListener('pause',function(){
                    console.log("pause")
                    $el.querySelector("#controls-play span").className = "mega-octicon octicon-playback-play";
                });
                //play()和autoplay开始播放时触发
                $video.addEventListener('play',function(){

                    $el.querySelector("#controls-play span").className = "mega-octicon octicon-playback-pause";
                });
                //网络失速
                $video.addEventListener('stalled',function(){
                    console.log("stalled")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //发生错误时触发
                $video.addEventListener('error',function(){

                    console.log("error")
                    console.log(this.error.code)
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //中断
                $video.addEventListener('abort',function(){
                    console.log("abort")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //挂起
                $video.addEventListener('suspend',function(){
                    console.log("suspend")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });

                //开始加载
                $video.addEventListener('loadstart',function(){
                    console.log("loadstart")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //正在加载
                $video.addEventListener('progress',function(){
                    console.log("progress")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //加载数据
                $video.addEventListener('loadeddata',function(){
                    console.log("loadeddata")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //等待数据，并非错误
                $video.addEventListener('waiting',function(){
                    console.log("waiting")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //开始回放
                $video.addEventListener('playing',function(){

                    console.log(this.videoWidth)
                    console.log(this.videoHeight)
                    $el.querySelector("#player-downloadspeed").innerText = "正在播放..."
                    //缩放
                    /*
                    var width = this.videoWidth
                    var height =  this.videoHeight
                    var ratio = width / height
                    var totalWidth = $el.offsetWidth ;
                    var totalHeight = $el.offsetHeight  - 50;
                    var frameRatio = totalWidth/totalHeight
                    */
                    /*if(ratio>frameRatio){
                     var newWidth = width
                     var newHeight = height
                     }else{
                     var newWidth = width
                     var newHeight = height
                     }
                     this.style.width = newWidth;
                     this.style.height = newHeight;*/

                    //重设大小
                    console.log("playing")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //可以播放，但中途可能因为加载而暂停
                $video.addEventListener('canplay',function(){
                    console.log("canplay")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //可以播放，资源全部加载完毕
                $video.addEventListener('canplaythrough',function(){
                    console.log("canplaythrough")
                    self.play();
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //寻找中
                $video.addEventListener('seeking',function(){
                    console.log("seeking")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //寻找完毕
                $video.addEventListener('seeked',function(){
                    console.log("seeked")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //播放结束
                $video.addEventListener('ended',function(){
                    console.log("ended")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //播放速率改变
                $video.addEventListener('ratechange',function(){
                    console.log("ratechange")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //资源长度改变
                $video.addEventListener('durationchange',function(){
                    console.log("durationchange")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                //音量改变
                $video.addEventListener('volumechange',function(){
                    console.log("volumechange")
                    //octicon-playback-pause
                    // $el.querySelector("#controls-time-current").innerText  = formatTime(this.currentTime)
                });
                $el.querySelector("#controls-play span").addEventListener("click", function(){
                    if($video.paused){
                        self.play();
                    }else{
                        self.pause();
                    }
                });
                /*************************时间线控制*****************************/

                var timeLineDom = $el.querySelector('#foolish-controls-timeline')
                var tooltip = $el.querySelector('#foolish-controls-timeline-tooltip')
                function updateTimelineTooltip(e) {
                    var percentage = e.pageX / timeLineDom.offsetWidth
                    var time =  formatTime(percentage * $video.duration)
                    tooltip.innerHTML = time
                    tooltip.style.left = (e.pageX - tooltip.offsetWidth / 2) + "px"
                }
                timeLineDom.addEventListener("click", function(e){
                    var time = e.pageX / timeLineDom.offsetWidth * $video.duration
                    self.time(time)
                })
                timeLineDom.addEventListener('mousemove', function (e) {
                    updateTimelineTooltip(e)
                })
                timeLineDom.addEventListener('mouseover', function (e) {
                    tooltip.style.opacity = 1
                    updateTimelineTooltip(e)
                })

                timeLineDom.addEventListener('mouseout', function (e) {

                    tooltip.style.opacity = 0
                })
                /***********************时间线控制end******************/

                /**********************音量控制开始*********************/

                var isVolumeSliderClicked = false
                var volumeSlider = $el.querySelector('#controls-volume-slider')
                function updateAudioVolume(value) {
                    self.volume(value)
                }

                function updateVolumeSlider(volume) {
                    var val = volume.value
                    volume.style.background = '-webkit-gradient(linear, left top, right top, color-stop(' + val.toString() + '%, #31A357), color-stop(' + val.toString() + '%, #727374))'
                }

                volumeSlider.addEventListener('mousemove', function (e) {
                    if (isVolumeSliderClicked) {
                        updateAudioVolume(this.value)
                        updateVolumeSlider(this)
                    }
                })

                volumeSlider.addEventListener('mousedown', function (e) {
                    isVolumeSliderClicked = true
                })

                volumeSlider.addEventListener('mouseup', function (e) {
                    updateAudioVolume(this.value)
                    updateVolumeSlider(this)
                    isVolumeSliderClicked = false
                })
                /**********************音量控制结束*********************/


                //全屏
                $el.querySelector('#controls-fullscreen').addEventListener("click", function(){

                        if(document.fullScreenEnabled){
                            self.exitfullscreen
                        }else{
                            self.fullscreen()
                        }

                })

                document.addEventListener("fullscreenchange", function(){
                    console.log("fullscreenchange")
                    if(document.fullScreenEnabled){
                        $el.querySelector("#controls-fullscreen").querySelector(".mega-octicon").className = "mega-octicon octicon-screen-normal"
                    }else{
                        $el.querySelector("#controls-fullscreen").querySelector(".mega-octicon").className = "mega-octicon octicon-screen-full"
                    }
                })

            },
            play:function(url){
                var $video =  $el.querySelector("video");
                if(url){
                    var lastUrl = $video.src;
                    if(url!=lastUrl)
                        $video.src = url;

                }

                $video.play()
            },
            pause:function(){
                $el.querySelector("video").pause()
            },
            addToPlayList:function(){


            },

            time:function(time){
                var $video =  $el.querySelector("video");
                if (arguments.length) $video.currentTime = time
                return $video.currentTime
            },
            volume: function (value) {
                var $video =  $el.querySelector("video");
                if (arguments.length) $video.volume = value/100
                return $video.volume
            },
            fullscreen: function(){
                $el.webkitRequestFullscreen();

            },
            exitfullscreen: function(){
                document.webkitExitFullscreen();

            }
        };
    }

    function foolish($el){
        return createPlayer($el);
    }
    var formatTime = function (secs) {
        var hours = (secs / 3600) | 0
        var mins = ((secs - hours * 3600) / 60) | 0
        secs = (secs - (3600 * hours + 60 * mins)) | 0
        if (mins < 10) mins = '0' + mins
        if (secs < 10) secs = '0' + secs
        return (hours ? hours + ':' : '') + mins + ':' + secs
    }

    window.foolish = foolish

}).call(this);
