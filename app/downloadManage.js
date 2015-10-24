var locallydb = require('locallydb');
var fs = require('fs')
var torrentDownload = require('./torrentDownload');

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
            console.log(row);
            //存入数据库
            var res = collection.insert(row);

            //放入队列
            row.$cid = res;      //唯一id号
            row.item = item;
            row.downloadType = 'http';
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
            console.log("Received:"+ item.getReceivedBytes())
            //queue[item.getUrl()].downloaded =  item.getReceivedBytes();
        });
        item.on('done', function (e, state) {

            var task = self.getQueueByUrl(item.getUrl());
            if (state == "completed") {
                task.status = 'completed'
                var totalSize = item.getTotalBytes();
                //小于300kb尝试bt下载
                if(totalSize < 300*1024){
                    torrentDownload.torrentAdd(item.getUrl(), downloadPath+item.getFilename(), downloadPath, function(torrentItem){
                        task.status = 'downloading'
                        task.downloadType = 'bt';
                        task.item = torrentItem;
                    });
                }
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

            var queueItem = queue[i].item;
            retval.push({
                $cid:queue[i].$cid,
                total:queueItem.getTotalBytes(),
                downloaded:queueItem.getReceivedBytes(),
                name:queueItem.getFilename(),
                type:queueItem.getMimeType(),
                downloadType:queue[i].downloadType
            });
        }
        return retval;
    },

    getPlayUrl:function($cid){
        for(var i in queue){
            var row = queue[i]
            if(row.$cid == $cid){
                if(row.downloadType == 'http'){
                    if(row.status == 'downloading'){
                        return row.item.getUrl();
                    }else{
                        return downloadPath+row.item.getFileName
                    }

                }else{
                   return  row.item.getPlayUrl();
                }
            }
        }
    },
    getQueueByUrl:function(url){
        for(var i in queue){
            if(queue[i].url == url)
            return queue[i]
        }
        return false;
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




