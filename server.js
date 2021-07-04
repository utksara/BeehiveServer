
const https = require('https');
const fs = require("fs");

var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
var certificate = fs.readFileSync('certs/cert.pem', 'utf8');

var express = require('express');
var app = express();
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(8082);

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    port: 8082,
    server: httpsServer
  });


var exec = require('child_process').exec, child;
child = exec(`make`,
function (error, stdout, stderr) {
    if (error !== null) {
        console.log('exec error: ' + error);
    }
    console.log(stdout);
});

wss.on("connection" , ws => {
    console.log("New client connected");
     
    ws.on("close", () => {
        console.log("Client has disconnected");
    });

    ws.onmessage =( e => {

        var msg = e.data;
        
        fs.writeFile('input_data.json', msg, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
            
        child = exec(`./main`,
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log(stdout);
            try {
                const output_data = JSON.parse(fs.readFileSync('output_data.json', 'utf8'));
                ws.send(output_data.data);
              } catch (err) {
                console.error(err)
            };
        });
        // child(); 
    });
});
