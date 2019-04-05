const Spider = require('../../lib/spider');
const config = require('./config');
const spider = new Spider(config);

spider.home = (ctx, gene) => {
	ctx.crawler.queue({
		uri: ctx.seed,
		callback: (err, res, done) => {
			if (err) {
				ctx.log.error(err,res.body);
				return done();
			}
			console.log(res.$('title').text().trim());

			spider.list(ctx, Object.assign({}, gene, {
				homeName: res.$('title').text().trim()
			}));
		}
	});
};

spider.list = (ctx, gene) => {
	spider.logger.info('list');
	spider.detail(ctx, gene);
}

spider.detail = (ctx, gene) => {
	spider.logger.info('detail');
}
spider.run();

// spider.run();
// console.log(spider);