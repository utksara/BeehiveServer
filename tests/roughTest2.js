const { exec, spawn } = require("child_process");
const fs = require('fs');
const util = require("util");

const execProm = util.promisify(exec);

let obj = {
    "center" : [1,1],
    "angle" : "1.57",
    "length" :"1",
}

let N = 10                
for (var i = 0; i < N; i++){
    execProm(`./cpp_bins/main line center \"${obj.center}\" angle \"${obj.angle}\" length \"${obj.length}\"`).then(

    v=>{console.log(v.stdout)}
    )
}
