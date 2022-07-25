const { transform } = require('lodash');
const config = require('./../config.json');
const { removeFlow, addFlow, filter_edges, remove_flow_faster, } = require('./core/edgeUtils');
const { filter_systems } = require('./core/systemUtils');
const {list_of_objs, sys_by_id, edge_by_id, vis_objs, execution_order, global_id} = require('./core/globalParameters.js');
const { removeProcess, addProcesses } = require('./core/processUtils');

const _OBJECT = (params = {}, initializer ={})=>{
    Object.keys(initializer).forEach(key => {
        if (params[key]  === undefined){
            params[key] = initializer [key]
        }
    });
    return params;
}

const VISOBJECT = (params = {}) => {    
    let initializer = {
        "GEOMETRY" : "none",
        "_param": {},
        "REPRESENTS" : "none",
        "minval" : 0,
        "maxval" : 0,
    }
    let new_obj = _OBJECT(params, initializer)
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

const createlog = (logger, message, level) =>{
    if (config.LOGGING){
        if (level === "info"){
            logger.info(message)
        }
        if (level === "error"){
            logger.error(message)
        }
    }
}

/**
 * 
 * @param {SYSTEM to traverse} system 
 * @param {Param to show in traversal} param 
 * @returns 
 */
const dfsTraverse = function(system, param = "ID") {
    let visited = []
    let traversal = []
    function _dfsTraverse(system){
        try{
            traversal.push(system[param])
        }
        catch(err){
            console.log("parameter", param, " not found  is system ",system.ID )
        }
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

let DOWHERE = (system , transformations, conditions, operation = "and") => {
    let filtered_system_ids = filter_systems(system, conditions, operation)[0];
    filtered_system_ids.forEach(sysid => {
        let subsys = sys_by_id[sysid]
        with (subsys){
            transformations.forEach(transformation => {
               eval(transformation); 
            });
        }
    });
}

let DISABLEFLOW = (system , variables, conditions = [], operation = "and") => {
    let filtered_edges = filter_edges(system, conditions, operation)[0];

    console.log("YO", filtered_edges.length)
    filtered_edges.forEach(edges_id => {
        parent = edges_id[0];
        child = edges_id[1];
        let target_edge = edge_by_id[parent][child];
        edge_by_id[parent][child] = remove_flow_faster(target_edge, variables)
    });
}

let ENABLEFLOW = (system , variables, conditions = [], operation = "and") => {
    let filtered_edges = filter_edges(system, conditions, operation)[0];
    filtered_edges.forEach(edges_id => {
        parent = edges_id[0];
        child = edges_id[1];
        let target_edge = edge_by_id[parent][child];
        edge_by_id[parent][child] = addFlow(target_edge, variables)
    });
}

let DISABLEPROCESS = (system, processes, conditions = [], operation = 'and') => {
    let filtered_system_ids = filter_systems(system, conditions, operation)[0];
    filtered_system_ids.forEach(sysid => {
        let subsys = sys_by_id[sysid]
        removeProcess(subsys, processes)
    });
}

let ENABLEPROCESS = (system, processes, conditions = [], operation = 'and') => {
    let filtered_system_ids = filter_systems(system, conditions, operation)[0];
    filtered_system_ids.forEach(sysid => {
        let subsys = sys_by_id[sysid]
        addProcesses(subsys, processes)
    });
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
    DOWHERE,
    DISABLEFLOW,
    ENABLEFLOW,
    DISABLEPROCESS,
    ENABLEPROCESS,
    execution_order,
    createlog,
    execution_order,
    global_id,
}
