const { PATTERN, DebugAny } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, PROCESS, SIMPLECONNECT, BICONNECT, CONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse, traverse }  = require('../dev.js');

shapes._reset();

const DR = 0.01;
const Dz = 0.01; 
const DiffusionConstant = 0.1;
const RateConstant = 0.03;
const InitConc = 0.1;


let Sparent = SYSTEM({
    Cz : InitConc,
    Cr : InitConc,
});

x = ()=>{
    x = x +1
    t = t -2
}

let calculate_concentration = (async function (S){with (S){
    r = r + dr
    z = z + dz
    reaction_rate = k * Cz
    // console.log((reaction_rate - D * del2Cz - D * del2Cr - U * D * delCr / r)*dz/U)
    // C = Cz + (-reaction_rate - D * del2Cz - D * del2Cr - D * delCr / r)*dz/U
    C = Cz + (-reaction_rate - D * Cr)*dz/U
    
    // console.log("reaction_rate ", reaction_rate)
    // console.log("D * del2Cz ", D * del2Cz)
    // console.log("D * del2Cr ", D * del2Cr)
    // console.log("D * delCr / r ",D * delCr / r)
    // delCr_new = (C - Cr)/dr
    console.log(Cr)
    // del2Cr = (delCr_new - delCr)/dr

    // delCz_new = (C - Cz)/dz
    // del2Cz = (delCz_new - delCz)/dz

    // delCz = delCz_new
    // delCr = delCr_new

    Cr = C
    Cz = C
}})

let calculate_positon = (async function (S){with (S){
    position1 = [center[0] + z*100, center[1] + r*100 - 1]
    position2 = [center[0] + z*100, center[1] - r*100]
}})

let S1 = SYSTEM ({
    NAME : "S1",
    D : DiffusionConstant,
    r : 0,
    z : 0,
    k: RateConstant,
    dr : DR,
    dz : Dz,
    C : InitConc,
    Cr : InitConc, 
    Cz : 0,
    U : 0.01,
    del2Cr : 0,
    del2Cz : 0,
    delCr : 0,
    delCz : -0.01,
    center : [100, 350],
    position1 : [0,0],
    position2 : [0,0],
    REQUIRE : ["Cz", "z" , "delCz", "del2Cz", "Cr", "r", "delCr", "del2Cr"],   
    VISUALIZE :[
        {
            REPRESENTS : "Cr",
            GEOMETRY : shapes.point,
            POSITION : "position2",
            maxval : InitConc,
        },
        {
            REPRESENTS : "Cr",
            GEOMETRY : shapes.point,
            POSITION : "position1",
            maxval : InitConc,
        },
    ], 
    PROCESSES : [
        calculate_concentration,
        calculate_positon,
    ],
});

let main = () => {

    let width = 20, length = 100;

    SIMPLECONNECT (Sparent)(MESH(S1, width, length, ["Cz", "z" , "delCz", "del2Cz"], ["Cr", "r", "delCr", "del2Cr"]))
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.ID, "-->", arg.REQUIRE)
    // })
}


module.exports = {
    Sparent,
    main,
}
