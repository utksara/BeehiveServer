const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, SIMPLECONNECT, BICONNECT, CONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const DR = 1;
const Dx = 1; 
const DiffusionConstant = -0.1;


let Sparent = SYSTEM({
    Cx : 200,
    Cr : 200,
});

let calculate_concentration = (async function (S){with (S){
    // C = C + Jx * dx * 2 * Pi * r - Jr * dr * 2 * Pi * r
    console.log(ID, "pusheen Cr", Cr)
    console.log(ID, "pusheen Cx", Cx)
    r = r + dr
    x = x + dx
    Cr = Cr /r;
    Cx = Cx /x;
    C = Cx + Cr;
}})

let calculate_positon = (async function (S){with (S){
    position1 = [center[0] + x, center[1] + r - 1]
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
    C : 0,
    Cr : 0, 
    Cx : 0,
    center : [100, 350],
    position1 : [0,0],
    position2 : [0,0],
    REQUIRE : ["r", "x", "Cr", "Cx", "Q"],   
    VISUALIZE :[
        {
            REPRESENTS : "C",
            GEOMETRY : shapes.point,
            POSITION : "position2",
        },
        {
            REPRESENTS : "C",
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

    let M = 5, N = 2;

    SIMPLECONNECT (Sparent)(MESH(S1, M, N, ["Cx", "x" ,"Q"], ["Cr", "r","Q"]))
    CONNECT (Sparent) (CHAIN()())
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.ID, "-->", arg.REQUIRE)
    // })
}


module.exports = {
    Sparent,
    main,
}
