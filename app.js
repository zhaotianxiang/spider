const app = require('./spider');
const config = require('./config');
const options = {
	program: config.program,
	header: config.header,
	debug: config.debug,
	seed: config.seed,
};

module.exports.spider = new app.Spider(options);