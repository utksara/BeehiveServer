const { sys_by_id, edge_by_id } = require("./globalParameters.js");
const { _is_sys } = require("../objectUtils");

const removeFlow = (edge, flow) => {
    if (typeof(flow) === 'string'){
        let modfied_edge = edge.filter(function(value, index, arr){ 
            return value !== flow;
        });
        edge = modfied_edge;
        return modfied_edge;
    }if(Array.isArray(flow)){
        let modfied_edge = edge;
        flow.forEach(a_flow => {
            flow.splice(0,0)
            modfied_edge = modfied_edge.filter(function(value, index, arr){ 
                return value !== a_flow;
            }); 
        });
        edge = modfied_edge;
        return modfied_edge;
    }else{
        console.err("Invalid input flow, should be an array or string")
    }
}


const remove_flow_faster = (edge, flow) => {

    // console.log("YO ", edge.length)

    let flow_dict = {}
    edge.forEach(param => {
        flow_dict[param] = true; 
    });

    flow.forEach(param => {
        flow_dict[param] = false; 
    });

    let new_edge = []

    edge.forEach(param => {
        if (flow_dict[param] === true){
            new_edge.push(param)
        }
    });

    return new_edge;
} 

const addFlow = (edge, flow) => {
    if (typeof(flow) === 'string'){
        let modfied_edge = edge;
        modfied_edge.push(flow)
        return modfied_edge;
    }if(Array.isArray(flow)){
        let modfied_edge = edge.concat(flow);
        return modfied_edge;
    }else{
        console.err("Invalid input flow, should be an array or string")
    }
}

let fulfills_edges = (parent, child, conditions = [], operation = "and") =>{

    let result_ ;

    if (operation ===  "and")
    {
        result_ =  true;
    }
    if (operation ===  "or")
    {
        result_ =  false;
    }
    if (conditions.length === 0){
        return true;
    }
    conditions.forEach(condition => {
    try {
        if (operation ===  "and")
        {
            result_ =  result_ && eval(condition)
        }
        if (operation ===  "or")
        {
            result_ =  result_ || eval(condition)
        }
    } catch (error) {
        return false;
    }
        
    });

    // console.error("invalid argument 'operation', should be end or  but provided as", operation)
    return result_;
}

/**
 * 
 * @param {system under operation} system 
 * @param {write condition expression with child and parent prefixes (Example : conditions where property "U" of parent is always greater by one from that of child, the conition should be "parent.U == child.U + 1"} edge_conditions  
 * @param {and or condition} operator 
 * @param {to trace} signature 
 * @returns 
 */
 const filter_edges = function(system, edge_conditions = [], operator) {
    if (typeof system === 'string')
        system = sys_by_id[system]
    else if (!_is_sys(system)){
        console.error(" incorrect value of first arguement, should be a valid system or system ID")
    }
    
    let visited = [];
    let traversal = [];
    let clusters = []; 

    function _dfsTraverse(system){
        traversal.push(system["ID"]);
        visited.push(system.ID);
        system.TO.forEach(subsys_id => {
            // console.log("YO", system.ID, subsys_id);
            let subsys = sys_by_id[subsys_id];
            if (!visited.includes(subsys_id)){
                // visited.push(subsys_id);
                if (fulfills_edges(system, subsys, edge_conditions, operator)){
                    clusters.push([system.ID, subsys_id]);
                }     
                _dfsTraverse(subsys)
            }
        });
    }
    _dfsTraverse(system)


    console.log("YO traversal len", traversal.length, Object.keys(sys_by_id).length)
    return [clusters];
}

module.exports ={
    addFlow,
    removeFlow,
    remove_flow_faster,
    filter_edges,
}