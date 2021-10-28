const _ = require('lodash');
const { register } = require('./sendingData.js');
const shapes = require('./shapes.js')
const config = require('./../config')
const beehiveUtils = require('./beehiveUtils') 

let num = 0, no_of_digits = 5;

let list_of_objs = beehiveUtils.list_of_objs;
let vis_objs = beehiveUtils.vis_objs;
let sys_by_id = beehiveUtils.sys_by_id;
let edge_by_id = beehiveUtils.edge_by_id;

const DEBUG = config.DEBUG;
const DEBUGPROCESSES = DEBUG && config.DEBUGPROCESSES;
const DEBUGSYSTEMS = DEBUG && config.DEBUGSYSTEMS;
const DEBUGPARAMS = DEBUG && config.DEBUGPARAMS;

const Debug = debugval =>{
    if(debugval) return console.log;
    else return ()=>{};
};

const DebugAny = Debug(DEBUG);
const DebugProcesses = Debug(DEBUGPROCESSES);
const DebugSystems = Debug(DEBUGSYSTEMS);
const DebugParams = Debug(DEBUGPARAMS);

const DebugParamValues = (sys)=>{
    for (key in sys){
        if (!(_optional_params.includes(key) || _core_params.includes(key))){
            DebugParams(sys.ID, " : ", key, " :: ", sys[key]);
        }
    } 
}

const DebugTOMap = (sys)=>{
    let iter = 0
    let msg = ""
    let sample_sys = sys;
    while(sample_sys.TO.length > 0 && iter < 100){
        iter+=1
        msg+= sample_sys.NAME + "_" + sample_sys.ID + "-->";
        sample_sys = sys_by_id[sample_sys.TO[0]]
    }
    msg+= sample_sys.NAME + "_" + sample_sys.ID;
    DebugSystems("CHAIN")
    DebugSystems(msg);
} 

const DebugTOAll = (sys)=>{
    let msg = ""
    sys.forEach(tosys => {
        console.log(tosys)
        msg+= tosys.NAME + "_" + tosys.ID + " | ";
    });
    DebugSystems("PARALLEL PROCESSING");
    DebugSystems(msg);
}

const _core_params = [
    "ID",
    "VISUALIZE",
    "REQUIRE",
    "PROCESSES",
    "TO",
]

const _optional_params = [
    "NAME",
    "endpoints",
]

const _all_requirements_fullfilled  = function(sys){
    return _.reduce(sys.preceding_syss, function(result, value) {
        result = result && value; 
        return result;
    }, true);
}

let _push_sys = (direction, flow_parameters = []) =>{
    return (sys_to_be_pushed)=>{
        if (direction === 'forward'){
            return (P)=>{
                P = _with_endpoints_sys(P)
                P.endpoints.forEach(sys_id => {
                    let sys = sys_by_id[sys_id]
                    CONNECT (sys).apply(null, flow_parameters)(sys_to_be_pushed);
                });
                P = _with_endpoints_sys(P)
                return P;
            }
        }
        else if (direction === 'backward'){
            return (P)=>{
                CONNECT (sys_to_be_pushed).apply(null, flow_parameters)(P);
                P = sys_to_be_pushed;
                return P;
            }
        }else throw ("invalid argumenet ", direction)
    }
}

function _search_by(sys, by, values){
    sys_by = {};
    _dfs_search(sys, by, values, sys_by);
    return sys_by;
}

function _dfs_search(sys, by, values = [], accum = {}){

    for (let i = 0; i < values.length; i++){
        let value = values[i]
        if (value === sys[by]){
            accum[value] = sys.ID;
            values.splice(i,1);
        }
    }
    sys.TO.forEach( subsys_id => {
        let subsys = sys_by_id[subsys_id]
        _dfs_search(subsys, by, values, accum);
    });
}

