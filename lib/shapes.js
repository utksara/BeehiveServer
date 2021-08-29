const calc = require('./calc');

let get_points = function (topology){
    return topology._generator
}

let line = (param = {})=>{
    return line_obj = {
        "center" : param.center ? param.center : "500,500",
        "angle" : param.angle ? param.angle : "0",
        "length" : param.length ? param.length :"1-0",
        "width" : param.width ? param.width : "10",
        "generate" :  calc.formLine
    }
}

let circle = () => {
    return circle_obj = {
        "center" : (100,100),
        "radius" : 10,
        "space" : "lineal",
        "_generator" : calc.formCircle,
        "_arg_list" : ["center", "radius"]
    }
}

let curve = () => {
    return circle_obj = {
        "type" :"closed", // allowed values ("closed" | "open")
        "locus" : "random", // allowed values ("random" | "custom")
        "path" : "discrete", // allowed values ("discrete" | "continous")
        "space" : "lineal", // allowed values ("lineal" | "planer")
        "_generator" : calc.formCircle,
        "_arg_list" : ["center", "radius"]
    }
}

let fusen = (shape1, shape2, smoothen  = true) => {

    let type = shape1.type
    
    if (type != shape2.type){
        throw "Error : Can't combine a closed curve with an open curve!"
    }
    return {
        "type" :type, // allowed values ("closed" | "open")
        "locus" : "random", // allowed values ("random" | "custom")
        "path" : "discrete", // allowed values ("discrete" | "continous")
        "space" : "lineal", // allowed values ("lineal" | "planer")
        "_generator" : calc.formCircle,
        "_arg_list" : ["center", "radius"]
    }
}

module.exports = {
    line,
    circle,
    curve,
    fusen
}