const { CONNECT } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, VISOBJECT, SIMPLECONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraverse }  = require('./../dev.js');


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
    U : 10,
    x : 0,
    y: 0,
    y_1:0,
    y1:0,
    dx : 1,
    dy : 1,
    REQUIRE : ["x", "y"],
    PROCESSES : [
        (async function (S){with (S){
            x = x + dx;
        }})
    ],
});

let Sparent = SYSTEM();

let main = () => {
    let N = 3;

    let cv = COPY(control_vol)
    let cv_1 = COPY(control_vol)
    let cv1 = COPY(control_vol)
    CONNECT (cv_1, cv).apply ("x", "y") (cv1)
    CONNECT (cv1, cv_1).apply ("x", "y") (cv)
    SIMPLECONNECT (Sparent) (CHAIN(cv, N, ["x", "y"]));
}

module.exports = {
    Sparent,
    main,
}
