var express = require('express');
var router = express.Router();

var http = require('http');
var url = require('url');

var cron = require('cron');


var city = '2759632';
var APPID = '267194dcaef308f0ecd76989b9a78877';
var url = url.parse("http://api.openweathermap.org/data/2.5/weather" + "?id=" + city + '&units=metric' + '&lang=nl' + '&APPID=' + APPID);

var weatherData = {};
var CronJob = cron.CronJob;
new CronJob('*/5 * * * *', function() {
    loadWeather();
}).start();

loadWeather();

function loadWeather() {
    var cur = new Date();
    console.log("Loading new weather data at " + cur.getHours() + ":" + cur.getMinutes());

    http.get(url, function(res) {
        var str = '';
        res.on('data', function(chunk) {
            str += chunk;
        });

        res.on('end', function() {
            weatherData = JSON.parse(str);
        });
    });
}

router.get('/', function(req, res, next) {
    res.json(weatherData);
});

module.exports = router;