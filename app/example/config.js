'use strict'

module.exports = Object.freeze({
	// spider options
	progrm:                 __dirname.toString().replace(/[\/\\]/g,',').split(',').pop(),
	seed:                   'http://www.baidu.com',
	header:                 ['col1', 'col2', 'col3'],
	doneSetIndex:           0,
	clearResultFile:        false,
	debug:                  false,
	proxyFile:              'proxy_wuba.json',
	headers:                {
								'User-Agent':'okhttp',
								'Connection':'keep-alive',
								'Accept':'*/*',
							},

	// crawler options
	rateLimit:              0,
	maxConnections:         10,
	autoWindowClose:        true,
	forceUTF8:              true,
	gzip:                   true,
	incomingEncoding:       null,
	jquery:                 true,
	method:                 'GET',
	priority:               5,
	priorityRange:          10,
	referer:                false,
	retries:                3,
	retryTimeout:           10000,
	timeout:                15000,
	skipDuplicates:         false,
	rotateUA:               false,
	homogeneous:            false
});