let _with_endpoints_sys = function(sys){
    let sample_sys_id, temp_sys_id;
    if (typeof sys.endpoints === 'undefined' || sys.endpoints.length === 0){
        sample_sys_id = [sys.ID];
    }else{
        sample_sys_id = sys.endpoints
    }
    temp_sys_id = sample_sys_id
    while(sys_by_id[temp_sys_id[0]].TO.length > 0){
        sample_sys_id = sys_by_id[temp_sys_id[0]].TO;
        temp_sys_id = sys_by_id[temp_sys_id[0]].TO
    }
    sys.endpoints = sample_sys_id;
    return sys;
}

let _is_obj = function (S){
    if(typeof S === 'object' && S !== null && !Array.isArray(S)){
        return true;
    }
    else{
        return false;
    }
}

let _is_sys = function (S){
    let status;
    if (_is_obj(S)){
        _core_params.forEach(element => {
            if(typeof S[element] === 'undefined'){
                status = false;
            }else status = true;
        });
        return status;
    }
    else{
        return false;
    }
}

const _isE_elementary_sys = function (S) {
    if (_is_sys(S)){
        if (S.TO.length === 0)
            return true;
        else return false;
    }else return false;
}

const _transform_postion = function (sys, coordinates){
    if (_is_sys(sys)){
        sys.VISUALIZE.forEach(element => {
            element._param.center = [element._param.center[0]+coordinates[0], element._param.center[1]+coordinates[1]]
        });
    }else{
        throw (sys, " is not a system")
    }

}

const _transform_postion_recursive = function (sys, coordinates){
    let eff = function (S) {
        _transform_postion(S, coordinates);
    }
    beehiveUtils.bfsTraverse(sys, eff);
    
}

// let attach = function (sys1, sys2){
//     sys.VISUALIZE.GEOMETRY = 
// }

let _new_id = (() => {
    let numstr = (num).toString()
    if (no_of_digits - numstr.length < 0) {
        throw(" Maximum number of systems reached! Only 10000 systems are allowed per run")
    }
    num+=1;
    return (new Array(no_of_digits - numstr.length).fill("0")).join('') +  numstr
});

async function _run_system(sys){

    let proc_runs = []
    /**
     * Execution of each process within the current system
     */
    _.forEach(sys.PROCESSES, (process)=>{
        DebugProcesses("processing ", sys.ID)
        proc_runs.push(process(sys))
    });

    /**
     * The current system shares its parameters to all child processes
     */
    _.forEach(sys.TO, (subsys_id)=>{
        let subsys = sys_by_id[subsys_id]
        try{
            _.forEach(subsys.REQUIRE, (input) => {
                if (edge_by_id[sys.ID][subsys.ID].includes(input) || edge_by_id[sys.ID][subsys.ID].length === 0){
                    DebugProcesses("equating",  `${subsys.ID}`, "and", `${sys.ID}`, "for", input)
                    subsys[input] = sys[input] ? sys[input] :  subsys[input]
                    DebugProcesses("value of",  `${subsys.ID}.${input}`, "is", subsys[input]);
                }
            })
        }
        catch(err){
            console.error(err);
        }
    });


    /**
     * Now child processes is executes recursively
     */
    if (sys.TO.length > 0){
        const sub_process = _.reduce(sys.TO, function(result, subsys_id){
            let subsys = sys_by_id[subsys_id];
            subsys.preceding_syss[sys.ID] = true;
            if(_all_requirements_fullfilled(subsys)){
                _run_system(subsys)
                result.push(subsys.ID);
            }
            return result
        }, []);
    }else{
        DebugProcesses("no sub process for ", sys.ID)
    }

    await register(vis_objs, sys);
    return vis_objs;
}

function _copy(I){
    if (_is_sys(I)){
        return _copy_system(I)
    }else if (_is_obj(I)){
        return _copy_object(I)
    }else if (Array.isArray(I)){
        return _copy_array(I)
    }else{
        return I;
    }
}

