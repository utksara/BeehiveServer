
const acquired_by = (childsys, parentsys) => {
    childsys.ACQUIRERS.forEach(id => {   
        if (id === parentsys.ID) {
            return true
        }
    });
    return false;
}

/**
 * 
 * @param {SYSTEM} system 
 * @param {String Array with Bool expressions} conditions 
 * @returns 
 */
const FILTER = (system, conditions)=>{

    let list_of_objs = accessListofSystems();
    let sys_by_id = accessSysbyID();

    list_of_objs.forEach(element => {    
        if (acquired_by(element, system)){
            Object.keys(conditions).forEach(element => {
                if (sys_by_id[element][element] !== conditions[element]){
                    return false; 
                }
            });  
        }  
    });

    return true;
    
}

const DYNAMICON = (system1, system2, conditions = {}) => {
    FILTER(system1)
}