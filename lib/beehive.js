const _ = require('lodash');

let Array_of_sys = []

async function _form_connections(connections, list_of_objs){
    
}

async function _run_System(sys){
    await (async ()=>{
        Array_of_sys.push(sys)
        let proc_runs = []
        _.forEach(sys.PROCESS, (process)=>{
            console.info("processing ", sys.ID)
            proc_runs.push(process(sys))
        });   
        await Promise.all(proc_runs);

        _.forEach(sys.TO, (subsys)=>{
            try{
                _.forEach(subsys.INPUT, (input) => {
                    console.log("equating ",  `${subsys.ID}`, " and ", `${sys.ID}`, " for ", input)
                    subsys[`${input}`] = sys[`${input}`]
                }) 
                // proc_runs.push(_run(subsys.PROCESS(sys[subsys.INPUT]), sys));
            }
            catch(err){
                console.error(err);
            }
        });
    })();

    await (async ()=>{
        if (sys.TO != undefined){
            sub_process = _.reduce(sys.TO, function(result, value){
                // console.log("value: ",value)
                result.push((_run_System(value)))
                return result
            }, []);
            await Promise.all(sub_process);
        }else{
            console.info("no sub process for ", sys.ID)
        }
    })();
    return Array_of_sys
}

function copySystem(S){
    let new_obj = {}
    for (element in S) {
        if(typeof S[element] === 'object' && S[element] !== null){
            new_obj[element] = copySystem(S[element])
        }
        else if(Array.isArray(S[element])){
            new_obj[element] = []
            element.forEach(element2 => {
                new_obj.element.push(element2)
            });
        }
        else {
            new_obj[element] = S[element]
        }
    }
    return new_obj;
}

async function chain(sys, N){
    for (i = 0; i<N; i++){
        let new_sys = copySystem(sys)
        // sys.topology.center = `"${x + i*parseInt(sys.topology.width)},${y}"`
        sys.ID = `chained_sys${i}`
        sys.TO = [new_sys]
    }

    let new_sys = {...sys}
    for (i = 0; i<N; i++){
        new_sys = new_sys.TO[0]
        // console.log(new_sys.topology.center)
    }
}

async function generate_systems(system_links, system_defs){
    system_object = {}
    ID = 
    sytemdefs.forEach(element => {
        system_object.element.ID
        
    });
}


async function chain2(system){

}

module.exports = {
    _run_System, 
    chain,
    copySystem,
    Array_of_sys
}