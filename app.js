var express = require('express'),
url = require("url"),
querystring = require("querystring"),
path = require("path"),
auth = require("oauth");

var app = express.createServer();
var testVar = 'kittens';

var oa = new auth.OAuth("https://api.twitter.com/oauth/request_token",
					"https://api.twitter.com/oauth/access_token",
					"xJ3l6SLfdUo7qgBoiokaUw",
					"t9oq5VhHoTpZWLDSunM8xE8tfPKmMXs1k9trs5xwWBI",
					"1.0",
					null,
					"HMAC-SHA1");
oa.getOAuthRequestToken();
oa.getOAuthAccessToken();

app.get('/index.html', function(req, res){
	if(typeof(url.parse(req.url).query) !== 'undefined'){
		var query = url.parse(req.url).query;
	}

	if(querystring.parse(query).testVar)
		testVar = querystring.parse(qs).myvar;

	res.send(testVar);
});

app.get('/setTwitterStatus', function(req, res){
	if(typeof(url.parse(req.url).query) !== 'undefined'){
		var query = url.parse(req.url).query;
	}

	sys.puts('Going to tweet: ' + querystring.parse(query).content);
	setTwitterStatus(req, res, querystring.parse(query).content);
});

var setTwitterStatus = function(req, res, content){
	var body = {'status':content};
	oa.post("http://api.twitter.com/1/statuses/update.json", oa.getOAuthAccessToken, oa.getOAuthRequestToken, body, "application/x-www-form-urlencoded", function(error, data, response2){
		if(error){
			res.send('Error: something is wrong');
		}
		else{
			res.send("Twitter status updated!");
			console.dir(response2);
		}
	});
};

app.listen(8001);