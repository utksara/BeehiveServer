const {shapes, calc, SYSTEM, SIMPLECONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraverse }  = require('./../dev.js');


let control_vol = SYSTEM ({
    NAME : "control_vol",
    VISUALIZE : [
        {
            REPRESENTS : "divS",
            GEOMETRY : shapes.point,
            POSITION : ["x", "y"]
        }
    ],
    view_scale : 2,
    x  : 0.1,
    y  : 0.1,
    ds : 1,
    divS : 10,
    Sx : 100,
    Sy : 100,
    D : 1,
    J : 10,
    REQUIRE : ["Sx", "Sy", "x", "y"],    
    PROCESSES : [
        (async function (S){with (S){
            dSx = 0.08 * (Sx + Sy);
            dSy = 0.1 * (Sx + Sy);
            Sx = Sx - dSx;
            Sy = Sy - dSy;
            divS = dSx/ds + dSy/ds;
        }}),
        (async function (_S){with (_S){
            x = x + ds;
            y = y + ds;
        }})
    ],
});

let Sparent = SYSTEM();

let main = () => {
    let N = 60;
    let M = 60;
    SIMPLECONNECT (Sparent) (MESH(control_vol, N, M, xflow = ["Sx","x"], yflow = [ "Sy","y"]));
}

module.exports = {
    Sparent,
    main,
}
