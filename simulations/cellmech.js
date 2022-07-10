const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, SIMPLECONNECT, BICONNECT, CONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const N = 30, M  = 30;
const DR = 1;
const DTheta = 2 * 3.14/(M); 

const Cellboundary = [100, 105, 110, 111, 110, 105, 100, 95, 90, 90, 95, 101, 100, 105, 110, 111, 110, 105, 100, 95, 90, 90, 95, 101, ];

let Sparent = SYSTEM({
    cellboundary : Cellboundary,
    VISUALIZE : [
        {
            GEOMETRY : shapes.curve,
            POSITION : [650,350],
            MOVEMENT : "cellboundary",
        },
    ]
});


let main = () => {
}


module.exports = {
    Sparent,
    main,
}
