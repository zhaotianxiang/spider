'use strict'

const fs = require('fs');
const config = require('./config')
const crawler = require('crawler');
const moment = require('moment');
const winston = require('winston');
const proxy = require('../tool/proxy.js').
getProxy(['../../appdata/proxies_wuba.json', '../../appdata/proxies_dd.json']);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class Spider {
	constructor(opt) {
		let self = this;

		const fileName = opt.prgname + '.' + moment().format('YYYY-MM-DD');
		self.log = require('bda-util/winston-rotate-local-timezone').getLogger(`../../log/${fileName}.log`);
		self.debug = opt.debug;
		self.header = opt.header;
		self.seed = opt.seed;
		self.logDir = '../../log';
		self.resultDir = opt.result + opt.prgname + '/';
		self.resultFile = fileName + '.csv';
		self.tasks = new Array();
		self.doneSet = new Set();
		self.crawler = new crawler({
			rateLimit: 3000,
			debug: false,
		});

		self.init();

	}

	init() {
		let self = this;

		if (self.debug) {
			self.log.info('PROXY ENV : [ -- development -- ]');
			self.crawler.on('schedule', options => {
				options.proxy = 'http://192.168.99.70:8888';
			});
		} else {
			self.log.info('PROXY ENV : [ -- production -- ]');
			self.crawler.on('schedule', options => proxy.setOptProxy(options));
		}

		if (!fs.existsSync(self.resultDir)) fs.mkdirSync(self.resultDir);
		if (!fs.existsSync(self.logDir)) fs.mkdirSync(self.logDir);
		fs.writeFileSync(self.resultDir + self.resultFile, '\ufeff' + self.header.join() + '\n');
	}

	start() {
		let self = this;
		self.home(self, {
			seed: self.seed
		});
	}

}

module.exports.Spider = Spider;