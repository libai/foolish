var app  = require('app')
var BrowserWindow = require('browser-window')
//var DownloadManage = require('./app/downloadManage')()
var download = require('./app/downloadManage')

var path = require('path');


var mainWindow = null

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

app.on('ready', function () {
    var protocol = require('protocol');
    protocol.registerFileProtocol('foolish', function(request, callback) {
        console.log(request)
        var url = request.url.substr(10);
        callback({path: path.normalize(__dirname + '/' + url)});
    }, function (error) {
        if (error)
            console.error('Failed to register protocol')
    });



    mainWindow = new BrowserWindow({ width: 1030, height: 720,
        //frame:false,
        show: false, center: true })
    //mainWindow.openDevTools();
    mainWindow.loadUrl('file://' + require('path').join(__dirname, 'ui.html'))
    var webContents = mainWindow.webContents;

    webContents.on("dom-ready", function() {

        mainWindow.show()
    })

    webContents.session.on('will-download', function(event, item, webContents) {
        //委托给downloadmanage管理
        console.log("direct delegate");

        download.delegate(event, item, webContents)
    });

    /*
     webContents.on("did-fail-load", function() {

     mainWindow.show()
     })*/

    mainWindow.on('closed', function() {
        mainWindow = null
    })
})
