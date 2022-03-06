module.exports.calc =require('./lib/calc.js');
const {SYSTEM, RUNSIMULATION, SIMPLECONNECT, BICONNECT, CHAIN, STACK, MESH, CONNECT, COPY, PATTERN, PROCESS} = require('./lib/beehive.js');
const {bfsTraverse} = require('./lib/beehiveUtils.js')

module.exports.SYSTEM = SYSTEM;
module.exports.RUNSIMULATION = RUNSIMULATION;
module.exports.CHAIN = CHAIN;
module.exports.STACK = STACK;
module.exports.MESH = MESH;
module.exports.SIMPLECONNECT = SIMPLECONNECT;
module.exports.BICONNECT = BICONNECT;
module.exports.COPY = COPY;
module.exports.PATTERN = PATTERN;
module.exports.bfsTraverse = bfsTraverse;
module.exports.CONNECT = CONNECT;
module.exports.PROCESS = PROCESS;

module.exports.shapes = require('./lib/shapes.js');
const {_reset} = require('./lib/shapes.js');
module.exports.reset = ()=>{
    _reset();
}