const fs = require('fs');
const _ = require('lodash');
const { collect } = require('./visualization.js');
const shapes = require('./shapes.js');
const config = require('./../config.json');
const beehiveUtils = require('./beehiveUtils');
const globalParameters = require('./core/globalParameters.js');
const objects = require('./Objects');
const { execProm, colorMap } = require('./calc.js');
const {_is_obj, _is_sys, is_metric_parameter} = require('./objectUtils.js');
const { cond } = require('lodash');

// const {loggerCreator} = require('./../loggerConfig.js');

const message_prefix = 'beehive : ';
// const logger = loggerCreator(message_prefix);

let no_of_digits = 5;

let list_of_objs = globalParameters.list_of_objs;
let vis_objs = globalParameters.vis_objs;
let sys_by_id = globalParameters.sys_by_id;
let execution_order = globalParameters.execution_order;
let edge_by_id = globalParameters.edge_by_id;
let global_id = globalParameters.global_id;

const DEBUG = config.DEBUG;
const DEBUGPROCESSES = DEBUG && config.DEBUGPROCESSES;
const DEBUGSYSTEMS = DEBUG && config.DEBUGSYSTEMS;
const DEBUGPARAMS = DEBUG && config.DEBUGPARAMS;
const DEBUGVISOBEJCT = DEBUG && config.DEBUGVISOBEJCT;

const Debug = debugval =>{
    if(debugval) return console.log;
    else return ()=>{};
};

const DebugAny = Debug(DEBUG);
const DebugProcesses = Debug(DEBUGPROCESSES);
const DebugSystems = Debug(DEBUGSYSTEMS);
const DebugParams = Debug(DEBUGPARAMS);
const DebugVisObject = Debug(DEBUGVISOBEJCT);

const DebugTOMap = (system)=>{
    let iter = 0
    let msg = ""
    let sample_sys = system;
    while(sample_sys.TO.length > 0 && iter < 100){
        iter+=1
        msg+= sample_sys.NAME + "_" + sample_sys.ID + "-->";
        sample_sys = sys_by_id[sample_sys.TO[0]]
    }
    msg+= sample_sys.NAME + "_" + sample_sys.ID;
    DebugSystems("CHAIN")
    DebugSystems(msg);
} 

const DebugTOAll = (system)=>{
    let msg = ""
    system.forEach(tosys => {
        console.log(tosys)
        msg+= tosys.NAME + "_" + tosys.ID + " | ";
    });
    DebugSystems("PARALLEL PROCESSING");
    DebugSystems(msg);
}

const DebugParamValues = (system_id)=>{
    let system = sys_by_id[system_id]
        
    for (key in system){    
        if (is_metric_parameter(key)){
            DebugParams(system_id, " : ", key, " :: ", system[key]);
        }
    } 

    DebugParams("\n");
}

const _all_preceding_syss_ran  = function(system){
    if (system.run_status == false){
        let vall = _.reduce(Array.from(system.preceding_syss), function(result, value) {
            return result && sys_by_id[value].run_status;
        }, true);
        return vall;
    }
    else{
        return false;
    }
}

