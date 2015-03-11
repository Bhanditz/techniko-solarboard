var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var solarapi = require('./routes/solar.js');
var generatedapi = require('./routes/generated.js');
var crossDomain = require('./middleware/crossdomain.js');

var app = express();

var port = 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(crossDomain);
app.use('/solar/generated', generatedapi);
app.use('/solar', solarapi);

var server = app.listen(port, function() {
  console.log("REST Api for MongoDB runnig succesfully on port " + port + "!");
});

mongoose.connect('mongodb://localhost/solardb');
var db = mongoose.connection;

db.once('open', function(callback) {
  console.log("Connected to Solar Database.");
});