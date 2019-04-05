'use strict'

const Spider = require('../../lib/spider');
const config = require('./config');

let spider = new Spider(config);

spider.home = (ctx, gene) => {
	ctx.crawler.queue({
		uri: ctx.seed,
		jQuery: true,
		callback: (err, res, done) => {
			if(Spider.isHasError(ctx, err, res)) return done();
			
			let title = res.$('title').text().trim();
			ctx.logger.info(title);
			
			spider.list(ctx, Object.assign({}, gene, {
				title: title
			}));
		}
	});
};

spider.list = (ctx, gene) => {
	spider.logger.info('list');
	spider.detail(ctx, gene);
}

spider.detail = (ctx, gene) => {
	ctx.logger.info('detail');
}

spider.run();