function _copy_array(A){
    let new_arr = []
    A.forEach(element => {
        let new_element = _copy(element)
        new_arr.push(new_element)
        // new_arr.push(element)
    });
    return new_arr;
}

function _copy_object(O){
    let new_obj = {}
    for (element in O) {
        new_obj[element] = _copy(O[element])
    }
    return new_obj;
}

function _copy_system(S, corresponding_system = {}){
    let Z = SYSTEM()
    for (element in S) {
        if (`${element}`!="ID" && `${element}`!="endpoints" && `${element}`!="preceding_syss"){
            if (element === "TO"){
                S.TO.forEach(child_id => {
                    let child = sys_by_id[child_id]
                    if (!Object.keys(corresponding_system).includes(child.ID) ){
                        const new_child = _copy_system(child, corresponding_system) 
                        corresponding_system[child.ID] = new_child.ID;
                        // Z.TO.push(new_child);
                        SIMPLECONNECT (Z)(new_child)
                        edge_by_id[Z.ID][new_child.ID] = edge_by_id[S.ID][child.ID]
                    }else{
                        // Z.TO.push(sys_by_id[corresponding_system[child.ID]])
                        const new_child = sys_by_id[corresponding_system[child.ID]] 
                        SIMPLECONNECT (Z)(new_child)
                        edge_by_id[Z.ID][new_child.ID] = edge_by_id[S.ID][child.ID]
                    }
                });
            }
            else Z[element] = _copy(S[element]);
        }

        Z.TO.forEach(subsys_id => {
            let subsys = sys_by_id[subsys_id]
            subsys.preceding_syss[Z.ID] = false;
        });
    }
    return Z;
}

function bypassSystem(sys, params = {}){
    params.REQUIRE = sys.REQUIRE
 return SYSTEM(params)   
}

function _relocate_sys(sys_to_be_relocated, new_sys, _relocate_tracker = {}){
    new_sys.TO = []
    new_sys.NAME = sys_to_be_relocated.NAME
    for(let i = 0; i < sys_to_be_relocated.TO.length; i++) {
        let subsys = sys_by_id[sys_to_be_relocated.TO[i]]
        if (Object.keys(_relocate_tracker).includes(subsys.ID)){
            let new_subsys = sys_by_id[_relocate_tracker[subsys.ID]]
            SIMPLECONNECT(new_sys) (new_subsys);
            edge_by_id[new_sys.ID][new_subsys.ID] = edge_by_id[sys_to_be_relocated.ID][subsys.ID]
            // new_sys.TO.push(sys_by_id[_relocate_tracker[subsys.ID]]);
        }else{
            SIMPLECONNECT(new_sys)(subsys);
            edge_by_id[new_sys.ID][subsys.ID] = edge_by_id[sys_to_be_relocated.ID][subsys.ID]
        }      
        DISCONNECT (sys_to_be_relocated) (subsys);
        i-=1
    };
    // sys_to_be_relocated.TO = []
    // delete sys_to_be_relocated;
}

let SYSTEM = function(param = {}){
    param.ID = _new_id()
    param.PROCESSES = param.PROCESSES ? param.PROCESSES : []
    param.REQUIRE = param.REQUIRE ? param.REQUIRE : []
    param.VISUALIZE = param.VISUALIZE ? param.VISUALIZE : []
    param.TO = param.TO ? param.TO : []
    if (param.VISUALIZE.length > 0){
        param.VISUALIZE.forEach(element => {
            element._param = {}
            let otherwise;

            otherwise = element.POSITION ? element.POSITION : shapes._init_pos();
            element._param.center = param[element.POSITION] ? param[element.POSITION] : otherwise;

            element._param.movement = element.MOVEMENT ? param[element.MOVEMENT] : "100, 100, 100, 100,,,,,"
        });
    }
    // param.requirement_status = _.reduce(param.REQUIRE, function(result, requirement){
    //     result[requirement] = false;
    //     return result;
    // }, {});
    param.preceding_syss = {}
    sys_by_id[`${param.ID}`] = param;
    list_of_objs.push(param);
    return param;
}

