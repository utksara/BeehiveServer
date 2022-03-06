const {point} = require('../lib/shapes');

let pf = (x) => {
    promise3 = new Promise((resolve, reject) => {
        setTimeout(resolve, 1000, x.center);
    });
    return promise3;
}
  
let f1 = async function(param = {}) {
    return point(param).generate()
}

let N = 1000

let get_center = x => {return {center:[1,x]}}

let stack_promise = (promise, n) => {
    let promise_array = []
    for (i = 0; i < n; i ++){
        promise_array.push(promise);
    }
    return promise_array
}

let stack_promise_function = (func, n, iterator_func) => {
    let promise_array = []
    let promise = func({center: [1,1]})
    for (i = 0; i < n; i ++){
        let promise = func(iterator_func(i))
        // console.log([1,i])
        promise_array.push(promise);
    }
    return promise_array
}

with_await = async(promise, n) => {
    let promise_array = stack_promise(promise, n)
    for (i = 0; i<N; i++){
        await promise_array[i];
    }
}

with_all = async(func, n, iterator_func) => {
    let promise_array = stack_promise_function(func, n, iterator_func)
    Promise.all(promise_array).then(v=>{
        console.log(v)
    });
}

with_sequence = async(promise, n) => {
    let promise_array = stack_promise(promise, n)
    promise_array.reduce((p, fn) => p.then(fn), Promise.resolve())
}



// with_await()
with_all(f1, N, get_center)
// with_all(pf, N, get_center)
// with_sequence()