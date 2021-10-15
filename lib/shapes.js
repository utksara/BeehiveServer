const calc = require('./calc');

let get_points = function (topology){
    return topology._generator
}

let _init_pos = function(){
    return [100,100]
}

let line_GPS = [100,100]
let curve_GPS = [900,500]

let _reset = ()=>{
    line_GPS = [100,100]
    curve_GPS = [900,500]
}

let line = (param = {})=>{
    line_GPS = [line_GPS[0] + 1, line_GPS[1]]
    let newpos = line_GPS.toString()
    return line_obj = {
        "center" : param.center ? param.center.toString() : newpos,
        "angle" : param.angle ? param.angle : "1.57",
        "length" : param.length ? param.length :"100",
        "generate" : async function () {return calc.formLine (line_obj)}
    }
}

const point = (param = {})=>{
    line_GPS = [line_GPS[0] + 1, line_GPS[1]]
    let newpos = line_GPS.toString()
    return line_obj = {
        "center" : param.center ? param.center.toString() : newpos,
        "angle" : param.angle ? param.angle : "1.57",
    "length" : param.length ? param.length :"1",
        "generate" : async function () {return calc.formLine (line_obj)}
    }
}

let contour = () => {
    curve_GPS = [curve_GPS[0] + 2, curve_GPS[1]]
    let newpos = line_GPS.toString()
    return contour_obj = {
        "center" : param.center ? param.center.toString() : newpos,
        "coordinates" : param.coordinates ? param.coordinates.toString() : "",
        "normal_distance" : param.normal_distance ? param.normal_distance : 0, 
        "generate" : async function () {return calc.formCurve (contour_obj)}
    }
}

let curve = (param = {}) => {
    // return circle_obj = {
    //     "type" :"closed", // allowed values ("closed" | "open")
    //     "locus" : "random", // allowed values ("random" | "custom")
    //     "path" : "discrete", // allowed values ("discrete" | "continous")
    //     "space" : "lineal", // allowed values ("lineal" | "planer")
    //     "_generator" : calc.formCircle,
    //     "_arg_list" : ["center", "radius"]
    // }

    curve_GPS = [curve_GPS[0] + 2, curve_GPS[1]]
    let newpos = line_GPS.toString()
    return contour_obj = {
        "center" : param.center,
        "movement" : param.movement,
        "generate" : async function () {return calc.formCurve (contour_obj)}
    }
}

module.exports = {
    line,
    point,
    contour,
    curve,
    _reset,
    _init_pos
}