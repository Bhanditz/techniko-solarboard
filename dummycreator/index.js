var cron = require('cron');
var request = require('request');
var fs = require('fs');
var http = require('http');
var moment = require('moment');

var CronJob = cron.CronJob;

var settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

var startDay = 8;
var endDay = 20;
var dayLength = endDay - startDay;
var daymult = 0.7;

new CronJob('*/5 * * * *', function() {
    sendGenerated();
}).start();

new CronJob('0 0 * * *', function() {
    getDayBounds();
}).start();
getDayBounds();
sendGenerated(moment().subtract(8, 'hours').format('X'));


var timer = setInterval(sendOutput, 3000);

var old = moment().subtract(4, 'months').startOf('minute');

setInterval(function() {
    sendGenerated(old.format('X'));
    old.add(5, 'minutes');
}, 50);



function sendGenerated(date) {
    if (!date)
        date = moment().format('X');
    console.log("Sending output");
    settings.solars.forEach(function(solar) {
        request.put({
                url: 'http://localhost:1337/solar/generated',
                form: {
                    solarid: solar.name,
                    generated: calculateOutput(solar, date) * 300,
                    date: date
                }
            },
            function(err, httpResponse, body) {
                console.log(body);
            });
    });
}

function sendOutput() {
    settings.solars.forEach(function(solar) {
        console.log(calculateOutput(solar));
        request.put({
                url: 'http://localhost:1337/solar/output/' + solar.name + "/" + calculateOutput(solar)
            },
            function(err, httpResponse, body) {
                if (err) throw err;
            });
    });
}

function getDayBounds() {
    request('http://localhost:1337/weather', function(err, res, body) {
        var weatherData = JSON.parse(body);
        var sunrise = moment(weatherData.sys.sunrise, 'X');
        var sunset = moment(weatherData.sys.sunset, 'X');

        startDay = sunrise.hours();
        endDay = sunset.hours();
        dayLength = endDay - startDay;
        daymult = 0.5 * Math.random();
    });
}

function calculateOutput(solar, date) {
    var now;
    if (date)
        now = moment(date, 'X');
    else
        now = moment();
    var hourmult = Math.max(0, -Math.pow((2 / startDay) * (now.hours() + now.minutes() / 60) - dayLength * 0.25 - 1, 2) + 1);

    var output = solar.output * hourmult +
        hourmult * Math.random() * solar.deviation +
        hourmult * 1000 * daymult;
    return output;
}