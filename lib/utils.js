module.exports = {
	getProxy: getProxy
}

const proxy = {
	idx: 0,
	proxies: [],
	setOptProxy: function (opt) {
		opt.proxy = this.proxies[this.idx];
		this.idx = (this.idx + 1) % this.proxies.length;
		opt.limiter = opt.proxy;
	},
	getProxy: function () {
		let proxy = this.proxies[this.idx];
		this.idx = (this.idx + 1) % this.proxies.length;
		return proxy;
	}
}

function getProxy(proxyFilePaths) {
	[].concat(proxyFilePaths).forEach(function (filePath) {
		_pushDataToArray(proxy.proxies, require(filePath));
	});
	return proxy;
}

function _pushDataToArray(array, param) {

	var type = _judgeType(param);
	if ('single' == type) {
		array.push(param);
	} else if ('array' == type) {
		for (var i = 0; i < param.length; i++) {
			_pushDataToArray(array, param[i]);
		}
	} else {
		Object.keys(param).forEach(function(key) {
			_pushDataToArray(array, param[key]);
		});
	}
}

function _judgeType(param) {

	if (((typeof param) == 'number') || ((typeof param) == 'string') || ((typeof param) == 'boolean')) {
		return 'single';
	}
	var result = 'array';
	var keys = Object.keys(param);
	for (var i = keys.length - 1; i >= 0; i--) {
		if (isNaN(keys[i]) || Number(keys[i]) !== i) {
			result = 'json';
			break;
		}
	}
	return result;
}
