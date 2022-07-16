

let _condition =  function (){
    let result_ = true;
    let S = arguments[arguments.length-1]

    for (var i = 0; i < arguments.length -1; i++) {
        with (S){
            result_ = result_ & eval(arguments[i])
        }
    }
    return result_;
}


let condition = function (){
    const parent_args = arguments
    return [(sys) =>{
        let new_args = []; 
        new_args = Array.prototype.slice.call(parent_args);
        new_args.push(sys)
        return _condition.apply(null, new_args)
    }, "condition"]
}


module.exports ={
    condition,
}