
const fs = require("fs");
const util = require("util");
const exec = require('child_process').exec;
const {reset} = require('./dev.js')
const {loggerCreator} = require('./loggerConfig.js')

// var privateKey  = fs.readFileSync('certs/key.pem', 'utf8');
// var certificate = fs.readFileSync('certs/cert.pem', 'utf8');

const message_prefix = "server data exchange : " 
const logger = loggerCreator(message_prefix)

const {shapes, RUNSIMULATION}  = require('./dev.js');
const simulation_file_name = require('./config.json').simulation;

// const simple_mesh  = require('./simulations/simple_mesh.js')
const second_order_ode  = require('./simulations/second_order_ode.js')
// const second_order_ode_advanced  = require('./simulations/second_order_ode_advanced.js')
// const simple_chain  = require('./simulations/simple_chain.js')
// const simple_laplace  = require('./simulations/simple_laplace.js')
// const cellmech = require('./simulations/cellmech.js')
// const basic_curve = require(`./simulations/basic_curve.js`);
// const plug_flow_reactor = require('./simulations/plug_flow_reactor.js')
// const online_simulation = require(`./simulations/${simulation_file_name}`);
const simulation_to_run = second_order_ode;
// const simulation_to_run = online_simulation;

const run_simulation  = async () => {
    let svg_data  = await RUNSIMULATION( simulation_to_run);

    fs.writeFileSync('inputoutput/output_data.json', JSON.stringify(svg_data), (err) => {
        if (err) throw err;
    })
    console.log("Simulation run complete");
}


(async ()=>{
    await run_simulation();
})();

module.exports = {
    run_simulation
}