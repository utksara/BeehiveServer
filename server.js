
const fs = require("fs");
const exec = require('child_process').exec;

var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
var certificate = fs.readFileSync('certs/cert.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    port: 8082
  });

// child = exec(`make main`,
// function (error, stdout, stderr) {
//     if (error !== null) {
//         console.log('exec error: ' + error);
//     }
//     console.log(stdout);
// });

let update  = function (ws) {

    console.log("updating");
    const {run} = require('./module_tests.js')
    let array_of_items, jsonobj;

    let ran = (async ()=>{return await run})
    ran().then(array_of_items => {
        array_of_items.forEach(element => {
            (async ()=>{ 
                return await (element.topology.generate)(element.topology)
            })().then(value => {
                jsonobj = {
                    "id" : "line" + element.ID,
                    "svg" : value,
                    "width" : element.topology.width
                }
                ws.send(JSON.stringify(jsonobj));
            }) 
        }); 
    });
}

wss.on("connection" , ws => {

    update(ws);
    
    console.log("New client connected");
     
    ws.on("close", () => {
        console.log("Client has disconnected");
    });

    ws.onmessage =( e => {

        var msg = e.data;
        
        fs.writeFile('inputoutput/input_data.json', msg, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
            
        child = exec(`./cpp_bins/main`,
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log(stdout);
            try {
                const output_data = JSON.parse(fs.readFileSync('inputoutput/output_data.json', 'utf8'));
                ws.send(output_data.data);
              } catch (err) {
                console.error(err)
            };
        });
        // child(); 
    });
});
