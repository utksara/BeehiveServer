const {shapes, calc, SYSTEM, CONNECT, CHAIN, SHELF, MESH, CONNECTIONS, copySystem, bfsTraverse }  = require('./dev.js');
// const simple_mesh  = require('./simulations/simple_mesh.js')
// const second_order_ode  = require('./simulations/second_order_ode.js')
// const second_order_ode_advanced  = require('./simulations/second_order_ode_advanced.js')
// const simple_chain  = require('./simulations/simple_chain.js')
// const simple_laplace  = require('./simulations/simple_laplace.js')
const cellmech = require('./simulations/cellmech.js')

shapes._reset();

const sys = cellmech;
module.exports.run = CONNECTIONS( sys.main, sys.Sparent);

