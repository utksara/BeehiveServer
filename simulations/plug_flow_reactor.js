const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, SIMPLECONNECT, BICONNECT, CONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const DR = 1;
const Dx = 1; 
const DiffusionConstant = -10;


let Sparent = SYSTEM();

let calculate_concentration = (async function (S){with (S){
    C = 0.5*(Cx + Cr)
    Q = r*x
    r = r + dr
    x = x + dx
    delCx = C - Cx
    delCr = C - Cr
    Jx = -D * delCx
    Jr = -D * delCr
    C = C - Jx * dx * 2 * Pi * r - Jr * dr * 2 * Pi * r 
    Cx = C
    Cr = C
}})

let calculate_positon = (async function (S){with (S){
    position1 = [center[0] + x, center[1] + r]
    position2 = [center[0] + x, center[1] - r]
}})

let S1 = SYSTEM ({
    NAME : "S1",
    T : 200,
    Pi : 3.14,
    Ktheta : 0.1,
    D : DiffusionConstant,
    r : 0,
    x : 0,
    Q : 0,
    dr : DR,
    dx : Dx,
    C : 100,
    Cr : 100, 
    Cx : 100,
    center : [100, 350],
    position1 : [0,0],
    position2 : [0,0],
    REQUIRE : ["r", "x", "Cr", "Cx"],   
    VISUALIZE :[
        {
            REPRESENTS : "Q",
            GEOMETRY : shapes.point,
            POSITION : "position2",
        },
        {
            REPRESENTS : "Q",
            GEOMETRY : shapes.point,
            POSITION : "position1",
        },
        {
            REPRESENTS : "Q",
            GEOMETRY : shapes.point,
            POSITION : "position1",
        },
    ], 
    PROCESS : [
        calculate_concentration,
        calculate_positon,
    ],
});

let main = () => {

    let M = 2, N = 2;

    SIMPLECONNECT (Sparent) (MESH(S1, M, N, ["Cx", "x"], ["Cr", "r"]))
    
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.ID, "-->", arg.TO)
    // })
}


module.exports = {
    Sparent,
    main,
}
