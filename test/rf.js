const { range } = require("lodash")

let x = 1
let f = () => ()=> { console.log("f"); return x + 1}
let g ;

for (var i =0; i < 3; i ++){
    g = () => {console.log("g");  return f()}
    f = () => () => g() + 1
}


console.log(f()())