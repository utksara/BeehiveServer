const {shapes, calc, SYSTEM, SIMPLECONNECT, CONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse }  = require('./../dev.js');

shapes._reset();

let control_vol = SYSTEM ({
    NAME : "control_vol",
    VISUALIZE : [
        {
            REPRESENTS : "divP",
            GEOMETRY : shapes.point,
            maxval : 400,
            minval : 0
        }
    ],
    Px : 200,
    Py : 100,
    dx : 0.1,
    dy : 0.1,
    divP : 0,
    REQUIRE : ["Px", "Py"],    
    PROCESS : [
        (async function (S){with (S){
            dPx = 0.08 * (Px + Py);
            dPy = 0.1 * (Px + Py);
            Px = Px - dPx;
            Py = Py - dPy;
            divP = dPx/dx + dPy/dy;
        }})
    ],
});

let Sparent = SYSTEM();

let main = () => {
    let N = 15;

    SIMPLECONNECT (Sparent) (MESH(control_vol, N, N, xflow = ["Px"], yflow = ["Py"]));
    bfsTraverse(Sparent, arg =>{
        console.log(arg.ID)
    })
}


module.exports = {
    Sparent,
    main,
}
