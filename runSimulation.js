
const fs = require("fs");
const util = require("util");
const exec = require('child_process').exec;
const {reset} = require('./dev.js')
const {loggerCreator} = require('./loggerConfig.js')
// var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
// var certificate = fs.readFileSync('certs/cert.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
const message_prefix = "server data exchange : " 
const logger = loggerCreator(message_prefix)

const {shapes, RUNSIMULATION}  = require('./dev.js');
const simulation_file_name = require('./config.json').simulation;
const livebeehive = require('./simulations/livebeehive.js');

const always = () => {return true}

const run_simulation  = async () => {
    reset();
    const system = livebeehive;
    run = RUNSIMULATION( system.main, system.Sparent);
    console.log("New client connected");
}


(async ()=>{
    await run_simulation();
})();

module.exports = {
    run_simulation
}

