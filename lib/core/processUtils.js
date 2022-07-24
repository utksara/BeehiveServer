const removeProcess = (system, processes) => {
    if (typeof(processes) === 'string'){
        system.PROCESSES = system.PROCESSES.filter(function(value, index, arr){ 
            return value !== processes;
        });
    }if(Array.isArray(processes)){
        processes.forEach(process => {
            processes.splice(0,0)
            system.PROCESSES = system.PROCESSES.filter(function(value, index, arr){ 
                return value !== process;
            });
        });
    }else{
        console.err("Invalid input processes, should be an array or string")
    }
}

const addProcesses = (system, processes) => {
    if (typeof(processes) === 'string'){
        system.PROCESSES.push(processes)
    }if(Array.isArray(processes)){
        system.PROCESSES.concat(processes);
    }else{
        console.err("Invalid input flow, should be an array or string")
    }
}

module.exports ={
    removeProcess,
    addProcesses,
}