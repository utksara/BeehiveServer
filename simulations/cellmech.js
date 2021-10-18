const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, SIMPLECONNECT, BICONNECT, CONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const N = 3, M  = 30;
const DR = 10;
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

let calculate_traction = (async function (S){with (S){
    position = [50 + center[0] + r * Math.cos(theta), center[1] + r * Math.sin(theta)]
    theta = theta + dtheta;
    r = r + dr
    T = T - (Kr * T * dr * 0.001 + Ktheta * T * dtheta * 0.001);
    trace.push(r)
}})

let S1 = SYSTEM ({
    NAME : "S1",
    T : 200,
    Kr : 1,
    Ktheta : 0.1,
    r : 100,
    dr : DR,
    dtheta : DTheta,
    theta : 0,
    R : 100,
    omega : 10,
    center: [600, 350],
    position : [100,100],
    trace :[], 
    REQUIRE : ["theta", "r", "T", "trace"],   
    VISUALIZE :[
        {
            REPRESENTS : "T",
            GEOMETRY : shapes.point,
            POSITION : "position",
        },
    ], 
    PROCESS : [
        calculate_traction,
    ],
});

let Sboundary = SYSTEM({
    NAME : "boundary",
    trace : [],
    T : 0,
    trace :[],
    REQUIRE : ["trace"],
    VISUALIZE :[
        {
            GEOMETRY : shapes.curve,
            POSITION : [650,350],
            MOVEMENT : "trace",
            LIGHT : true,
        },
    ],
});

let main = () => {

    let angularComponent = CHAIN (S1, M, ["theta", "T", "trace"]) ;
    CONNECT(angularComponent)("trace")(Sboundary);
    SIMPLECONNECT (Sparent) (STACK (angularComponent, N, ["r", "T"]))
    
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.ID, "-->", arg.TO)
    // })
}


module.exports = {
    Sparent,
    main,
}
