var locallydb = require('locallydb');
var fs = require('fs')

var db = new locallydb('./temp'),
collection = db.collection('downloadManage');
//var EventEmitter = require('events').EventEmitter

var downloadPath = 'download/',
fileNameIndex = 1,
queue = [],//内存下载队列
loopStatus = false;

module.exports = {

    loopStatus:false,//速度更新运行状态

    //浏览器下载委托
    delegate:function(event, item, webContents){
        var self = this;
        var saveFile = this.getSaveFileName(downloadPath+item.getFilename());
        item.setSavePath(saveFile);

        var url = item.getUrl();
        //检查是否下载过
        var result = collection.where({url: url}).toArray();
        //console.log(collection.get(0));
        /* //todo已下载任务处理*/
        /*if(result.length){

            this.downloadStart(item);

        }else{*/


            //存入数据库
            var row = {
                  url:url,
                  name:item.getFilename(),
                  type:'http',
                  total:item.getTotalBytes(),
                  downloaded:0,
                  etime:'',//完成时间
                  status:'downloading',
                  savepath:saveFile
             };
            //存入数据库
            var res = collection.insert(row);

            console.log(res);
            //放入队列
            row.$cid = res.$cid;      //唯一id号
            row.item = item;
            queue.push(row);
            //处理速度

            //console.log(item.getFilename());
            //console.log(item.getTotalBytes());;
            //console.log(item.getUrl());
            this.downloadStart(item);
            /*if(loopStatus === false){
                loopStatus = true;
                this.speedLoop(1000);
            }*/
      //}

    },
    //todo，第二次取文件名有个bug
    getSaveFileName:function(fileName) {
        if (fs.existsSync(fileName)){
            var reg = new RegExp("\(\d\)?(\.[^\.]+)?$");
            var newFileName = fileName.replace(reg, "\("+fileNameIndex+"\)$2");
            fileNameIndex++;
            return this.getSaveFileName(newFileName);
        }else{
            fileNameIndex = 1;
            return fileName;
        }
    },
    downloadStart:function(item){
        var self = this;
       // console.log(item.getUrl())
        //console.log(self.queue)
        item.on('updated', function () {

           // console.log(self.queue[item.getUrl()]);
            //console.log("Received:"+ item.getReceivedBytes())
            //queue[item.getUrl()].downloaded =  item.getReceivedBytes();
        });
        item.on('done', function (e, state) {

            var task = this.getQueueByUrl(item.getUrl());
            if (state == "completed") {
                //删除下载队列
                //delete self.queue[item.getUrl()];
                //修改下载状态
                task.status = 'completed'
                //触发下载成功事件
                console.log("Download successfully");
            } else {
                //修改数据库
                task.status = 'error'
                //触发下载失败事件
                console.log("Download is cancelled or interrupted that can't be resumed");
            }
            //
            if(!self.HasQueueDownloadLength()){
                loopStatus = false;
            }
        });
    },
    HasQueueDownloadLength:function(){
        for(var i in queue){
            if(queue[i].status == 'downloading' || queue[i].status == 'queue'){
                return true;
            }
        }
        return false;
    },
    //获取内存下载队列
    getQueue:function(max){
        var retval = [];
         if(!max){
            var end = queue.length;
         }else{
             var end = queue.length-max;
             if(end<0)end=0;
         }
        for(var i= queue.length-1; i>=end; i--){
            queue[i].downloaded = queue[i].item.getReceivedBytes();
            retval.push(queue[i]);
        }
        return retval;
    },
    getQueueByUrl:function(url){
        for(var i in queue){
            if(queue[i].url == url)
            return queue[i]
        }
        return false;
    },
    //更新速度
    speedLoop:function(timeout){
        var self = this

        for(var i in queue){
            if(queue[i].status == 'downloading'){
                var downloaded = queue[i].item.getReceivedBytes();
                queue[i].speed = downloaded - queue[i].downloaded;
                console.log("speed:"+ queue[i].speed);
                queue[i].downloaded = downloaded;
            }
        }
        if(loopStatus == true){
            setTimeout(function(){
                self.speedLoop(timeout);
            },timeout)
        }
    }
}


//inherits(downloadManage, EventEmitter)



/*

downloadManage.prototype.addHttp = function(item){


    var id = collection.insert([
        {name: "sphinx", mythology: "greek", eyes: 2, sex: "f", hobbies: ["riddles","sitting","being a wonder"]}
        ]);
    console.log(id);
    collection.save();
}
//更新下载任务进度
downloadManage.prototype.update = function(){


}
//移出下载任务
downloadManage.prototype.remove = function(){


}
//完成下载
downloadManage.prototype.done = function(){


}

//删除下载任务
downloadManage.prototype.del = function(){


}
*/




