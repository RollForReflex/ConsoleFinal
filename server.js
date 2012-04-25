var sys = require("util"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs"),  
    events = require("events");  
  
var twitter_client = http.createClient(80, "api.twitter.com");  
  
var tweet_emitter = new events.EventEmitter();  
  
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
  
setInterval(get_tweets, 5000);

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
  
sys.puts("Server running at http://localhost:8001/");