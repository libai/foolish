var WebTorrent = require('webtorrent')
var path = require('path')
var inherits = require("util").inherits
var events = require('events')

var torrentServer = require("./torrentServer")

var torrentClient = WebTorrent();

var torrentHttpServer =  torrentServer(torrentClient);
var torrentServerPort = 0

torrentHttpServer.listen(0, function () {
    torrentServerPort = torrentHttpServer.address().port
    console.log('Listening on ' + torrentServerPort)
});


function torrenItem(url, filepath, savepath){
    this.url = url;
    this.filepath = filepath;
    this.savepath = savepath;
   // this.torrent  = torrent;
    events.EventEmitter.call(this);
}

inherits(torrenItem, events.EventEmitter);

torrenItem.prototype.getFilename = function(){
     return  this.filepath?this.filepath.split("\\").pop():this.torrent.files[0].path.split("\\")[0]
}
torrenItem.prototype.getPlayUrl = function(){
    var self = this;
    var index = -1;

    for(var i in  this.torrent.files){

        if (/\.(mp4|mkv|webm)$/i.test(this.torrent.files[i].name)) {
            return "http://127.0.0.1:" + torrentServerPort + "/" + self.getInfoHash() + "/" + i;
        }
    }
    return false;
}
torrenItem.prototype.getTotalBytes = function(){
    return  this.torrent.length;
}
torrenItem.prototype.getUrl = function(){
    return  this.url?this.url:this.filepath;
}
torrenItem.prototype.getMimeType = function(){
    return  'bt';
}
torrenItem.prototype.getReceivedBytes = function(){
    return this.torrent.downloaded;
}
torrenItem.prototype.getInfoHash = function(){
    return this.torrent.infoHash;
}

module.exports = {
    /**
     * 添加下载任务
     * @param url
     * @param filepath    torrent文件路径
     * @param savepath
     */
    torrentAdd:function(url, filepath, savepath, callback){
        console.log("torrent add")
        console.log(url);
        console.log(filepath);

        var torrenItemCallback = new torrenItem(url, filepath, savepath);
        if(filepath){
            torrentClient.add(filepath, function (torrent) {
                torrentEvent(torrent, torrenItemCallback)
                torrenItemCallback.torrent = torrent;
                callback(torrenItemCallback);
            });

        }else if(url){
            torrentClient.add(url, function (torrent) {
                torrentEvent(torrent, torrenItemCallback)
                torrenItemCallback.torrent = torrent;
                callback(torrenItemCallback);
            });
        }else {
            return false;
        }
    }
}

function torrentEvent(torrent, torrenItemCallback){
    torrent.on('done', function () {
        torrenItemCallback.emit('done', '', 'completed');
    })
    torrent.on('download', function () {
        torrenItemCallback.emit('update');
    })
}