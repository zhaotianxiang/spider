'use strict'

const fs = require('fs');
const crawler = require('crawler');
const winston = require('winston');
const moment = require('moment');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const proxy = require('./utils');
const today = moment().format('YYYY-MM-DD');
const myFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} - ${level}: ${message}`;
});

class Spider {
	constructor(config) {
		let self = this;

		self.today = today;
		self.seed = config.seed;
		self.doneSet = new Set();

		self.inpDir = '../../data/';
		self.logDir = '../../logs/';
		self.resDir = '../../result/';
		self.logFile = self.logDir + config.progrm + '.' + self.today + '.log';
		self.resFile = self.resDir + config.progrm + '.' + self.today + '.csv';

		self.logger = winston.createLogger({
			level: config.debug ? 'debug' : 'info',
			format: combine(
			  	timestamp(),
			  	myFormat
			),
			transports: [
			    new winston.transports.Console(),
			    new winston.transports.File({filename: self.logFile}),
			]
		});

		self.crawler = new crawler(config);
		self.crawler.on('drain', function(){
			self.logger.info('All jobs done, To be continue.');
		});

		if(config.proxy) {
			if (config.debug) {
				self.logger.info('PROXY ENV : [ -- self proxy -- ]');
				self.crawler.on('schedule', configions => {
					configions.proxy = config.proxy;
				});
			} else {
				self.logger.info('PROXY ENV : [ -- mult proxy -- ]');
				self.crawler.on('schedule', configions => proxy.setconfigProxy(configions));
			}		
		}

		if (!fs.existsSync(self.resDir)) fs.mkdirSync(self.resDir);
		if (!fs.existsSync(self.logDir)) fs.mkdirSync(self.logDir);
		if (!fs.existsSync(self.inpDir)) fs.mkdirSync(self.inpDir);

		fs.writeFileSync(self.resFile, '\ufeff' + config.header.join() + '\n');
	}

	run() {
		let self = this;

		if(self.seed.split('.').pop() !== 'txt') {
			self.logger.info('init seed from url: '+self.seed);
			self.home(this, {
				seed: self.seed
			});			
		}else{
			self.seed = self.inpDir+self.seed;

			fs.readFile(self.seed, 'utf-8', function(err,data){
				if(err){
					return self.logger.error(err);
				}
				else{
					self.logger.info('init seed from local file: '+ self.seed.toString());
					self.seed = data;
					self.home(self, {seed:data.split('\n')});
				}
			});
		}
	}

	static isHasError(ctx, err, res){
		if(err) {
			ctx.logger.error(err);
			ctx.logger.error(res.body.toString());
			return true;
		}

		if(res.options.jQuery === false) {
			let json = null;
			
			try {
				json = JSON.parse(res.body);
			}catch(e){
				ctx.logger.error(e);
				ctx.logger.error(res.body.toString());				
			}

			if(json) {
				return false;
			}else{
				return true;
			}
		}

		return false;
	};

	static toCSV(file, data) {
		data = data.map(val =>{
			if(typeof(val) === 'undefined')
				return '';
			return isNaN(val) ? (''+val).replace(/[\n,]/g,' ') : Number(val);
		});
		fs.appendFileSync(file, data.join()+'\n');
	}
}

module.exports = Spider;