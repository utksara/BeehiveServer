module.exports.calc =require('./lib/calc.js');
const {SYSTEM, CONNECTIONS, CONNECT, BICONNECT, CHAIN, SHELF, MESH, CONNECTADVANCED, copySystem, PATTERN} = require('./lib/beehive.js');
const {bfsTraverse} = require('./lib/beehiveUtils.js')
module.exports.SYSTEM = SYSTEM;
module.exports.CONNECTIONS = CONNECTIONS;
module.exports.CHAIN = CHAIN;
module.exports.SHELF = SHELF;
module.exports.MESH = MESH;
module.exports.CONNECT = CONNECT;
module.exports.BICONNECT = BICONNECT;
module.exports.copySystem = copySystem;
module.exports.PATTERN = PATTERN;
module.exports.bfsTraverse = bfsTraverse;
module.exports.CONNECTADVANCED = CONNECTADVANCED;

module.exports.shapes = require('./lib/shapes.js');
const {_reset} = require('./lib/shapes.js');
module.exports.reset = ()=>{
    _reset();
}