const {shapes, calc, SYSTEM, VISOBJECT, SIMPLECONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraverse }  = require('./../dev.js');

shapes._reset();

let control_vol = SYSTEM ({
    NAME : "control_vol",
    VISUALIZE : [
        VISOBJECT({
            REPRESENTS : "U",
            GEOMETRY : shapes.point,
            POSITION : ["x", "y"],
            minval : 200,
            maxval : 220,
        })
    ],
    U : 200,
    x : 0,
    y: 0,
    dx : 1,
    dy : 1,
    del : 0.1,
    dUx : 1,
    dUy : 1,
    dUxy : 0,
    d2Ux : 0,
    d2Uy : 0,
    REQUIRE : ["U", "dUx", "dUy", "dUxy", "d2Ux", "d2Uy", "x", "y"],
    accumulables : ["U"],
    PROCESSES : [
        (async function (S){with (S){
            dUx = dUx + del * d2Ux + del * dUxy
            dUy = dUy + del * dUxy + del * d2Uy
            U = U + del * dUx + del * dUy
            d2Ux = - d2Uy
            d2Uy = - del * del * U
        }}),
        (async function (S){with (S){
            x = x + dx;
            y = y + dy;
        }})
    ],
});

let Sparent = SYSTEM();

let main = () => {
    let N = 2;
    let M = 2;
    SIMPLECONNECT (Sparent) (MESH(control_vol, N, M, xflow = ["x"], yflow = ["y"]));
}

module.exports = {
    Sparent,
    main,
}
