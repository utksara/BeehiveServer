const _ = require('lodash');
const shapes = require('./shapes.js');

const update_vis_element = function(vis_element){
    vis_element._param = vis_element.GEOMETRY(vis_element._param);
}

const mutator_intepret_point = (element, system)=>{

    /**
     * allowed types in point:
     *  - array of size2
     *      - array of strings
     *      - array of numbers
     *  - string
     *      - string which is a parameter of given system
     */

    let coords = element.POSITION;
    let dx = element.dx? element.dx : 1;
    let dy = element.dy? element.dy : 1;
    const invalid_point_type_error = () => {console.error("Unsuitable type found for coords as ", coords, " for vis_element ", element, "\n expected types : Number, string, array, actual type : ", typeof coords)}
    if ( Array.isArray(coords)){

        let getx, gety, get_coords;
        let x_coord = coords[0]
        let y_coord = coords[1]
        if ( typeof  x_coord == 'string' || x_coord  instanceof String){
            try {
                getx = ()=> {return system.view_scale *system[x_coord].toFixed(2)/dx};
            } catch (error) {
                console.error(error);   
            }
        }else if ( typeof  x_coord == 'number'){
            try {
                getx = ()=> {return x_coord.toFixed(2)};
            } catch (error) {
                console.error(error);   
            }
        }else {invalid_point_type_error()}

        if ( typeof y_coord || y_coord instanceof String){
            try {
                gety = ()=> {return system.view_scale * system[y_coord].toFixed(2)/dy};
            } catch (error) {
                console.error(error);   
            }
        }else if ( typeof  y_coord == 'number'){
            try {
                gety = ()=> {return y_coord.toFixed(2)};
            } catch (error) {
                console.error(error);   
            }
        }else  {invalid_point_type_error()}
        element._param.center = () => {return [getx(), gety()]}

    } else if ( typeof  coords == 'string' || coords  instanceof String){
        try {
            intepret_point(element, system[coords], system);
        } catch (error) {
            console.error(error);   
        }
    } 
    else  {
        invalid_point_type_error()
    }
}

const _is_condition = (quantity) => {
    if (Array.isArray(quantity)){
        if (quantity.length === 2)
        if (quantity[1] === 'condition' && typeof quantity[0] === 'function'){
            return true;
        }
    }
    return false;
}

const _is_param_vector = (quantity) => {
    if (Array.isArray(quantity)){
        if (quantity.length >= 2)
        if (typeof quantity[0] === 'string' || typeof quantity[0] === 'number'){
            return true;
        }
    }
    return false;
}

const _is_param = (quantity) => {
    if (typeof  quantity === 'string' || quantity  instanceof String){
        return true
    }
    return false;
}

const mutator_intepret_represent = (element, system)=>{
    /**
     * allowed types in represent:
     *  - string
     *      - string which is a parameter of given system
     *  - array
     *      - array of params (a vector basically) 
     *      - condition function
     */

    let quantity = element.REPRESENTS;
    const invalid_quantity_type_error = () => {console.error("Unsuitable type found for quantity as ", quantity, " for vis_element ", element, "\n expected types : Number, string, array, actual type : ", typeof quantity)}
    if ( _is_param_vector(quantity)){

        element.GEOMETRY = shapes.vector;
        let getx, gety;
        let x_coord = quantity[0]
        let y_coord = quantity[1]
        if ( typeof  x_coord == 'string' || x_coord  instanceof String){
            try {
                getx = ()=> {return system[x_coord].toFixed(2)};
            } catch (error) {
                
                console.error(error);   
            }
        }else if ( typeof  x_coord == 'number'){
            try {
                getx = ()=> {return x_coord.toFixed(2)};
            } catch (error) {
                console.error(error);   
            }
        }else if (y_coord !== undefined){
            if (typeof y_coord === 'string' || y_coord instanceof String){
                try {
                    gety = ()=> {return system[y_coord].toFixed(2)};
                } catch (error) {
                    console.error(error);   
                }
            }else if ( typeof  y_coord == 'number'){
                try {
                    gety = ()=> {return y_coord.toFixed(2)};
                } catch (error) {
                    console.error(error);   
                }
            }else  {invalid_quantity_type_error()}
            element._param.quantity = () => {return [getx(), gety()]}
        }else{
            element._param.quantity = () => {return getx()}
        }

    }
    else if ( _is_param(quantity) ){
        element["GEOMETRY"] = shapes.point;
        if (Array.isArray(system[quantity])){
            try {
                intepret_represent(element, system[quantity], system);
            } catch (error) {
                console.error(error);   
            }
        }else if (typeof system[quantity] === 'number'){
            element._param.quantity = () => {return system[quantity]}
        }else{ invalid_quantity_type_error() }
        
    }else if (_is_condition(quantity)) {
        
        element.GEOMETRY = shapes.point;
        if (quantity[1] === 'condition'){
            if (quantity[0](system)){
                element._param.quantity = () => {return true}
                // element.shape_type = 'contour'
            }
            else {
                element._param.quantity = () => {return false}
                // element.shape_type = 'none'
            }
        }
        
    }
     else  {
        invalid_quantity_type_error()
    }
}

const push_vis_element = (vis_element, vis_data) => {
    let reduced_vis_element = {
        represent: vis_element.REPRESENTS
    }
    let not_include_vis_param_sub_element = ['generate']
    Object.keys(vis_element._param).forEach(vis_param_sub_element => {
        if (!not_include_vis_param_sub_element.includes(vis_param_sub_element) )
        reduced_vis_element[vis_param_sub_element] = vis_element._param[vis_param_sub_element]
    });

    vis_data.push(reduced_vis_element)
}

const has_to_be_pushed = (vis_element)=> {
    if (vis_element._param.quantity() !== false){    
        return true;   
    }
    return false;
}

const collect = function(system, vis_data){
    try {
        system.VISUALIZE.forEach(vis_element => {
            
            mutator_intepret_point(vis_element, system)
            mutator_intepret_represent(vis_element, system)
            if (has_to_be_pushed(vis_element))
            {
                update_vis_element(vis_element);
                push_vis_element(vis_element, vis_data);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    collect,
}