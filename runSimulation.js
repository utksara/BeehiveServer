
const fs = require("fs");
const util = require("util");
const exec = require('child_process').exec;
const {reset} = require('./dev.js')
const {loggerCreator} = require('./loggerConfig.js')

const {CONNECTIONS}  = require('./dev.js');
const simulation_file_name = require('./config.json').simulation;
// const simple_mesh  = require('./simulations/simple_mesh.js')
// const second_order_ode  = require('./simulations/second_order_ode.js')
// const second_order_ode_advanced  = require('./simulations/second_order_ode_advanced.js')
// const simple_chain  = require('./simulations/simple_chain.js')
const simple_laplace  = require('./simulations/simple_laplace.js')
// const cellmech = require('./simulations/cellmech.js')
// const basic_curve = require(`./simulations/basic_curve.js`);
// const plug_flow_reactor = require('./simulations/plug_flow_reactor.js')

// const simulation_to_run = require(`./simulations/${simulation_file_name}`);
const simulation_to_run = simple_laplace;

const message_prefix = "server data exchange : " 
const logger = loggerCreator(message_prefix)

const update_simulation  = async function () {
    let array_of_items = await CONNECTIONS( simulation_to_run.main, simulation_to_run.Sparent)
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
