const { exec } = require("child_process");
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
    return (await x).stdout;
}

const formCurve = async function(obj){
    let x = execProm(`./cpp_bins/main curve center \"${obj.center}\" angle \"${obj.angle}\" length \"${obj.length}\"`)
    return (await x).stdout;
}

module.exports = {
    square,
    log10,
    cube,
    formLine,
    formCurve
};