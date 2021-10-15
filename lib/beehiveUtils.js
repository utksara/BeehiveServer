let list_of_objs = [];
let vis_objs = [];
let sys_by_id = {};
let edge_by_id = {};

const dfsTraverse = function(sys, param = "ID") {
    let visited = []
    let traversal = []
    function _dfsTraverse(sys){
        traversal.push(sys[param])
        visited.push(sys.ID)
        sys.TO.forEach(sub_sys => {
            if (!visited.includes(sub_sys.ID)){
                _dfsTraverse(sub_sys)
            }
        });
    }
    _dfsTraverse(sys)
    return traversal;
}

const bfsTraverse = function (sys, func = (sys) => {console.log(sys.ID)}){
    traversal_array = [sys.ID]
    visited = []
    while(traversal_array.length > 0 ){
        thissys = sys_by_id[traversal_array[0]]
        traversal_array.splice(0,1)
        func(thissys)
        thissys.TO.forEach(child => {
            if (!visited.includes(child.ID) ){
                visited.push(child.ID)
                traversal_array.push(child.ID)
            }
        }); 
    }
}

module.exports = {
    dfsTraverse,
    bfsTraverse,
    list_of_objs,
    vis_objs,
    sys_by_id,
    edge_by_id,
}
