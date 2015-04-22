//Checks if every solar panel has responded for the past hour.
var express = require('express');
var router = express.Router();
var cron = require('cron');
var moment = require('moment');

var mongoose = require('mongoose');
var Solar = require('../models/solar.js');
var Generated = require('../models/generated.js');

var solarData = {};

var CronJob = cron.CronJob;

new CronJob('0 0 * * *', function() {
    checkAlerts();
}).start();
checkAlerts();

function checkAlerts() {
    var now = moment.utc();
    now.startOf('day');

    Generated.find({
        date: now.toDate()
    }, function(err, data) {
        if (data.length === 0) {
            console.log("NO SOLAR PANEL HAS RESPONDED FOR THE PAST HOUR");
            sendMail('all');
        }
        var current = moment();
        data.forEach(function(solar) {
            if (solar[current.hours() - 1]) {
                if (solar[current.hours() - 1].length === 0) {
                    if (!solarData[solar.solar]) {

                        solarData[solar.solar] = {
                            alerts: 1
                        };
                    } else {
                        solarData[solar.solar].alerts++;
                    }
                    console.log("Solar panel " + solar.solar + " hasn't responded for " + solarData[solar.solar].alerts + " hours!");
                } else {
                    console.log(solar.solar + " is online");
                    Solar.findById(solar.solar, function(err, data) {
                        if (err) return err;
                        data.hoursOnline++;
                        data.save();
                    });
                }
            }
        });
    });
}

function sendMail(solar) {
    //Sendmail code using http://www.nodemailer.com/
}

router.get('/', function(req, res, next) {
    res.json(solarData);
});

module.exports = router;