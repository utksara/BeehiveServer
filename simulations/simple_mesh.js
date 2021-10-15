const {shapes, calc, SYSTEM, CONNECT, CONNECTADVANCED, CHAIN, SHELF, MESH, CONNECTIONS, copySystem, bfsTraverse }  = require('./../dev.js');

shapes._reset();

let control_vol = SYSTEM ({
    NAME : "control_vol",
    VISUALIZE : [
        {
            REPRESENTS : "Pressure",
            TOPOLOGY : shapes.point
        }
    ],
    Pressure : 200,
    REQUIRE : ["Pressure"],    
    PROCESS : [
        (async function (S){with (S){
            Pressure = 0.95 * Pressure
        }})
    ],
});

let Sparent = SYSTEM();

let main = () => {
    //-----Example 1-----------
    let Nchain = 100;
    let Nshelf = 10;

    let N = 50;
    let PressureGen =(N)=> {
        Pressurearray = []
        for (let n = 0; n<N; n++){
            Pressurearray.push(200 - 8*n);
        }
        return Pressurearray;
    }

    CONNECT (Sparent) (MESH(control_vol, N, N));
    bfsTraverse(Sparent, arg =>{
        console.log(arg.VISUALIZE[0])
    })
}


module.exports = {
    Sparent,
    main,
}
