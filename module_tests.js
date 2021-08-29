const { line } = require('./lib/shapes.js');

const {square, log10, cube, formLine, formCurve} =require('./lib/calc.js');
const { _run_System } = require('./lib/beehive.js');
const {chain, run_Systems} = require('./lib/beehive.js')

const {beehive} = require('./dev.js');

// let S5 = {
//     "ID" : 's5',
//     "INPUT" : ["Pressure_internal"],
//     "Pressure2" : 0,
//     "Pressure_internal" : 0,
//     "PROCESS" : [ (async function() {
//         S2.Pressure_internal =  S2.Pressure_internal - 10* await calc.log10(S2.Pressure_internal)  
//         console.log( S2.ID, " Pressure_internal ", S2.Pressure_internal)
//     })],
// };

// let S4 = {
//     "ID" : 's4',
//     "INPUT" : ["Pressure_internal"],
//     "Pressure2" : 0,
//     "Pressure_internal" : 0,
//     "PROCESS" : [ (async function() {
//         S2.Pressure_internal =  S2.Pressure_internal - 10* await calc.log10(S2.Pressure_internal)  
//         console.log( S2.ID, " Pressure_internal ", S2.Pressure_internal)
//     })],
// };


// let S2 = {
//     "ID" : 's2',
//     "TO" : [S4],
//     "INPUT" : ["Pressure2"],
//     "Pressure2" : 0,
//     "Pressure_internal" : 0,
//     "PROCESS" : [ (async function() {
//         S2.Pressure_internal =  S2.Pressure2 - 10* await calc.log10(S2.Pressure2)  
//         console.log( S2.ID, " Pressure_internal ", S2.Pressure_internal)
//     })],
// };

// let S3 = {
//     "ID" : 's3',
//     "TO" : [S5],
//     "INPUT" : ["Pressure2"],
//     "Pressure2" : 0,
//     "Pressure_internal" : 0,
//     "PROCESS" : [(async function() {
//         S3.Pressure_internal = S3.Pressure2 - await calc.log10(S3.Pressure2)  
//         console.log( S3.ID, " Pressure_internal ", S3.Pressure_internal)
//     })],
// };

// let S1 = {
//     "ID" : 's1',
//     "TO" : [S3, S2],
//     "INPUT" : ["Pressure1"],
//     "topology" : line({
//         "angle" : "0",
//         "length" : "100",
//         "magnum" : "Pressure2"
//     }),
//     "Pressure2" : 0,
//     "Pressure1" : 200,
//     "PROCESS" : [(async function() {
//         S1.Pressure2 = S1.Pressure1 - await calc.log10(S1.Pressure1) 
//         console.log( S1.ID, " Pressure2 ", S1.Pressure2)
//     })],
// };

let chained_sys = {
    "ID" : 'chained_sys',

    // "VISUALIZE" : [
    //     {
    //         "magnitude" : "Pressure",
    //         "topology" : line({
    //             "represent": "Pressure"
    //         })
    //     }
    // ],
    "Pressure" : 200,
    "INPUT" : ["Pressure"],
    "PROCESS" : [
        (async function (S){with (S){
            Pressure = Pressure/2 
            console.log( ID, " Pressure ", Pressure)
        }}),
        (async function (S){with (S){
            Pressure = Pressure + 1.1 
            console.log( ID, " Pressure ", Pressure)
        }}),
    ],
};

chain(chained_sys, 10);
console.log(chained_sys)

module.exports.run = _run_System(chained_sys);
// module.exports.run = beehive.run_System(S1);

