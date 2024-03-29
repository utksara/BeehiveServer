const { stringify } = require("mocha/lib/utils");
const {shapes, calc, SYSTEM, SIMPLECONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraverse }  = require('./dev.js');


const _core_params = [
    "ID",
    "VISUALIZE",
    "REQUIRE",
    "PROCESSES",
    "TO",
]

const _optional_params = [
    "NAME",
    "endpoints",
]

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
        }})
    ],
});


Data = {
    "INITIAL_VALUES" : []
}

let add_object = (S) => {
    for (element in S) {
        if (! _core_params.includes(element) && ! _optional_params.includes(element) ){
            let new_obj = {}
            new_obj[element] = S[element]
            Data["INITIAL_VALUES"].push(new_obj)
        }
    }
}
