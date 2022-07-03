const { exec, spawn } = require("child_process");
const fs = require('fs');
const { stdout } = require("process");
const util = require("util");

const execProm = util.promisify(exec);

const square = async function(val){
    let x = execProm(`./cpp_bins/basic square ${val}`)
    return parseFloat((await x).stdout);
};

const log10 = async function(val){
    let x = execProm(`./cpp_bins/basic log10 ${val}`)
    return parseFloat((await x).stdout);
};

const cube = async function(val){
    let x = execProm(`./cpp_bins/basic cube ${val}`)
    return parseFloat((await x).stdout);
};

const formLineSvg = async function(obj){
    let x = execProm(`./cpp_bins/main line center \"${obj.center}\" angle \"${obj.angle}\" length \"${obj.length}\"`)
    // return (await x).stdout;
    // let x = spawn(`./cpp_bins/main`, [`line', 'center', '\"${obj.center}\"`, `angle`, `\"${obj.angle}\"`, `length`, `\"${obj.length}\"`])
    return x;
}

const formCurve = async function(obj){
    let x = execProm(`./cpp_bins/main curve movement \"${obj.movement}\" center \"${obj.center}\"`)
    return (await x).stdout;
}

const colorMap = function(val, maxval = 200, minval = 0){
    if(!isNaN(val)){
        let R = 255;
        let B = 255;
        let G = 0;
        if (maxval !== minval){
            R = 255* (val - minval)/(maxval - minval);
            B = 255* (maxval - val)/(maxval - minval);
            G = 0
        }
        return `rgb(${R}, ${G}, ${B})`;
    }else{
        return 'rgb(0, 0, 255)';
    }
}

const print_valeus = e => { console.log(e.stdout)}

const traverse = async function(graph, v_begin, callback = print_valeus ){
    execProm(`./cpp_bins/main curve movement \"${obj.movement}\" center \"${obj.center}\"`).then( e => {
        callback(e) ;
    });
};
const parallel_traverse = async function(graph, s_begin, no_threads, callback = print_valeus ){};

module.exports = {
    square,
    log10,
    cube,
    formLineSvg,
    formCurve,
    colorMap,
    execProm
};