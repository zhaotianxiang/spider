'use strict'

const Spider = require('../../lib/spider');
const config = require('./config');

let spider = new Spider(config);

spider.home = (ctx, gene) => {
	ctx.crawler.queue({
		uri: ctx.seed,
		jQuery: true,
		callback: (err, res, done) => {
			if (ctx.isHasError(err, res)) return done();

			let title = res.$('title').text().trim();
			ctx.logger.info(title);
			ctx.list(ctx, gene);

			done();
		}
	});
};

spider.list = (ctx, gene) => {
	ctx.logger.info('list');
	ctx.toCSV(ctx.resFile, ['b', 'b', 'c']);
}

spider.run();