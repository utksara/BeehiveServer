const { json } = require("express");
const fs = require("fs");
const shapes = require('./shapes.js');
var {colorMap} = require('./calc.js');
var _  = require('lodash');

const {sys_by_id} = require('./beehive')

const register = async function (jsonobj, system){

    let f1 = async (element) => {

        //  console.log("pusheeen ", element)
        let otherwise;
        otherwise = element.POSITION ? element.POSITION : element._param.center;
        element._param.center = system[element.POSITION] ? system[element.POSITION] : otherwise;
    
        element._param.movement = system[element.MOVEMENT] ? shapes.array_to_movement(system[element.MOVEMENT]):"";
        return await element.GEOMETRY(element._param).generate();
    } 

    let f2 = async () => {
        let promises = []
        let viselements = []
        for (i = 0; i < system.VISUALIZE.length; i++ ){
            let viselement = system.VISUALIZE[i]
            promises.push(f1(viselement))
            viselements.push(viselement)
        }
        let svgs = await Promise.all(promises)
        
        for (i = 0; i < viselements.length ; i++){
            let viselement = viselements[i]
            let svg = svgs[i]
            if (viselement.LIGHT){
                stroke = 'rgb(100 , 200, 255)';
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
    }

    await f2();
    return jsonobj;
}


colorMap("1")
module.exports = {
    register,
}