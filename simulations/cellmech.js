const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, CONNECT, BICONNECT, CONNECTADVANCED, CHAIN, SHELF, MESH, CONNECTIONS, copySystem, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const Omega = 10; 
const Dx = 0.01;

let Sparent = SYSTEM();

let p1 = (async function (S){with (S){
    T = T - omega*dx*T
}})

let b2s = (async function (S){with (S){
    cellshape = shapes.array_to_movement(cellboundary)
    console.log(cellshape)
}})

let S1 = SYSTEM ({
    NAME : "S1",
    T : 200, 
    dx : Dx,
    omega : Omega,
    cellboundary : [100, 100, 140, 100, 200], 
    cellshape : "100, 100, 100, 200,",
    REQUIRE : ["T"],    
    VISUALIZE :[
        {
            REPRESENTS : "T",
            TOPOLOGY : shapes.curve,
            POSITION : [500, 350],
            MOVEMENT : "cellshape",
            maxval : 200,
            minval : -200,
        }
    ],
    PROCESS : [
        p1,
        b2s,
    ],
});

let main = () => {
    //-----Example 1-----------
    let N = 10; 
    CONNECT (Sparent) (CHAIN(S1, N))
    bfsTraverse(Sparent, arg =>{
        console.log(arg.cellshape)
    })
}


module.exports = {
    Sparent,
    main,
}
