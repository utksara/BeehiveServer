const {shapes, CONNECTIONS, reset}  = require('./dev.js');
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

reset();
const system = simple_laplace;
module.exports.run = CONNECTIONS( system.main, system.Sparent);