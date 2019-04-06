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
		self.header = config.header;
		self.doneSet = new Set();
		self.doneSetIndex = config.doneSetIndex;

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
			self.logger.info('All done ...');
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

		if(config.clearResultFile){
			self.logger.info('init result file');
			fs.writeFileSync(self.resFile, '\ufeff' + self.header.join() + '\n');
		}else{
			if(!fs.existsSync(self.resFile)) {
				self.logger.info('clear exit result file');
				fs.writeFileSync(self.resFile, '\ufeff' + self.header.join() + '\n');
			}else{
				fs.readFileSync(self.resFile).toString().split('\n').map((line,index)=>{
					if(index === 0)  return;
					let vals = line.split(',');
					if(!self.doneSet.has(vals[self.doneSetIndex])){
						self.doneSet.add(vals[self.doneSetIndex]);
					}
				});
				self.logger.info('result file exist');
				self.logger.info('result '+self.doneSet.size+' has done');
			}
		}
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

	isHasError(err, res){
		if(err) {
			self.logger.error(err);
			self.logger.error(res.body.toString());
			return true;
		}

		if(res.options.jQuery === false) {
			let json = null;
			
			try {
				json = JSON.parse(res.body);
			}catch(e){
				self.logger.error(e);
				self.logger.error(res.body.toString());				
			}

			if(json) {
				return false;
			}else{
				return true;
			}
		}

		return false;
	};

	toCSV(file, data) {
		let self = this;

		data = data.map(val =>{
			if(typeof(val) === 'undefined')
				return '';
			return isNaN(val) ? (''+val).replace(/[\n,]/g,' ') : Number(val);
		});

		if(self.doneSet.has(data[self.doneSetIndex])){
			self.logger.warn('dumlice data detected');
			self.logger.warn('skipping data '+self.header[self.doneSetIndex]+':'+data[self.doneSetIndex]);
			self.logger.debug('skipping data:'+data.join());
		}else{
			self.logger.debug('CRAWLER Save : '+data.toString());
			fs.appendFileSync(file, data.join()+'\n');
		}
	}
}

module.exports = Spider;