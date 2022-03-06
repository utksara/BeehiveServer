const { exec, spawn } = require("child_process");
const fs = require('fs');
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

const formLine = async function(obj){
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
        let R = 255* (val - minval)/(maxval - minval);
        let B = 255* (maxval - val)/(maxval - minval);
        let G = 0
        return `rgb(${R}, ${G}, ${B})`;
    }else{
        return 'rgb(0, 0, 255)';
    }
}

module.exports = {
    square,
    log10,
    cube,
    formLine,
    formCurve,
    colorMap
};