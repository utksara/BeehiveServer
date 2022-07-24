module.exports.calc =require('./lib/calc.js');
const {SYSTEM, RUNSIMULATION, SIMPLECONNECT, BICONNECT, CHAIN, STACK, MESH, CONNECT, COPY, PATTERN, PROCESS, CONNECTIONS} = require('./lib/beehive.js');
const {bfsTraverse, VISOBJECT, createlog} = require('./lib/beehiveUtils.js')
const beehiveUtils = require('./lib/beehiveUtils.js')
const globalParameters = require('./lib/core/globalParameters.js')
const {condition} = require('./lib/visualizationUtils.js')

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
module.exports.VISOBJECT = VISOBJECT;
module.exports.CONNECTIONS = CONNECTIONS;
module.exports.createlog = createlog;
module.exports.condition = condition;
module.exports.shapes = require('./lib/shapes.js');
module.exports.DOWHERE = beehiveUtils.DOWHERE;

const {_reset} = require('./lib/shapes.js');
;
module.exports.reset = ()=>{
    _reset();
    globalParameters.list_of_objs = [];
    globalParameters.vis_objs = [];
    globalParameters.sys_by_id = {};
    globalParameters.edge_by_id = {};
    globalParameters.execution_order = [];
    globalParameters.global_id = 0;
}