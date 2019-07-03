var path = require('path');
var winston = require('winston');
require('winston-daily-rotate-file');
var env = process.env.NODE_ENV || 'development';

var container = {}

function getCaller() {
	return path.basename(module.parent.filename, '.js');
}

function normalize(option) {
	if(option === undefined || option === null) {
		return {}
	}
	if(typeof option === 'string') {
		return {filename: option};
	}
	return option;
}

function getLogger(option) {
	var name = getCaller();

	if(!option && (name in container)) {
		return container[name]
	}

	var loggerInstance = winston.loggers.get(name);

	option = normalize(option);

	if(!option.filename) {
		throw new Error('must specify log file name')
	}

	var transportInstance = new winston.transports.DailyRotateFile({
		filename: option.filename,
		datePattern: option.datePattern || 'yyyy-MM-dd',
		prepend: option.prepend || false,
		localTime: option.localTime || true,
		logstash: option.logstash || false,
		padLevels: option.padLevels || false,
		handleExceptions: option.handleExceptions || (env === 'development' ? false : true),
		level: option.level || (env === 'development' ? 'debug' : 'info'),
		timestamp: function() {
			return new Date().toLocaleString('en-US', {hour12: false})
		}
	});

	loggerInstance.configure({
		level: 'debug',
		transports: [
			transportInstance
		]
	});

	if(env === 'development') {
		loggerInstance.add(winston.transports.Console)
		loggerInstance.cli()
	}

	container[name] = loggerInstance;

	return loggerInstance;
}

module.exports = {
	getLogger: getLogger
}
