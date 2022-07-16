const beehiveUtils = require('./beehiveUtils');

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

let sys_by_id = beehiveUtils.sys_by_id;


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

let is_metric_parameter = (key) => {
    return !(_optional_params.includes(key) || _core_params.includes(key))
}

module.exports = {
    _is_obj,
    _is_sys,
    is_metric_parameter,
}