const SIMPLECONNECT = function(){
    const From  = arguments
    return function (){
        for (let i in From) {
            if (!(From[i].ID in edge_by_id)){
                edge_by_id[From[i].ID] = {}
            }
            for (let j in arguments){
                const Towards = arguments
                edge_by_id[From[i].ID][Towards[j].ID] = []
                From[i].TO.push(Towards[j].ID);
                Towards[j].preceding_syss[From[i].ID] = false;
                From[i] = _with_endpoints_sys (From[i])
            }
        }
    }   
}

const BICONNECT = function() {
    const sys_array_one = arguments[0]
    return function (){
        const sys_array_two = arguments[0]
        SIMPLECONNECT (sys_array_one) (sys_array_two)
        SIMPLECONNECT (sys_array_two) (sys_array_one)
    }
}

const CONNECT = function(){
    const From  = arguments
    return function (){
        let variable_collection = []
        for (const i in arguments){
            variable = arguments[i]
            variable_collection.push(variable)        
        }
        return function (){
            for (let i in From) {
                if (!(From[i].ID in edge_by_id)){
                    edge_by_id[From[i].ID] = {}
                }
                for (let j in arguments){
                    const Towards = arguments
                    edge_by_id[From[i].ID][Towards[j].ID] = variable_collection
                    From[i].TO.push(Towards[j].ID);
                    Towards[j].preceding_syss[From[i].ID] = false;
                    From[i] = _with_endpoints_sys (From[i])
                }
            }
        }   
    }
}

const PAIRUP = function (sys1, sys2, flow_parameters = []){
    let traversal1 = []
    beehiveUtils.bfsTraverse(sys1, (sys, accum)=>{
        accum.push(sys.ID)
    }, traversal1)
    let index = 0
    beehiveUtils.bfsTraverse(sys2, (sys)=>{
        CONNECT (sys_by_id[traversal1[index]]).apply(null, flow_parameters) (sys_by_id[sys.ID])
        index+=1
    })
}

const STACK = function (sys, N, flow_parameters = []){
    let new_sys = bypassSystem(sys, {NAME : "Shelved" + sys.NAME})
    let prev_sys
    let copy_sys
    for (let i = 0; i<N; i++){
        copy_sys = _copy_system(sys);
        if (i > 0){
            PAIRUP(prev_sys, copy_sys, flow_parameters)
        }
        SIMPLECONNECT (new_sys) (copy_sys); 
        prev_sys = copy_sys
        let sys_iterator = copy_sys;
        _transform_postion_recursive(sys_iterator, [0,8]);
    }
    DebugTOMap(new_sys);
    return new_sys;
}

const DISCONNECT = function() {
    const From  = arguments
    return function (){
        for (let i in From) {
            for (let j in arguments){
                From[i].TO.splice(From[i].TO.indexOf(arguments[j].ID), 1);
                delete arguments[j].preceding_syss[From[i].ID];
                // delete edge_by_id[From[i]][arguments[j]];
                From[i] = _with_endpoints_sys (From[i]);
            }
        };
    }
}

const CONNECTIONS = async function (main, starting_system){
    shapes._reset()
    main();
    return await _run_system(starting_system)
}

const CHAIN = function (sys, N, flow_parameters = []){
    if (N==1){
        return sys;
    }
    let new_sys = _copy_system(sys);
    for (let i = 0; i<N-1; i++){
        let copy_sys = _copy_system(sys);
        _transform_postion_recursive(sys, [1,0]);
        _push_sys('forward', flow_parameters)(copy_sys)(new_sys);
    }
    DebugTOMap(new_sys);
    return new_sys
}

/*
 * @arg fusion_map = { psys1name : [csys1name, csys2name] , psys2name : [csys1name, csys2name...]} 
 * sys = system
 * N = number of fusions
 */
