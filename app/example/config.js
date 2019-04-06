'use strict'

module.exports = Object.freeze({
	// spider options
	progrm: __dirname.toString().replace(/[\/\\]/g,',').split(',').pop(),
	seed: 'http://www.baidu.com',
	proxy: null,
	header: ['col1', 'col2', 'col3'],
	headers:{
		'User-Agent':'okhttp',
		'Connection':'keep-alive',
		'Accept':'*/*',
	},
	doneSetIndex:           0,
	clearResultFile:        false,
	debug:                  false,

	// crawler all options as follow
	autoWindowClose:        true,
	forceUTF8:              true,
	gzip:                   true,
	incomingEncoding:       null,
	jquery:                 true,
	maxConnections:         10,
	method:                 'GET',
	priority:               5,
	priorityRange:          10,
	rateLimit:              0,
	referer:                false,
	retries:                3,
	retryTimeout:           10000,
	timeout:                15000,
	skipDuplicates:         false,
	rotateUA:               false,
	homogeneous:            false
});