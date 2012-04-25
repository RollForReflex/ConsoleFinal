Twitter with Node.js

A simple test to see if I could pull down public data with a small amount of node.js code

## Dependencies
Node.js
Express and OAuth libraries downloaded from npm

### Using OAuth
Since we're pulling the public timeline, no username/password combination is needed but an OAuth object is needed to make the call since I've chosen to make the call as a registered API developer so I needed to use a API/secret key.
    
### Screenshot of calling node.js
![Node in action](https://github.com/RollForReflex/ConsoleFinal/blob/master/node.png "Node.js")

### Query String
When you run the app.js file via command prompt, run localhost:8001 and go to the index.html page and if you put in anything in the query string (separated by '?'), it will be read in and can be used for posting a twitter status given the username/password (this functionality was never completed)

### Using methods that require signing
When executing methods that require signing (and for methods that require authentication) you must also provide your 'shared secret key':

	var oa = new auth.OAuth("https://api.twitter.com/oauth/request_token",
					"https://api.twitter.com/oauth/access_token",
					"xJ3l6SLfdUo7qgBoiokaUw",
					"t9oq5VhHoTpZWLDSunM8xE8tfPKmMXs1k9trs5xwWBI",
					"1.0",
					null,
					"HMAC-SHA1");
	oa.getOAuthRequestToken();
	oa.getOAuthAccessToken();

#### Getting tweets using http://localhost:8001/stream
	function get_tweets() {  
		var request = twitter_client.request("GET", "/1/statuses/public_timeline.json", {"host": "api.twitter.com"});  
  
		request.addListener("response", function(response) {  
			var body = "";  
			response.addListener("data", function(data) {  
				body += data;  
			});  
  
        response.addListener("end", function() {  
            var tweets = JSON.parse(body);  
            if(tweets.length > 0) {  
                tweet_emitter.emit("tweets", tweets);  
            }  
        });  
    });  
  
    request.end();  
}  
    
#### How to set up a server to look for a certain web page
	http.createServer(function(request, response) {  
    var uri = url.parse(request.url).pathname;  
    if(uri === "/stream") {  
  
        var listener = tweet_emitter.addListener("tweets", function(tweets) {  
            response.writeHead('200', { "Content-Type" : "text/plain" });  
            response.write(JSON.stringify(tweets));  
            response.end();  
  
            clearTimeout(timeout);  
        });  
  
        var timeout = setTimeout(function() {  
            response.writeHead('200', { "Content-Type" : "text/plain" });  
            response.write(JSON.stringify([]));  
            response.end();  
  
            tweet_emitter.removeListener(listener);  
        }, 10000);  
  
    }  
}).listen(8001);  

### A screenshot of the public timeline
![Public timeline](https://github.com/RollForReflex/ConsoleFinal/blob/master/stream.png "Node.js project")
