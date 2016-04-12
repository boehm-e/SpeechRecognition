'use strict';
var ArrayBuffers = require("array-buffers");

var WebSocketServer = require('ws').Server,
    server =  new WebSocketServer({port: 8080});

server.on('connection', function (wss) {
    var asr;
    console.log("CONNECTED");
    wss.send("SALUT TOI");
    wss.on('message', function (data) {
//	console.log("message : "+data);
        if (typeof data === 'string' && data.indexOf('start') !== -1) {
	    console.log("=================================================");
	    console.log("=================================================");
	    console.log("=================================================");
	    console.log("=================================================");

            var params = data.split(' ');
            asr = require('./asr/google/');
            asr.on('data', function (data) {
		console.log(JSON.stringify(data));
                wss.send(JSON.stringify(data));
            });
            asr.on('error', function (error) {
                console.log(error);
            });
            asr.setLanguage(params[2]);
            asr.setContentType(params[3]);
            asr.initialize();
            asr.authorization();
        } else {
//	    console.log(data);
	    asr.stream(data);
        }
    });

    wss.on('data', function(data) {
	console.log("DATA : "+data);
    });
    wss.on('close', function () {
        if (asr)
            asr.removeAllListeners();
    });
});


function char2BigEndian16(hiChar, lowChar){
    console.log(hiChar + " | " + lowChar);
    return  ((lowChar.charCodeAt(0)& 0x00FF) << 8) | (hiChar.charCodeAt(0) & 0xFF);
}

