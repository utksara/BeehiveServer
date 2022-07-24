const { _is_sys } = require("../objectUtils");
const { sys_by_id, edge_by_id } = require("./globalParameters");

const fulfills = (system, conditions = [], operation = "and") =>{
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
            // system.condition = condition
            with(system){
                if (operation ===  "and")
                {
                    result_ =  result_ && eval(condition)
                    // return false;
                }
                if (operation ===  "or")
                {
                    result_ =  result_ || eval(condition)
                    // return true;
                }
            }
        } catch (error) {
            // console.log(error)
            return false;
        }
    });

    // console.error("invalid argument 'operation', should be end or  but provided as", operation)
    return result_;
}


/**
 * 
 * @param {SYSTEM, SYSTEM ID} system 
 * @param {Array of String with logical expressions composed of a SYSTEM's parameters} node_conditions 
 * @param {String of any name} signature 
 * @returns 
 */
 const filter_systems = function(system, node_conditions = [], operator , signature = "sog") {
    if (typeof system === 'string')
        system = sys_by_id[system]
    else if (!_is_sys(system)){
        console.error(" incorrect value of first arguement, should be a valid system or system ID")
    }
    
    let visited = [];
    let traversal = [];
    let clusters = []; 

    function _dfsTraverse(system){
        traversal.push(system["ID"])
        visited.push(system.ID)
        system.TO.forEach(subsys_id => {
            let subsys = sys_by_id[subsys_id]
            if (!visited.includes(subsys.ID)){
                if (fulfills(subsys, node_conditions, operator)){
                    edge_by_id[system.ID][subsys_id].push(signature)
                    clusters.push(subsys_id)
                }     
                _dfsTraverse(subsys)
            }
        });
    }
    _dfsTraverse(system)
    return [clusters, signature];
}

module.exports = {
    filter_systems,
}