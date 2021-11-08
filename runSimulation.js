
const fs = require("fs");
const util = require("util");
const exec = require('child_process').exec;
const {run} = require('./systemdef.js')
const {reset} = require('./dev.js')
const {loggerCreator} = require('./loggerConfig.js')

const exec_promise =  util.promisify(exec);
// var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
// var certificate = fs.readFileSync('certs/cert.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
const message_prefix = "server data exchange : " 
const logger = loggerCreator(message_prefix)

const update_simulation  = async function () {
    reset();
    let array_of_items = await run
}

const initiate_simulation = async () => {
    await update_simulation();
    console.log("New client connected");
}

// const register_data = data => {
//     var msg = data.vis;    
//     fs.writeFileSync('inputoutput/input_data.json', msg, (err) => {
//         if (err) throw err;
//         console.log('Data written to file');
//     });
// }

// const accept_simulation_from_client = data => {
//     var msg = data.simulation_data;    
//     fs.writeFileSync('simulations/livebeehive.js', msg, (err) => {
//         if (err) throw err;
//         console.log('Data written to file');
//     });
// }
(async ()=>{
    await initiate_simulation();
})();
