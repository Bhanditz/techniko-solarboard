var express = require('express');
var router = express.Router();

var request = require('request');

var cron = require('cron');

var city = '2759632';
var APPID = '267194dcaef308f0ecd76989b9a78877';

var weatherData = {};
var CronJob = cron.CronJob;
new CronJob('*/10 * * * *', function() {
    loadWeather();
}).start();

loadWeather();

function loadWeather() {
    var cur = new Date();
    console.log("Loading new weather data at " + cur.getHours() + ":" + cur.getMinutes());
    request("http://api.openweathermap.org/data/2.5/weather" + "?id=" + city + '&units=metric' + '&lang=nl' + '&APPID=' + APPID, function(err, response, body) {
        if (err) {
            console.log("WeatherRequest: " + err);
        } else 
        weatherData = JSON.parse(body);
    });
}

router.get('/', function(req, res, next) {
    res.json(weatherData);
});

module.exports = router;
