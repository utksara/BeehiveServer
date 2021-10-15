let p1 = new Promise(resolve => {
    console.log('f1');
    resolve('f1');
}
)

let p2 = new Promise(resolve => {
        console.log('f2');
        resolve('f2');
    }
)

let f  = function (){
    console.log('l');
}

// let a = []

// a.push(p1)
// a.push(p2)

// console.log(a)
// let f3 = async ()=> {
//     Promise.all(a)
// }

// f3();