const PATTERN = function (sys, fusion_map, N){
    if (N==1){
        return sys;
    }
    let old_sys = _copy_system(sys);
    let saved_sys = old_sys
    let displacement = [1,0]
    for (let i = 0; i<N-1; i++){   
        let new_sys = _copy_system(old_sys)
        let reference_new_sys_ID = new_sys.ID
            
        _transform_postion_recursive(new_sys, displacement);
    
        /**
         *       o --- o                      o --- o 
         *      /        \                   /        \
         *     o --- o ---o (tail)    (head) o --- o ---o
         * 
         *          S1                          S2
         * 
         * 
         *     We have to replace head of S2 with tail of S1
         *   
         */

        head_name_ids_map = _search_by(new_sys, 'NAME', Object.keys(fusion_map))
        tail_name_ids_map = _search_by(old_sys, 'NAME', Object.values(fusion_map))

        let relocate_tracker = {}

        for (sys_name in head_name_ids_map) {
            head = head_name_ids_map[sys_name]

            tail = tail_name_ids_map[fusion_map[sys_name]]
            relocate_tracker[head] = tail
        }
        
        for (head in relocate_tracker) {
            tail = relocate_tracker[head]
            if (head === reference_new_sys_ID){
                new_sys = sys_by_id[tail]
                reference_new_sys_ID = relocate_tracker[head]
                // fusion_map[sys_name]
            }
            _relocate_sys(sys_by_id[head], sys_by_id[tail], relocate_tracker)
        }
        old_sys = new_sys
    }
    return saved_sys
}

function MESH(sys, m, n, xflow = [], yflow = [], options = {}){
    let new_sys = bypassSystem(sys, {NAME : "Meshed" + sys.NAME})
    let copy_sys = CHAIN(sys, n, xflow);
    
    if (m == 1){
        SIMPLECONNECT (new_sys) (copy_sys)
        return new_sys;
    }
    for (let i = 0; i<m-1; i++){

        SIMPLECONNECT (new_sys)(copy_sys);
        // CONNECT (new_sys).apply(null, xflow)(copy_sys)

        let sys_iterator_initial = copy_sys;
        copy_sys = _copy_system(copy_sys);
        let sys_iterator_final = copy_sys;

        _transform_postion(sys_iterator_final, [0,1]);
        for(let j = 0; sys_iterator_final.TO.length >0; j++){
            sys_iterator_final.TO.forEach(elementouter_id => {
                let elementouter = sys_by_id[elementouter_id]
                _transform_postion(elementouter, [0,1]);
            });

            // SIMPLECONNECT (sys_iterator_initial) (sys_iterator_final);
            CONNECT (sys_iterator_initial).apply(null, yflow) (sys_iterator_final)
            sys_iterator_final = sys_by_id[sys_iterator_final.TO[0]];
            sys_iterator_initial = sys_by_id[sys_iterator_initial.TO[0]];
        }
        SIMPLECONNECT (sys_iterator_initial) (sys_iterator_final);

        if (options.loopback === true) {
            CONNECT (sys_iterator_final).apply(null, yflow) (copy_sys)
        }
    }
    
    SIMPLECONNECT (new_sys)(copy_sys);
    DebugTOMap(new_sys);
    return new_sys;    
}

const COPY = _copy_system

const PROCESS = function(function_def){
    return (async function (S){with (S){
        function_def()
    }})
}

module.exports = {
    _run_system,
    CHAIN,
    STACK,
    MESH,
    COPY,
    PROCESS,
    _copy_object,
    SYSTEM,
    CONNECTIONS,
    CONNECT,
    list_of_objs,
    sys_by_id,
    SIMPLECONNECT,
    BICONNECT,
    _push_sys,
    _with_endpoints_sys,
    _search_by,
    PATTERN,
    DebugAny,
}