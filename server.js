
const fs = require("fs");
const exec = require('child_process').exec;
var {run} = require('./systemdef.js')
var {reset} = require('./dev.js')
var {colorMap} = require('./lib/calc.js')
// var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
// var certificate = fs.readFileSync('certs/cert.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    port: 8082
});


let visualize = async (jsonobj, ws) => {
    // array_of_items.forEach(elementouter => {
    //     elementouter.VISUALIZE.forEach(element => {
    //         (async ()=>{
    //             element._param = element._param?element._param:{};
    //             return await element.TOPOLOGY(element._param).generate()
    //         })().then(value => {
    //             jsonobj = {
    //                     "id" : "shape" + elementouter.ID,
    //                     "svg" : value,
    //                     "fill" : element.color? element.color:'none',
    //                     "stroke" : colorMap(elementouter[element.REPRESENTS])==='none' ? "blue" : colorMap(elementouter[element.REPRESENTS]),
    //                     "width" : 1
    //                 }
    //                 ws.send(JSON.stringify(jsonobj));
    //             });
    //         });
    //     });
    ws.send(JSON.stringify(jsonobj))
};

let update  = function (ws) {
    reset();
    console.log("updating");
    let jsonobj = {};
    (async ()=>{
        let array_of_items = await run
        return array_of_items;
    })().then(async array_of_items => {
        visualize (array_of_items, ws)
    })
}

wss.on("connection" , ws => {
    update(ws);
    console.log("New client connected");
    ws.on("close", () => {
        console.log("Client has disconnected");
    });

    ws.onmessage =( e => {
        var msg = e.datavisualize;        
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
    });
});