let _push_sys = (direction, flow_parameters = []) =>{
    return (sys_to_be_pushed)=>{
        if (direction === 'forward'){
            return (P)=>{
                P = _with_endpoints_sys(P)
                P.endpoints.forEach(sys_id => {
                    let system = sys_by_id[sys_id]
                    CONNECT (system).apply(null, flow_parameters)(sys_to_be_pushed);
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

function _search_by(system, by, values){
    sys_by = {};
    _dfs_search(system, by, values, sys_by);
    return sys_by;
}

function _dfs_search(system, by, values = [], accum = {}){

    for (let i = 0; i < values.length; i++){
        let value = values[i]
        if (value === system[by]){
            accum[value] = system.ID;
            values.splice(i,1);
        }
    }
    system.TO.forEach( subsys_id => {
        let subsys = sys_by_id[subsys_id]
        _dfs_search(subsys, by, values, accum);
    });
}

let _with_endpoints_sys = function(system){
    let sample_sys_id, temp_sys_id;
    if (typeof system.endpoints === 'undefined' || system.endpoints.length === 0){
        sample_sys_id = [system.ID];
    }else{
        sample_sys_id = system.endpoints
    }
    temp_sys_id = sample_sys_id
    while(sys_by_id[temp_sys_id[0]].TO.length > 0){
        sample_sys_id = sys_by_id[temp_sys_id[0]].TO;
        temp_sys_id = sys_by_id[temp_sys_id[0]].TO
    }
    system.endpoints = sample_sys_id;
    return system;
}


const _isE_elementary_sys = function (S) {
    if (_is_sys(S)){
        if (S.TO.length === 0)
            return true;
        else return false;
    }else return false;
}

const _transform_position = function (system, coordinates){
    if (_is_sys(system)){
        system.VISUALIZE.forEach(element => {
            // element._param.center = () => {[element._param.center()[0] + coordinates[0], element._param.center()[1] + coordinates[1]] }
        });
    }else{
        throw (system, " is not a system")
    }

}

const _transform_position_recursive = function (system, coordinates){
    let eff = function (S) {
        _transform_position(S, coordinates);
    }
    beehiveUtils.bfsTraverse(system, eff);
    
}


let _new_id = (() => {
    let numstr = (beehiveUtils.global_id).toString()
    if (no_of_digits - numstr.length < 0) {
        throw(" Maximum number of systems reached! Only 10000 systems are allowed per run")
    }
    beehiveUtils.global_id+=1;
    return (new Array(no_of_digits - numstr.length).fill("0")).join('') +  numstr
});

async function run_system(system_id, fullfillment_criteria,
results = {
    geometric_data:{
        lines : [],
        curves : [],
        vectors : []
    }
}){

    let system;
    if (typeof (system_id) === 'string'){
        system = sys_by_id[system_id]
    }else if(_is_sys(system_id)){
        system = sys_by_id
    }else{
        console.err("Invalid arguement ", system)
    }

    if (config.ADD_TRACER ){    
        execution_order.push({NAME: system.NAME, ID: system.ID})
    }

    DebugParamValues(system.ID)
    
    /**
     * Execution of each process within the current system
     */
    _.forEach(system.PROCESSES, async process =>{
        DebugProcesses("processing ", system.ID);
        await process(system);
    });
    system.run_status = true;
                

    /**
     * The current system shares its parameters to all child system
     */
    _.forEach(system.TO, (subsys_id)=>{
        let subsys = sys_by_id[subsys_id];
        try{
            _.forEach(subsys.REQUIRE, (input) => {
                if (edge_by_id[system.ID][subsys.ID].includes(input) || edge_by_id[system.ID][subsys.ID].length === 0){
                    DebugProcesses("equating",  `${subsys.ID}`, "and", `${system.ID}`, "for", input);
                    subsys[input] = system[input] ? system[input] :  subsys[input];
                    DebugProcesses("value of",  `${subsys.ID}.${input}`, "is", subsys[input]);
                }
            })
        }
        catch(err){
            console.error(err);
        }
    });


    /**
     * Now child processes executes recursively
     */
    try {
        if (system.TO.length > 0){
            _.reduce(system.TO, async function(result, subsys_id){
                let subsys = sys_by_id[subsys_id];
                if(fullfillment_criteria(subsys)){
                    run_system(subsys_id, fullfillment_criteria, results );
                }
                return result;
            }, []);
        }else{
            DebugProcesses("no sub process for ", system.ID);
        }
        
    } catch (error) {
       console.error(error);
    }

    collect (system, vis_objs);
}

function _copy(I){
    if (_is_sys(I)){
        return _copy_system(I);
    }else if (_is_obj(I)){
        return _copy_object(I);
    }else if (Array.isArray(I)){
        return _copy_array(I);
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
                        const new_child = _copy_system(child, corresponding_system) 
                        corresponding_system[child.ID] = new_child.ID;
                        SIMPLECONNECT (Z)(new_child)
                        edge_by_id[Z.ID][new_child.ID] = edge_by_id[S.ID][child.ID]
                });
            }
            else if (Object.keys(corresponding_system).includes(element) ){
                Z[element] = corresponding_system[element];
            }else{
                Z[element] = _copy(S[element]);
            }

        }

        Z.run_status = false;
    }
    return Z;
}

function bypassSystem(system, params = {}){
    params.REQUIRE = system.REQUIRE
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

let SYSTEM = function(initializer = {}){
    initializer.ID = _new_id()
    initializer.PROCESSES = initializer.PROCESSES ? initializer.PROCESSES : []
    initializer.REQUIRE = initializer.REQUIRE ? initializer.REQUIRE : []
    initializer.VISUALIZE = initializer.VISUALIZE ? initializer.VISUALIZE : []
    initializer.TO = initializer.TO ? initializer.TO : []
    initializer.view_scale = initializer.view_scale ? initializer.view_scale : 2 

    if (initializer.VISUALIZE.length > 0){
        for (let i = 0; i <initializer.VISUALIZE.length; i++){
            initializer.VISUALIZE[i] = beehiveUtils.VISOBJECT(initializer.VISUALIZE[i])
            element = initializer.VISUALIZE[i]
            element._param = {}
            element.POSITION = element.POSITION ? element.POSITION : shapes._init_pos();
            // if ( typeof  element.POSITION == 'string' || element.POSITION  instanceof String){
            //     try {
            //         array_allocation(element, initializer[element.POSITION]);
            //     } catch (error) {
            //         console.error(error);   
            //     }
            // }else array_allocation(element, element.POSITION)
            element._param.movement = element.MOVEMENT ? initializer[element.MOVEMENT] : "100, 100, 100, 100,,,,,"
        }
    }
    // param.requirement_status = _.reduce(param.REQUIRE, function(result, requirement){
    //     result[requirement] = false;
    //     return result;
    // }, {});
    initializer.preceding_syss = new Set();
    initializer.run_status = false;

    sys_by_id[`${initializer.ID}`] = initializer;
    list_of_objs.push(initializer);

    const message = 'system created' + JSON.stringify(initializer);
    // createlog(message);
    return initializer;
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
                // Towards[j].preceding_syss[From[i].ID] = false;
                Towards[j].preceding_syss.add(From[i].ID)
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
                    // Towards[j].preceding_syss[From[i].ID] = false;
                    Towards[j].preceding_syss.add(From[i].ID)
                    From[i] = _with_endpoints_sys (From[i])
                }
            }
        }   
    }
}

