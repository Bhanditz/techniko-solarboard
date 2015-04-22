var cron = require('cron');
var request = require('request');
var fs = require('fs');
var http = require('http');
var moment = require('moment');
var path = require('path')

var CronJob = cron.CronJob;

var settings = JSON.parse(fs.readFileSync(path.join(__dirname, 'settings.json'), 'utf8'));

var startDay = 8;
var endDay = 20;
var dayLength = endDay - startDay;
var daymult = 0.7;
var cloudness = 0.2;

new CronJob('*/5 * * * *', function() {
    sendGenerated(moment().format('X'));
}).start();

new CronJob('*/10 * * * *', function() {
    getDayBounds();
}).start();
getDayBounds();
sendGenerated(moment().format('X'));


var timer = setInterval(function() {
    sendOutput();
}, 3000);

/*
var old = moment().subtract(2, 'months').startOf('day').startOf('minute');
var now = moment().utc();

setInterval(function() {
    if (old < now) {
        sendGenerated(old.format('X'));
        old.add(5, 'minutes');
    }
}, 50);
*/


function sendGenerated(date) {
    if (!date)
        date = moment.utc().format('X');
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
        console.log("Sending: " + calculateOutput(solar));
        request.put({
                url: 'http://localhost/solar/output/' + solar.name + "/" + calculateOutput(solar)
            },
            function(err, httpResponse, body) {
                if (err) throw err;
            });
    });
}

function getDayBounds() {
    request('http://localhost:1337/weather', function(err, res, body) {
        if (err) throw err;
        if (body && body.length !== 0) {
            var weatherData = JSON.parse(body);
            if (weatherData.sys) {
                var sunrise = moment(weatherData.sys.sunrise, 'X');
                var sunset = moment(weatherData.sys.sunset, 'X');

                startDay = sunrise.hours() + sunrise.minutes() / 60;
                endDay = sunset.hours() + sunrise.minutes() / 60;
                dayLength = endDay - startDay;
                daymult = 0.5 * Math.random();
                cloudness = weatherData.clouds.all / 100;
            }
        }
    });
}

function calculateOutput(solar, date) {
    var now;
    if (date) {
        now = moment(date, 'X');
    } else {
        now = moment();
    }
    var time = now.hours() + (now.minutes() / 60);
    var hourmult = Math.max(0, -(((time - startDay) * (time - endDay)) / (0.25 * (time * time))) * (1 - cloudness));
    console.log(hourmult);
    var output = (solar.output * hourmult +
        hourmult * Math.random() * solar.deviation +
        hourmult * 1000 * daymult);
    return output;
}
