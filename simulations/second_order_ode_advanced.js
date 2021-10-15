const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, CONNECT, CONNECTADVANCED, CHAIN, SHELF, MESH, CONNECTIONS, copySystem, bfsTraverse, traverse }  = require('../dev.js');

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
    PROCESS : [
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
    PROCESS : [
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
            TOPOLOGY : shapes.line,
            maxval : 200,
            minval : -200,
        }
    ],
    PROCESS : [
        p1
    ],
});

let main = () => {
    //-----Example 1-----------
    let N = 100;

    CONNECTADVANCED (S1) ("P0") (S2)
    CONNECTADVANCED (S1) ("P_1") (S3)
    CONNECTADVANCED (S2) ("P0") (S3)
    CONNECT (Sparent) (PATTERN(S1, {'S1' : 'S2', 'S2' : 'S3'}, N))
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.ID)
    //     // console.log(arg.VISUALIZE[0])
    //     // console.log("------")
    // })
}


module.exports = {
    Sparent,
    main,
}
