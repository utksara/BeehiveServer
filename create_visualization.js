import * as beehive from './lib/beehive.js'

function _render(system) {
    document.getElementById(ssy.ID).setAttribute('points', get_points(system.topology));
}
const xmlns = "http://www.w3.org/2000/svg";

function init_setup(){
    document.getElementById("canvas").setAttribute('height',600);
    document.getElementById("canvas").setAttribute('width',1050);
    // Array_of_shapes.forEach ( (system) =>_render(system))
    beehive.Array_of_shapes.forEach( (system)=> {
        var g = document.createElementNS(xmlns, system.ID);
        var cntr1 = document.createElementNS(xmlns, "path");
        // cntr1.setAttributeNS(null, 'id', "cntr1");
        // cntr1.setAttribute(null, 'fill');
        // cntr1.setAttributeNS(null, 'd', event.data);
        // g.appendChild(cntr1);
        var svgContainer = document.getElementById("canvas");
        svgContainer.appendChild(g);
    
        // list_of_items.push(new item('cntr1', new shapes.anything(event.data)));
    });
}

let break_sim = true;
init_setup();

function simulate(){
    if (!break_sim){
        beehive.Array_of_shapes.forEach ( (system) =>_render(system))
    }
}
setInterval(simulate, 10);

// document.getElementById("contourmesh").onclick = function() {
//     // ws.send("cell_membrane ")
//     let values = get_item_by_id('cell').shape.center.toString();
//     let boundary = get_item_by_id('cell').shape.string_of_points;
//     var msg = {
//         "functname" : "traction",
//         "values" : {
//             "displacement" : "",
//             "boundary" : boundary,
//             "theta" : 0
//         }
//     };
//     ws.send(JSON.stringify(msg));
//     // ws.send(get_item_by_id('cell').shape.get_points());
// }
