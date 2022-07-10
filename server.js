
const req = require("express/lib/request");
const fs = require("fs");
const util = require("util");
const exec = require('child_process').exec;
const {reset, createlog} = require('./dev.js')
const {loggerCreator} = require('./loggerConfig.js')

/**
 * Uncomment this for test mode
 */
// const {run_simulation} = require('./runSimulationTest.js')

const exec_promise =  util.promisify(exec);

/**
 * For secure mode 
 */
// var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
// var certificate = fs.readFileSync('certs/cert.pem', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

const message_prefix = "server data exchange : " 
const logger = loggerCreator(message_prefix)

let startup_windows = function () {
    child = exec(`py ./scripts/startup.py`,
    function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log(stderr);
        console.log(stdout);
    });
}

let startup_linux = function () {
    child = exec(`python3 ./scripts/startup.py`,
    function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log(stderr);
        console.log(stdout);
    });
}

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    port: 8082
});

const startup_scripts = () => {
    if (process.platform.includes("win")){
        startup_windows();        
    }
    if (process.platform.includes("linux")){
        startup_linux();        
    }
}

startup_scripts();

const run_simulation_async = async () => {
    // await run_simulation();
    // await exec_promise(`node ${process.cwd()}/runSimulation.js`, (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(`exec error: ${error}`);
    //       return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);
    //   });
    await exec_promise(`node ${process.cwd()}/runSimulation.js`);
}

const send_data = async (json_obj, ws, key_string) => {
    const data_to_be_sent = {};
    data_to_be_sent[`${key_string}`] = json_obj
    const message = "Sending data to cleint : " + JSON.stringify(data_to_be_sent);
    createlog(logger, "Sending data to cleint", "info");
    // console.log("Sending data to cleint : ", data_to_be_sent[`${key_string}`].length);
    ws.send(JSON.stringify(data_to_be_sent));
    console.log("Sending data to client")
};

const update_simulation  = async function (websocket) {
    createlog(logger, "updated simulation", "info");
    console.log("updating");

    reset();
    try { 
        await run_simulation_async();          
        let array_of_items = JSON.parse(fs.readFileSync('inputoutput/output_data.json', 'utf8'));
        console.log("pusheen vis array length", array_of_items.length);
        await send_data(array_of_items, websocket, "vis") 
    } catch (error) {
        console.log(error);   
        const error_message = "There are errors in the code"
        await send_data(error_message, websocket, "err")
    }
}

const update_text_area = async function(websocket, data) {
    var fileName = data.simulation_request;
    let array_of_items = JSON.parse(fs.readFileSync(`simulations/${fileName}.js`, 'utf8'));
    await send_data(array_of_items, websocket, "text_area")
}

const execute_data_cell_processing = async (websocket)=>{
    child = exec(`./cpp_bins/main`,
    function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        console.log(stdout);
        try {
            const output_data = JSON.parse(fs.readFileSync('inputoutput/output_data.json', 'utf8'));
            websocket.send(output_data.data);
            } catch (err) {
            console.error(err)
        };
    });
}

const initiate_simulation = async (websocket) => {
    await update_simulation(websocket);
    console.log("New client connected");
    websocket.on("close", () => {
        console.log("Client has disconnected");
    });
}

const register_data = data => {
    var msg = data.vis;    
    fs.writeFileSync('inputoutput/input_data.json', msg, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

const accept_simulation_from_client = async data => {
    var msg = data.simulation_data;    
    fs.writeFileSync('simulations/livebeehive.js', msg, (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

const accept_simulation_request = async data => {
    var fileName = data.simulation_request;  
    fs.copyFile(`simulations/${fileName}.js`, 'simulations/livebeehive.js',(err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

wss.on("connection" , async ws => {
    initiate_simulation(ws);
    ws.onmessage =(async blobdata => {
        const data = JSON.parse(blobdata.data);
        const message = "received data from client as " + JSON.stringify(data)
        createlog(logger, message, "info");
        if ("simulation_data" in data){
            console.log("received simulation data from cleint");
            const message = "received simulation data from cleint ";
            createlog(logger, message, "info");

            await accept_simulation_from_client(data);
            await update_simulation(ws);
        }
        if ("cellmech_data" in data){
            console.log("received cell data from cleint");
            const message = "received cell data from cleint ";
            createlog(logger, message, "info");

            register_data(data);
            await execute_data_cell_processing(ws);
        }
        if ("simulation_request" in data){

            console.log("received simulation request from cleint");
            const message = "received simulation request from cleint ";
            createlog(logger, message, "info");

            await accept_simulation_request(data);
            await update_simulation(ws);
            await update_text_area(ws, data);

        }
    });
});
