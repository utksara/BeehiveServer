const { PATTERN } = require('../lib/beehive.js');
const {shapes, calc, SYSTEM, CONNECT, CONNECTADVANCED, CHAIN, SHELF, MESH, CONNECTIONS, copySystem, bfsTraverse }  = require('../dev.js');

shapes._reset();

let Sparent = SYSTEM();

let S1 = SYSTEM ({
    NAME : "S1",
    Pressure : 200,
    REQUIRE : ["Pressure"],    
    PROCESS : [
        (async function (S){with (S){
            Pressure = 0.95 * Pressure
        }})
    ],
});

let S2 = SYSTEM ({
    NAME : "S2",
    Pressure : 200,
    REQUIRE : ["Pressure"],    
    PROCESS : [
        (async function (S){with (S){
            Pressure = 0.95 * Pressure
        }})
    ],
});

let S3 = SYSTEM ({
    NAME : "S3",
    VISUALIZE : [
        {
            REPRESENTS : "Qty",
            TOPOLOGY : shapes.line,
            maxval : 400
        }
    ],
    Pressure : 0,
    Qty : 0,
    delta : 0.1,
    omega :2,
    delPressure : 0,
    REQUIRE : ["Pressure", "delPressure"],    
    PROCESS : [
        (async function (S){with (S){
            Pressure = Pressure + delta * delPressure
            delPressure = delPressure + delta * omega * (-Pressure)
            Qty = 200  + Pressure
            console.log(Qty)
        }})
    ],
});

let main = () => {
    //-----Example 1-----------
    let N = 200;


    /***
     *   
     *   
     * S1 ---- S2----- S3
     *   \             /
     *    -------------
     * 
     * 
     */

    CONNECT (S1) (S2, S3)
    CONNECT (S2) (S3)
    CONNECT (Sparent) (PATTERN(S1, {'S2' : 'S3', "S1" : "S2"}, N))
    // bfsTraverse(Sparent, arg =>{
    //     console.log(arg.ID)
    //     console.log(arg.VISUALIZE[0])
    //     console.log("------")
    // })
}


module.exports = {
    Sparent,
    main,
}
