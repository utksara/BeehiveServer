const shapes = require('./shapes.js');
var {colorMap} = require('./calc.js');


const register = async function (jsonobj, system, merged_svg){

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
            all_colors.push(assign_color_each(viselement, svg))
            await assign_color_each(viselement, svg);
        }
        // await Promise.all(all_colors);
        return jsonobj;
    }

    let update_vis_object = async (merged_svg) => {
        let svgs = "";
        let viselements = []
        let svg_iterator = 0;
        for (i = 0; i < system.VISUALIZE.length; i++ ){
            if (merged_svg[svg_iterator] === " "){
                svg_iterator +=1;
            } 
            svgs.push("M " + merged_svg[svg_iterator] + " " +  merged_svg[svg_iterator+1] + " Z")
        }
        return await assign_colors(viselements, svgs);
    }
    
    return await update_vis_object(merged_svg);
}

colorMap("1")
module.exports = {
    register
}