const { run_system, hierarchical } = require('../lib/beehive.js');
const { DISABLEFLOW, ENABLEFLOW, DISABLEPROCESS } = require('../lib/beehiveUtils.js');
const {sys_by_id} = require('../lib/core/globalParameters.js')

const {condition, shapes, calc, SYSTEM, VISOBJECT, SIMPLECONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraversem, DOWHERE }  = require('./../dev.js');
var process = require('process');
const { without } = require('lodash');

shapes._reset();

let coordinates = (async function (S){with (S){
    x = x + dx;
    y = y + dy;
    X = 2 * x;
    Y = 2 * y;
}})

let control_vol = SYSTEM ({
    NAME : "control_vol",
    VISUALIZE : [

        VISOBJECT({
            REPRESENTS : "U",
            POSITION : ["x", "y"],
        }),

        VISOBJECT({
            REPRESENTS : condition("U >= 120 &&  U <=130"),
            POSITION : ["x", "y"],
        }),
    ],
    U : 200,
    X : 0,
    Y : 0,
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
    REQUIRE : ["U", "dUx", "dUy", "dUxy", "d2Ux", "d2Uy", "x", "y",],
    accumulables : ["U"],
    PROCESSES : [
        (async function (S){with (S){
            dUx = dUx + x*(del * d2Ux + del * dUxy)
            dUy = dUy + y*(del * dUxy + del * d2Uy)
            U = U + del * dUx + del * dUy
            d2Ux = - d2Uy
            d2Uy = - del * del * U
        }}),
        // (async function (S){with (S){
        //     x = x + dx;
        //     y = y + dy;
        //     X = 2 * x;
        //     Y = 2 * y;
        // }}),
        coordinates,
    ],
});

let Sparent = SYSTEM({NAME:"Parent"});

let main = async () => {
    let N = 40;
    let M = 40;
    let mesh = (MESH(control_vol, N, M, 
                                xflow = ["x", "dUy", "d2Uy", "dUx", "d2Ux", "dUxy", "U",], 
                                yflow = ["y", "dUy", "d2Uy", "dUx", "d2Ux", "dUxy", "U",]));

    SIMPLECONNECT (Sparent) (mesh)

    // await run_system(Sparent.ID, hierarchical)

    // Object.keys(sys_by_id).forEach(element => {
    //     console.log(element, sys_by_id[element].x)
    // });
    // console.log('\n')

    // DISABLEFLOW(Sparent, ["x", "y"], ["parent.x < child.x"]);
    // DISABLEPROCESS(Sparent, [coordinates]);

    // await run_system(Sparent.ID, hierarchical)

    // Object.keys(sys_by_id).forEach(element => {
    //     console.log(element, sys_by_id[element].x)
    // });
    // console.log("\n");
}

module.exports = {
    Sparent,
    main,
}
// main()