const PAIRUP = function (sys1, sys2, flow_parameters = []){
    let traversal1 = []
    beehiveUtils.bfsTraverse(sys1, (system, accum)=>{
        accum.push(system.ID)
    }, traversal1)
    let index = 0
    beehiveUtils.bfsTraverse(sys2, (system)=>{
        CONNECT (sys_by_id[traversal1[index]]).apply(null, flow_parameters) (sys_by_id[system.ID])
        index+=1
    })
}

const STACK = function (system, N, flow_parameters = []){
    let new_sys = bypassSystem(system, {NAME : "Shelved" + system.NAME})
    let prev_sys
    let copy_sys
    for (let i = 0; i<N; i++){
        copy_sys = _copy_system(system);
        if (i > 0){
            PAIRUP(prev_sys, copy_sys, flow_parameters)
        }
        SIMPLECONNECT (new_sys) (copy_sys); 
        prev_sys = copy_sys
        let sys_iterator = copy_sys;
        _transform_position_recursive(sys_iterator, [0,8]);
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

const RUNSIMULATION = async function (simulation_to_run, fullfillment_criteria = _all_preceding_syss_ran){
    try{

        let starting_system = simulation_to_run.Sparent;
        let main = simulation_to_run.main;

        shapes._reset()
        await main();

        let divergence_function;
        await run_system(starting_system.ID, fullfillment_criteria, divergence_function);
        
        let interm_vis_objs = objects.NESTED_TABULAR_OBJECT({
            'point':{
                'center':[], 
                'length':[],
                'quantity' :[]
            }
        })

        vis_objs.forEach(vis_obj => {
            interm_vis_objs.add(objects.morph(vis_obj, {
                    "shape_type":["center", "length", "quantity"]
            }))
        });

        DebugVisObject(interm_vis_objs.point.quantity)

        let getColorMap = (value, max_quant, min_quant) => {
            if(value === 'true'){
                value = 'magnitudeless';
            }else{
                value = Number(value);
            }
            return colorMap(value, max_quant, min_quant);
        }

        let calculate_all = async (interm_vis_objs) =>{
            let data_length = interm_vis_objs.point.center.length
            let processed_vis_objs = {
                "id" : [],
                "svg" : [],
                "fill" : [],
                "stroke" : [],
                "width" : []
            }
            let cpp_input = `./cpp_bins/main multiline contagious "`
            
            let max_quant = -100000, min_quant = 100000;

            for (let i = 0; i < data_length; i++){
                
                cpp_input += interm_vis_objs.point.center[i] + ' 0.52 ' + interm_vis_objs.point.length[i] + ' '
                if(Number(interm_vis_objs.point.quantity[i]) > max_quant) {max_quant = interm_vis_objs.point.quantity[i]}
                if(Number(interm_vis_objs.point.quantity[i]) < min_quant) {min_quant = interm_vis_objs.point.quantity[i]}
                processed_vis_objs.fill[i] = 'none'
                processed_vis_objs.id[i] = `shape${i}`
                processed_vis_objs.width[i] = '1'

            }

            cpp_input += '"';

            let x = execProm(cpp_input)
            let cpp_output = (await x).stdout.split("  ");

            for (let i = 0; i < data_length; i++){
                let coords = cpp_output[i].split(" ")
                // let coords = ["", ""]
                processed_vis_objs.svg[i] = 'M ' + coords[0] + ' ' + coords[1] + " Z";
                processed_vis_objs.stroke[i] = getColorMap(interm_vis_objs.point.quantity[i], max_quant, min_quant)
            }
          
            return  objects.TABULAR_OBJECT(processed_vis_objs)
        }

        let svg_data = (await calculate_all(interm_vis_objs)).enlist()

        return svg_data;

    }catch(err){
        console.error(err)
        return {}
    }
}

const CONNECTIONS = async function (main, starting_system){
    try{
        shapes._reset()
        main();
        await run_system(starting_system.ID, _all_preceding_syss_ran);
        fs.writeFileSync('inputoutput/output_data.json', JSON.stringify(vis_objs), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        })
        return vis_objs;
    }catch(err){
        console.log(err);
        return {}
    }
}

const CHAIN = function (system, N, flow_parameters = []){
    if (N==1){
        return system;
    }
    let new_sys = _copy_system(system);
    for (let i = 0; i<N-1; i++){
        let copy_sys = _copy_system(system);
        _transform_position_recursive(system, [1,0]);
        _push_sys('forward', flow_parameters)(copy_sys)(new_sys);
    }
    DebugTOMap(new_sys);
    return new_sys
}

/*
 * @arg fusion_map = { psys1name : [csys1name, csys2name] , psys2name : [csys1name, csys2name...]} 
 * system = system
 * N = number of fusions
 */
const PATTERN = function (system, fusion_map, N){
    if (N==1){
        return system;
    }
    let old_sys = _copy_system(system);
    let saved_sys = old_sys
    let displacement = [1,0]
    for (let i = 0; i<N-1; i++){   
        let new_sys = _copy_system(old_sys)
        let reference_new_sys_ID = new_sys.ID
            
        _transform_position_recursive(new_sys, displacement);
    
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
            }
            _relocate_sys(sys_by_id[head], sys_by_id[tail], relocate_tracker)
        }
        old_sys = new_sys
    }
    return saved_sys
}

function MESH(system, m, n, xflow = [], yflow = [], options = {}){
    let new_sys = bypassSystem(system, {NAME : "Meshed" + system.NAME})

    let copy_sys = CHAIN(system, n, xflow);
    
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

        _transform_position(sys_iterator_final, [0,1]);
        for(let j = 0; sys_iterator_final.TO.length >0; j++){
            sys_iterator_final.TO.forEach(elementouter_id => {
                let elementouter = sys_by_id[elementouter_id]
                _transform_position(elementouter, [0,1]);
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


const hierarchical = _all_preceding_syss_ran;
module.exports = {
    run_system,
    CHAIN,
    STACK,
    MESH,
    COPY,
    PROCESS,
    _copy_object,
    SYSTEM,
    RUNSIMULATION,
    CONNECT,
    list_of_objs,
    sys_by_id,
    SIMPLECONNECT,
    BICONNECT,
    _push_sys,
    _with_endpoints_sys,
    _search_by,
    hierarchical,
    PATTERN,
    DebugAny,
    CONNECTIONS,
}