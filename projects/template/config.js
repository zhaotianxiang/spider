const moment = require('moment');

const config = Object.freeze({

	today: moment().format('YYYY-MM-DD'),
	header: ['col1', 'col2', 'col3'],
	// proxy: 'http://127.0.0.1',
	
	rateLimit: 1000,
	debug: true,
	progrm: __dirname.toString().replace(/[\/\\]/g,',').split(',').pop(),
	
	seed: 'http://www.baidu.com',
	// seed: 'example.txt',
});

module.exports = config;