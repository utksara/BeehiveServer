const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, SIMPLECONNECT, CONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const Omega = 100; 
const Dx = 0.01;
let Sparent = SYSTEM();

let p1 = (async function (S){with (S){
    P1 = -P_1 + 2*P0 + dx*dx * omega *(-P0)
    P_1 = P1
    P0 = P1
}})

let S1 = SYSTEM ({
    NAME : "S1",
    P1 : 200,
    P_1 : 200,
    P0 : 200, 
    dx : Dx,
    omega : Omega,
    REQUIRE : ["P_1","P0"],    
    PROCESSES : [
        p1
    ],
});

let S2 = SYSTEM ({
    NAME : "S2",
    P1 : 200,
    P_1 : 200,
    P0 : 200, 
    dx : Dx,
    omega : Omega,
    REQUIRE : ["P_1","P0"],    
    PROCESSES : [
        p1
    ],
});

let S3 = SYSTEM ({
    NAME : "S3",
    P1 : 200,
    P_1 : 200,
    P0 : 200, 
    dx : Dx,
    omega : Omega,
    REQUIRE : ["P_1","P0"],    
    VISUALIZE :[
        {
            REPRESENTS : "P1",
            GEOMETRY : shapes.line,
            maxval : 200,
            minval : -200,
        }
    ],
    PROCESSES : [
        p1
    ],
});

let main = () => {
    //-----Example 1-----------
    let N = 100;

    CONNECT (S1) ("P0") (S2)
    CONNECT (S1) ("P_1") (S3)
    CONNECT (S2) ("P0") (S3)
    SIMPLECONNECT (Sparent) (PATTERN(S1, {'S1' : 'S2', 'S2' : 'S3'}, N))

}


module.exports = {
    Sparent,
    main,
}
