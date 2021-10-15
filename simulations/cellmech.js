const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, CONNECT, BICONNECT, CONNECTADVANCED, CHAIN, SHELF, MESH, CONNECTIONS, copySystem, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const Omega = 10; 
const Dx = 0.01;

let Sparent = SYSTEM();

let p1 = (async function (S){with (S){
    T = T - omega*dx*T
    console.log(T)
}})

let S1 = SYSTEM ({
    NAME : "S1",
    T : 200, 
    dx : Dx,
    omega : Omega,
    REQUIRE : ["T"],    
    VISUALIZE :[
        {
            REPRESENTS : "T",
            TOPOLOGY : shapes.point,
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
    let N = 2;
    let M = 50;

    CONNECT (S1) (copySystem(S1))
    CONNECT (S1) (copySystem(S1))
    CONNECT (Sparent) (S1)
    console.log(S1)

    // CONNECT (Sparent) (CHAIN(SHELF(S1, N),M))
    // CONNECT (Sparent) (SHELF (CHAIN(S1, M),N))
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.ID)
    // })
}


module.exports = {
    Sparent,
    main,
}
