'use strict'

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const crawler = require('crawler');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class Spider {
	constructor(opt) {
		this.today = moment().format('YYYY-MM-DD');

		this.logDir = './log/';
		this.resDir = './result/';

		if (!fs.existsSync(this.resDir)) {
			fs.mkdirSync(this.resDir);
		}
		if (!fs.existsSync(this.logDir)) {
			fs.mkdirSync(this.logDir);
		}

		this.logFile = path.resolve(this.logDir + opt.filename + '.' + this.today + '.log');
		this.resFile = path.resolve(this.resDir + opt.filename + '.' + this.today + '.csv');

		this.crawler = new crawler(Object.assign({
			logger: this.logger
		}, opt));

		this.crawler.on('drain', () => {
			this.logger.info('result file: %s', this.resFile);
			this.logger.info('All done')
		});

		this.logger = require('./logger').getLogger(this.logFile);
	}

	run(seed) {
		fs.writeFileSync(this.resFile, '\ufeff');
		this.crawler.queue(seed);
	}
}

module.exports = Spider;
