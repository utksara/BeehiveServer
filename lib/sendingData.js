const { json } = require("express");
const fs = require("fs");
const shapes = require('./shapes.js');
var {colorMap} = require('./calc.js');
var _  = require('lodash');

const {sys_by_id} = require('./beehive')

const register = async function (jsonobj, sys){

    let f1 = async (element) => {

        //  console.log("pusheeen ", element)
        let otherwise;
        otherwise = element.POSITION ? element.POSITION : element._param.center;
        element._param.center = sys[element.POSITION] ? sys[element.POSITION] : otherwise;
    
        element._param.movement = sys[element.MOVEMENT] ? shapes.array_to_movement(sys[element.MOVEMENT]):"";
        return await element.GEOMETRY(element._param).generate();
    } 

    let f2 = async () => {
        let promises = []
        let viselements = []
        for (i = 0; i < sys.VISUALIZE.length; i++ ){
            let viselement = sys.VISUALIZE[i]
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
                stroke = viselement.maxval ? colorMap(sys[viselement.REPRESENTS], viselement.maxval, viselement.minval) : colorMap(sys[viselement.REPRESENTS])
            }
            jsonobj.push({
                "id" : "shape" + sys.ID,
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