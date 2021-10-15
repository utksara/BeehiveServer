const { json } = require("express");
const fs = require("fs");
var {colorMap} = require('./calc.js')
var _  = require('lodash');

const {sys_by_id} = require('./beehive')

const register = async function (jsonobj, sys){

    let f1 = async (element) => {
        element._param = element._param?element._param:{};
        return await element.TOPOLOGY(element._param).generate()
    } 

    let f2 = async () => {
        for (viselement of sys.VISUALIZE ){
            await f1(viselement).then(value => {
                jsonobj.push({
                    "id" : "shape" + sys.ID,
                    "svg" : value,
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