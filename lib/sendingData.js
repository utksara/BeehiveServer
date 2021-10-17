const { json } = require("express");
const fs = require("fs");
const shapes = require('./shapes.js');
var {colorMap} = require('./calc.js');
var _  = require('lodash');

const {sys_by_id} = require('./beehive')

const register = async function (jsonobj, sys){

    let f1 = async (element) => {
        let otherwise;
        otherwise = element.POSITION ? element.POSITION : element._param.center;
        element._param.center = sys[element.POSITION] ? sys[element.POSITION] : otherwise;
    
        element._param.movement = sys[element.MOVEMENT] ? shapes.array_to_movement(sys[element.MOVEMENT]):"";
        return await element.GEOMETRY(element._param).generate();
    } 

    let f2 = async () => {
        for (viselement of sys.VISUALIZE ){
            await f1(viselement).then(svg => {
                jsonobj.push({
                    "id" : "shape" + sys.ID,
                    "svg" : svg,
                    "fill" : viselement.color? viselement.color:'none',
                    "stroke" : viselement.maxval ? colorMap(sys[viselement.REPRESENTS], viselement.maxval, viselement.minval) : colorMap(sys[viselement.REPRESENTS]),
                    "width" : 1
                });
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