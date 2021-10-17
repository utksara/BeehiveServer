const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, SIMPLECONNECT, BICONNECT, CONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const Omega = 10; 
const Dx = 0.01;

let Sparent = SYSTEM();

let calculate_traction = (async function (S){with (S){
    T = T - omega*dx*T
}})

let increment_cellboundary = (async function (S){with (S){
    
    R = R + 10;
    new_cell_boundary = [];

    for (i = 0 ; i<cellboundary.length ; i++){
        new_cell_boundary.push(cellboundary[i] * R * 0.01)
    }

    cellboundary = new_cell_boundary
}})

let S1 = SYSTEM ({
    NAME : "S1",
    T : 200,
    R : 50, 
    dx : Dx,
    omega : 10,
    center: [600, 350],
    cellboundary : [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,], 
    REQUIRE : ["T", "R",],    
    VISUALIZE :[
        {
            REPRESENTS : "T",
            GEOMETRY : shapes.curve,
            POSITION : [650,350],
            MOVEMENT : "cellboundary",
            maxval : 200,
            minval : -200,
        }
    ],
    PROCESS : [
        calculate_traction, 
        increment_cellboundary,
    ],
});

let main = () => {
    //-----Example 1-----------
    let N = 10; 
    SIMPLECONNECT (Sparent) (CHAIN(S1, N))
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.cellshape)
    // })
}


module.exports = {
    Sparent,
    main,
}
