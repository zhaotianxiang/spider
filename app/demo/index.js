'use strict'

const Spider = require('../../lib/spider');
const options = { rateLimit:1000 };
const spider = new Spider(options);

spider.crawler.queue({uri:'http://www.baidu.com', callback:home.bind(spider)});

function home(err, res, done){
    if(err) throw err;
    console.log('baidu home page');
    return done();
}

