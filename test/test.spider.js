'use strict'

const Spider = require('../lib/index.js');
const spider = new Spider({
	filename: 'helloword'
});

spider.run({
	uri:'http://www.baidu.com',
	callback: city.bind(spider)
});

function city(err, res, done){
	if(err) throw err;
	console.log(res.body);
	done();
}
