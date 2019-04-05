'use strict'

const fs = require('fs');
const crawler = require('crawler');
const winston = require('winston');
const moment = require('moment');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const proxy = require('./utils');

class Spider {
	constructor(config) {
		let self = this;

		self.seed = config.seed;
		self.today = moment().format('YYYY-MM-DD')
		self.logDir = '../../log/'+config.progrm+'/';
		self.resDir = '../../result/'+config.progrm+'/';
		self.logFile = self.logDir + config.progrm + '.' + self.today + '.log';
		self.resFile = self.resDir + config.progrm + '.' + self.today + '.csv';

		const myFormat = printf(({ level, message, label, timestamp }) => {
			return `${timestamp} - ${level}: ${message}`;
		});

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
			self.seed = '../../appdata/' + self.seed;

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
	}
}

module.exports = Spider;