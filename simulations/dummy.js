const {shapes, calc, SYSTEM, SIMPLECONNECT, CHAIN, STACK, MESH, CONNECTIONS, COPY, bfsTraverse }  = require('./../dev.js');

shapes._reset();


let Sparent = SYSTEM();

let S1 = SYSTEM ({
    NAME : "S1",
    VISUALIZE : [
        {
            REPRESENTS : "Pressure",
            GEOMETRY : shapes.line
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
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.VISUALIZE[0])
    // })
}


module.exports = {
    Sparent,
    main,
}
