const {shapes, calc, SYSTEM, SIMPLECONNECT, CHAIN, STACK, MESH, RUNSIMULATION, COPY, bfsTraverse }  = require('./../dev.js');

shapes._reset();


let Sparent = SYSTEM();

let substrate = FIELD({
    unit: "mm",
    X: [-100, 100],
    Y: [-100, 200],
})

let traction = SYSTEM({
    NAME : "traction",
    CONST : ["dx", "dy"],
    VARS : ["Tx", "Ty", "x", "y"],
    PROCESSES: [
        "Tx = 0.6*Tx[-1] + 0.1*Tx[-2]",
        "Tx[-1] = 0.5*(Tx - Tx[-2])/dx",
    ]
})

let cell_boundary = SYSTEM({
   NAME : "cell boundary",
   N_r : 4,
   boundary : CHAIN(cell_element, N_3)
})

let cell = SYSTEM({
    NAME : "S2",
    sub_system : cell_boundary(),
    VISUALIZE : [
        {
            REPRESENTS : cell_boundary,
            GEOMETRY : shapes.curve,
        }   
    ]
})

let substrate = SYSTEM({

})

let S1 = SYSTEM ({
    NAME : "S1",
    VISUALIZE : [
        {
            REPRESENTS : "Pressure",
            GEOMETRY : shapes.line, 
        }
    ],
    Pressure : 200,
    REQUIRE : ["Pressure"],    
    PROCESSES : [
        (async function (S){with (S){
            Pressure = 0.95 * Pressure
        }})
    ],
});

let main = () => {
    //-----Example 1-----------
        
    let N = 50;
    let PressureGen =(N)=> {
        Pressurearray = []
        for (let n = 0; n<N; n++){
            Pressurearray.push(200 - 8*n);
        }
        return Pressurearray;
    }
    SIMPLECONNECT (Sparent) (CHAIN (S1, N));
    
}


module.exports = {
    Sparent,
    main,
}
