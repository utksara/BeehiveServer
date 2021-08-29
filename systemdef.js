const {shapes, calc }  = require('./dev.js')

module.exports.systems =  [

    {
        NAME : 's5',
        REQUIRE : [Pressure_internal],
        Pressure2 : 0,
        Pressure_internal : 0,
            PROCESS : [ (async function() {
                S2.Pressure_internal =  S2.Pressure_internal - 10* await calc.log10(S2.Pressure_internal)  
                console.log( S2.ID, " Pressure_internal ", S2.Pressure_internal)
            })],
    },

    {
        NAME : 's4',
        REQUIRE : [Pressure_internal],
        Pressure2 : 0,
        Pressure_internal : 0,
        PROCESS : [ (async function() {
            S2.Pressure_internal =  S2.Pressure_internal - 10* await calc.log10(S2.Pressure_internal)  
            console.log( S2.ID, " Pressure_internal ", S2.Pressure_internal)
        })],
    },


    {
        NAME : 's2',
        TO : [S4],
        REQUIRE : [Pressure2],
        Pressure2 : 0,
        Pressure_internal : 0,
        PROCESS : [ (async function() {
            S2.Pressure_internal =  S2.Pressure2 - 10* await calc.log10(S2.Pressure2)  
            console.log( S2.ID, " Pressure_internal ", S2.Pressure_internal)
        })],
    },

    {
        NAME : 's3',
        TO : [S5],
        REQUIRE : [Pressure2],
        Pressure2 : 0,
        Pressure_internal : 0,
        PROCESS : [(async function() {
            S3.Pressure_internal = S3.Pressure2 - await calc.log10(S3.Pressure2)  
            console.log( S3.ID, " Pressure_internal ", S3.Pressure_internal)
        })],
    },

    {
        NAME : 's1',
        TO : [S3, S2],
        REQUIRE : ["Pressure1"],
        "topology" : line({
            "angle" : "0",
            "length" : "100",
            "magnum" : Pressure2
        }),
        Pressure2 : 0,
        "Pressure1" : 200,
        PROCESS : [(async function() {
            S1.Pressure2 = S1.Pressure1 - await calc.log10(S1.Pressure1) 
            console.log( S1.ID, " Pressure2 ", S1.Pressure2)
        })],
    },

    {
        NAME : 'chained_sys',
        VISUALIZE : [
            {
                REPESENT : Pressure,
                TOPOLOGY : shapes.line
            }
        ],
        Pressure : 200,
        REQUIRE : [Pressure],
        PROCESS : [
            (async function (S){with (S){
                Pressure = Pressure/2 
                console.log( ID, " Pressure ", Pressure)
            }}),
            (async function (S){with (S){
                Pressure = Pressure + 1.1 
                console.log( ID, " Pressure ", Pressure)
            }}),
        ],
    },
]


module.exports.connections = {
    'S1' : {
        'S2': {},
        'S3': {}
    }
}