const {shapes, calc, SYSTEM, SIMPLECONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse }  = require('./../dev.js');

shapes._reset();

let control_vol = SYSTEM ({
    NAME : "control_vol",
    VISUALIZE : [
        {
            REPRESENTS : "U",
            GEOMETRY : shapes.point,
            minval : 200,
            maxval : 220,
        }
    ],
    U : 200,
    del : 0.1,
    dUx : 1,
    dUy : 1,
    dUxy : 0,
    d2Ux : 0,
    d2Uy : 0,
    REQUIRE : ["U", "dUx", "dUy", "dUxy", "d2Ux", "d2Uy"],    
    PROCESSES : [
        (async function (S){with (S){
            dUx = dUx + del * d2Ux + del * dUxy
            dUy = dUy + del * dUxy + del * d2Uy
            U = U + del * dUx + del * dUy
            d2Ux = - d2Uy
            d2Uy = - del * del * U
            console.log(dUy)
        }})
    ],
});

let Sparent = SYSTEM();

let main = () => {
    let N = 10;
    let M = 30;
    SIMPLECONNECT (Sparent) (MESH(control_vol, N, M));
}

module.exports = {
    Sparent,
    main,
}
