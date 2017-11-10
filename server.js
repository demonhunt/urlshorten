// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const url = require('url');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
var count = 0;
var urls = [];
var codes = [];

app.use(function(req, res, next) {
  req.url = req.url.replace(/^(\/thing\/)(.+)/, function($0, $1, $2) {
    return $1 + encodeURIComponent($2);
  });
  next();
});

app.get("/new/*", function (req,res) {
  var url = req.params[0]
  var regex = /^http(s)?:\/\/?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  if(regex.test(url)) {
    urls.push(url)
    count++;
    codes.push(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3))
    res.json({'link shorten':'https://urlshortern.glitch.me/' + codes[count-1],'urls': urls[count-1]});
    }
  else {res.end('Wrong URL format')}
});

app.get("/:shorten", function (req,res) {
  
  res.writeHead(302, {'Location': urls[codes.indexOf(req.params.shorten)]});
  res.end();
  
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});