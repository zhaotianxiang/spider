'use strict'

const moment  = require('moment');
const crawler = require('crawler');
const winston = require('winston');

class Spider {
	constructor(options) {
		this.today = moment().format('YYYY-MM-DD');
		
        this.logDir = '../../logs/';
		this.resDir = '../../result/';
		this.logFile = this.logDir + options.name + '.' + this.today + '.log';
		this.resFile = this.resDir + options.name + '.' + this.today + '.csv';
        this.logger = winston.createLogger({
            transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: this.logFile })]
        });
 
		this.crawler = new crawler(Object.assign({},options,{logger: this.logger}));
		this.crawler.on('drain', function() {
			this.logger.info('All done ...');
		});
    }
}

const spider = new Spider({name:'test',debug: true})
spider.logger.info('hehahaha');

module.exports = Spider;
