const {execProm} = require('./calc.js');
const {safe_push, safe_append} = require('./beehiveUtils.js')
const _ = require('lodash');

const update_vis_element = function(vis_element){
    vis_element._param = vis_element.GEOMETRY(vis_element._param);
}

const mutator_intepret_point = (element, coords, system)=>{
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
        }else {unsuitable_type_error()}

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
    } else  {
        invalid_point_type_error()
    }
}

const mutator_intepret_represent = (element, quantity, system)=>{
    const invalid_quantity_type_error = () => {console.error("Unsuitable type found for quantity as ", quantity, " for vis_element ", element, "\n expected types : Number, string, array, actual type : ", typeof quantity)}
    if ( Array.isArray(quantity)){

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
        }else {unsuitable_type_error()}

        if (y_coord !== undefined){
            if (typeof y_coord || y_coord instanceof String){
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
    else if ( typeof  quantity == 'string' || quantity  instanceof String){
        if (Array.isArray(system[quantity])){
            try {
                intepret_represent(element, system[quantity], system);
            } catch (error) {
                console.error(error);   
            }
        }else if (typeof system[quantity] === 'number'){
            element._param.quantity = () => {return system[quantity]}
        }else{ invalid_quantity_type_error() }
        
    } else  {
        invalid_quantity_type_error()
    }
}

const register_3 = function(system, vis_data){
    try {
        system.VISUALIZE.forEach(vis_element => {
            
            mutator_intepret_point(vis_element, vis_element.POSITION, system)
            mutator_intepret_represent(vis_element, vis_element.REPRESENTS, system)
            update_vis_element(vis_element);

            let reduced_vis_element = {
                represent: vis_element.REPRESENTS
            }
            let not_include_vis_param_sub_element = ['generate']
            Object.keys(vis_element._param).forEach(vis_param_sub_element => {
                if (!not_include_vis_param_sub_element.includes(vis_param_sub_element) )
                reduced_vis_element[vis_param_sub_element] = vis_element._param[vis_param_sub_element]
            });

            vis_data.push(reduced_vis_element)
        });
    } catch (error) {
        console.error(error);
    }
}

let _get_rows  = (data, map = {}) =>{
    data[Object.keys(data)[0]]
}

point = {
    cpp :[
        {
            input_prefix: `./cpp_bins/main multiline contagious "`,
            input_order : ["center", "angle", "length"],
            input_suffix: `"`,
        },
    ],
    goodoldjs:[
        {
            center:1,
            
        }
    ]
}


reducabes_posting_order = {
    'point' : ["center", "angle", "length"]
}

mapables = {
    'point' : ["quantity"]
} 

cpp_input_prefix = {
    'point' : `./cpp_bins/main multiline contagious "`
}

cpp_input_suffix = {
    'point' : `./cpp_bins/main multiline contagious "`
}

let reduce_vis_element = async (vis_element, reduced_data) =>{
    if (!Object.keys(reduced_data).includes(vis_element.shape_type)) 
        reduced_data[vis_element.shape_type] = cpp_input_prefix[vis_element.shape_type];
    let posting_order = cpp_posting_order[vis_element.data_type]
    posting_order.forEach(vis_sub_element => {
        reduced_data[vis_element.shape_type] = reduced_data[vis_element.shape_type].slice(1) + vis_sub_element + ' ' + cpp_input_suffix[vis_element.shape_type]
    });
}

let map_vis_element = async (vis_element, reduced_data) =>{
    if (!Object.keys(reduced_data).includes(vis_element.shape_type)) 
        reduced_data[vis_element.shape_type] = {};
    mapables.forEach(vis_sub_element => {
        reduced_data[vis_element.shape_type][vis_sub_element] = {numerical_value :[], max_value : -100000, min_value : 100000};
    });
}


let reconcile = (data) => {

    _.mapKeys(data, function (){

    })

}

let map_to_svg_values = async (data) => {
    let vis_data = {}
    defaults = {}

    let iterables = ['quantity']
    let redubles = ['center']
    data.forEach(vis_element => {
        safe_push(vis_data, vis_element.represent, ) 
        if (vis_element.shape_type === "point"){
            let new_str = ""
            let order_to_post = 
            defaults = {"angle" : "0.52"}
            cpp_name = "multiline"
            new_str = `./cpp_bins/main ` + cpp_name + ` contagious "`;
            order_to_post.forEach(subelement => {
                if (defaults[subelement] === undefined){
                    new_str += data[subelement][i] + ` `;
                }else{
                    new_str += defaults[subelement];
                }
            });
        }

    });

    let final_vis_data = []

    for (let i = 0; i < vis_data.length; i++){
        let cmd = vis_data[i]
        final_vis_data = (await execProm(cmd)).stdout.split(" ");
    }
    
    return final_vis_data;
}


module.exports = {
    register_3,
    map_to_svg_values
}