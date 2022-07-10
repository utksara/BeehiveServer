const transform = (function_map, obj) => {
    let new_table_object = TABULAR_OBJECT(obj._get_showables())
    obj._get_showables().forEach(param => {
        new_table_object[param] = function_map[param](obj[param])
    });
    return new_table_object
}

const enlist = (obj) => {
    let data_list = []
    let data_length = obj.length()
    for (var i = 0; i<data_length; i++){
        single_object = {}
        obj._get_showables().forEach(key => {
            single_object[key] = obj[key][i] 
        });
        data_list.push(single_object)
    }
    return data_list  
}

const _INHERITER = (params = {}, initializer ={})=>{
    Object.keys(params).forEach(key => {
        initializer[key] = params [key]
    });
    return initializer;
}

const _OBJECT = (params = {})=>{
    let basic_object = {
        _not_showables : [],
        _updated : false,
        _get_showables : () => {
            if (basic_object._showable_object === undefined || basic_object._updated === true){
                basic_object._showable_update()
            }
            return Object.keys(basic_object._showable_object)
        },
        _get_showable_object : () => {
            if (basic_object._showable_object === undefined || basic_object._updated === true){
                basic_object._showable_update()
            }
            return basic_object._showable_object
        },
        _showable_update : () =>{
            basic_object._showable_object = {}
            basic_object._updated = false
            basic_object._not_showables.push("_not_showables", "_showable_object", "show_object", "_updated", "_get_showables", "_showable_update", "_get_showable_object")
            Object.keys(basic_object).forEach(element => {
                if (!basic_object._not_showables.includes(element)){
                    basic_object._showable_object[element] = basic_object[element]
                }
            });
        },
        show_object : ()=> {
            if (basic_object._showable_object === undefined || basic_object._updated === true){
                basic_object._showable_update()
            }
            console.log(basic_object._showable_object)
        }
    }
    return _INHERITER(params, basic_object)
}

let TABULAR_OBJECT = (params = [])=> {
    
    let tabular_object = _OBJECT({
        _not_showables : ["add", "length", "enlist", "transform"],
        add : (entry) => {
            Object.keys(entry).forEach(param => {
                tabular_object[param].push(entry[param])
            });
        },
    })

    if (Array.isArray(params)){
        params.forEach(param => {
            tabular_object[param] = []
        });
    }else{
        let key_length = -1
        Object.keys(params).forEach(key => {
            if (Array.isArray(params[key])){
                if (key_length === -1){
                    key_length = params[key].length
                }else if (key_length !== params[key].length) {
                    let statetement = "unequal arrays in tabular object initializer " + JSON.stringify(params)
                    throw new Error(statetement)
                }
                tabular_object[key] = params[key]
            }else{
                tabular_object[key] = [params[key]]
            }
        });
    }


    tabular_object.length = () =>{
        let main_key = tabular_object._get_showables()[0]
        return tabular_object[main_key].length
    }

    tabular_object.enlist = () =>{
        return enlist(tabular_object)  
    }

    tabular_object.transform = (function_map) => {
        return transform(function_map, tabular_object)
    }
    return tabular_object
}

let NESTED_TABULAR_OBJECT = (params = {})=>{ 

    let parent = _OBJECT(params)
    parent._not_showables = ["add", "length", "enlist", "transform"]
    parent.add = (data) =>{
        let f = (obj, data) =>{
            if (Object.keys(obj).length > 0 && !Array.isArray(obj)){
                Object.keys(data).forEach(key => {
                    f(obj[key], data[key])
                });
            }else{
                if (Array.isArray(data)){
                    data.forEach(element => {
                        obj.push(element)
                    });
                }else{
                    obj.push(data)
                }
            }
        }
        f(parent, data)
    }
    return parent;
}

const transform_to = (objfrom, function_map) => {
    let new_obj = {}
    Object.keys(function_map).forEach(key => {
        new_obj[key] = function_map[key](objfrom)
    });
    return new_obj
}

const morph = (obj_list, form) =>{

    let length_ = obj_list.length
    let new_object = {}
    let f = (obj, data) =>{
        if (typeof data === 'object' && data !== null && !Array.isArray(data)){
            Object.keys(data).forEach(key => {
                obj[obj_list[key]] = {}
                f(obj[obj_list[key]], data[key])
            });
        }else{
            for(var i = 0; i<data.length; i++){
                obj[data[i]] = [obj_list[data[i]]]
            }
        }
    }
    f(new_object, form)

    return new_object
}


module.exports = {
    TABULAR_OBJECT,
    NESTED_TABULAR_OBJECT,
    morph,
    transform_to,
}