const date = new Date();
let dd = String(date.getDate()).padStart(2, '0');
let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = String(date.getFullYear());
let today = mm + '/' + dd + '/' + yyyy;

let seconds = String(date.getSeconds());
let minutes = String(date.getMinutes());
let hour = String(date.getHours());
let time = hour + ":" + minutes + ":" + seconds;

const continous_time =  seconds + minutes + hour + dd + mm + yyyy;
const logger_file_path = './logs/simulation_logs' + continous_time +'.log'

const config = require('./config.json');

const loggerCreator = message_prefix => {
    if(config.LOGGING){
        const logger = require('logger').createLogger(logger_file_path);
        logger.format = function(level, date, message) {
            let seconds = String(date.getSeconds());
            let minutes = String(date.getMinutes());
            let hour = String(date.getHours());
            let time = hour + ":" + minutes + ":" + seconds;
            return message_prefix + time + " " + today + " : " + message;
        };
        return logger;
    }
}

module.exports =  {
    loggerCreator
};