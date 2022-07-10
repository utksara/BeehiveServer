const config = require('./../config.json');

const _OBJECT = (params = {}, initializer ={})=>{
    Object.keys(initializer).forEach(key => {
        if (params[key]  === undefined){
            params[key] = initializer [key]
        }
    });
    return params;
}

const VISOBJECT = (params = {}) => {    
    const update_vis_element = function(params){
        params._param = params.GEOMETRY(params._param);
    }

    let initializer = {
        "GEOMETRY" : "none",
        "_param": {},
        "REPRESENTS" : "none",
        "minval" : 0,
        "maxval" : 0,
    }

    let new_obj = _OBJECT(params, initializer)

    new_obj.update = () => {update_vis_element(new_obj)}

    return new_obj;
}

function safe_push(object, key, value){
    try{
        object[key].push(value)
    }catch{
        object[key] = [push(value)]
    }
}

function safe_append(object, key, value, default_val){
    try{
        object[key] += value
    }catch{
        object[key] = default_val + value
    }
}

const VISDATA = (params = {}) => {
    initializer = {
        "point" : {},
    }
    return _OBJECT(params, initializer)
}

let list_of_objs = [];
let vis_objs = [];
let sys_by_id = {};
let edge_by_id = {};
let global_index = 0;
let execution_order = [];

const createlog = (logger, message, level) =>{
    if (config.LOGGING){
        if (level === "info"){
            logger.info(message)
            console.log("YO!")
        }
        if (level === "error"){
            logger.error(message)
        }
    }
}

const dfsTraverse = function(system, param = "ID") {
    let visited = []
    let traversal = []
    function _dfsTraverse(system){
        traversal.push(system[param])
        visited.push(system.ID)
        system.TO.forEach(subsys_id => {
            let subsys = sys_by_id[subsys_id]
            if (!visited.includes(subsys.ID)){
                _dfsTraverse(subsys)
            }
        });
    }
    _dfsTraverse(system)
    return traversal;
}

const bfsTraverse = function (system, func = (system, accumulator =[]) => {console.log(system.ID)}, accumulator = []){
    traversal_array = [system.ID]
    visited = []
    while(traversal_array.length > 0 ){
        thissys = sys_by_id[traversal_array[0]]
        traversal_array.splice(0,1)
        func(thissys, accumulator)
        thissys.TO.forEach(child_id => {
            let child = sys_by_id[child_id]
            if (!visited.includes(child.ID) ){
                visited.push(child.ID)
                traversal_array.push(child.ID)
            }
        }); 
    }
}

module.exports = {
    dfsTraverse,
    safe_push,
    safe_append,
    bfsTraverse,
    list_of_objs,
    vis_objs,
    sys_by_id,
    edge_by_id,
    VISOBJECT,
    global_index,
    execution_order,
    createlog,
}
