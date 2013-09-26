var request = require('request'),
	fs = require('fs');

var w3cCheckUrl = 'http://validator.w3.org/check',
	defaultOutput = 'json',
	defaultUseragent = 'w3cjs-request',
	defaultCallback = function (res) {
		console.log(res);
	};

function setW3cCheckUrl(newW3cCheckUrl) {
	w3cCheckUrl = newW3cCheckUrl;
}

function validate(options) {
	var output = options.output || defaultOutput,
		callback = options.callback || defaultCallback,
		useragent = options.useragent || defaultUseragent,
		file = options.file,
		isLocal = true,
		req, form;

	if(typeof file === 'undefined') {
		return false;
	}

	if(file.substr(0,5) === 'http:' || file.substr(0, 6) === 'https:') {
		isLocal = false;
	}

	if(isLocal) {
		req = request.post(w3cCheckUrl,
							{
								headers: { 'User-Agent': useragent }
							},
							function (err, response, body) {
								if(err){ throw err;}
								callback(body);
							}
						);
		form = req.form();
		form.append('output', output);
		form.append('buffer', new Buffer(10));
		form.append('uploaded_file', fs.createReadStream(file));
	} else {
		req = request.get(w3cCheckUrl,
							{
								headers: {	'User-Agent': useragent },
								qs: {'uri': file, 'output': output}
							},
							function (err, response, body) {
								if(err){ throw err;}
								callback(response.body);
							}
						);
	}
}

var w3cjs = {
				validate: validate,
				setW3cCheckUrl: setW3cCheckUrl
			};

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = w3cjs;
	}
	exports.w3cjs = w3cjs;
} else {
	root['w3cjs'] = w3cjs;
}
