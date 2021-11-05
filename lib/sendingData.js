const { json } = require("express");
const fs = require("fs");
const shapes = require('./shapes.js');
var {colorMap} = require('./calc.js');
var _  = require('lodash');

const {sys_by_id} = require('./beehive');
const { all } = require("bluebird");

const register = async function (jsonobj, system){

    let intialise_vis_object = async (element) => {
        console.log("pusheeen intialise_vis_object");
        let otherwise;
        otherwise = element.POSITION ? element.POSITION : element._param.center;
        element._param.center = system[element.POSITION] ? system[element.POSITION] : otherwise;
        element._param.movement = system[element.MOVEMENT] ? shapes.array_to_movement(system[element.MOVEMENT]):"";
        return await element.GEOMETRY(element._param).generate();
    } 

    let assign_color_each = async (viselement, svg) => {
        if (viselement.LIGHT){
            stroke = 'rgb(100, 200, 255)';
        }
        else{
            stroke = viselement.maxval ? colorMap(system[viselement.REPRESENTS], viselement.maxval, viselement.minval) : colorMap(system[viselement.REPRESENTS])
        }
        jsonobj.push({
            "id" : "shape" + system.ID,
            "svg" : svg,
            "fill" : viselement.color? viselement.color:'none',
            "stroke" : stroke,
            "width" : 1
        });
    }

    /**Here is the problem */
    let assign_colors = async (viselements, svgs) =>{
        let all_colors = []
        for (i = 0; i < viselements.length ; i++){
            let viselement = viselements[i]
            let svg = svgs[i]
            await assign_color_each(viselement, svg);
        }
        // await Promise.all(all_colors);
        console.log("pusheen returning json object");
        return jsonobj;
    }

    let update_vis_object = async () => {
        let promises = []
        let viselements = []
        for (i = 0; i < system.VISUALIZE.length; i++ ){
            let viselement = system.VISUALIZE[i]
            promises.push(intialise_vis_object(viselement))
            viselements.push(viselement)
        }
        console.log("pusheen resolving intialise_vis_object");
        let svgs = await Promise.all(promises);
        console.log("pusheen calling assign_colors");
        return await assign_colors(viselements, svgs);
    }
    return await update_vis_object();
}


colorMap("1")
module.exports = {
    register,
}