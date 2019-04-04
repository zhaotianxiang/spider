const spider = require('./app').spider;

spider.home = (ctx, gene) => {
	ctx.crawler.queue({
		uri: ctx.seed,
		callback: (err, res, done) => {
			if (err) {
				ctx.log.error(err);
				ctx.log.error(res.body);
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
	console.log(gene);
}

spider.start();