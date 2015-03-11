var express = require('express');
var router = express.Router();

var moment = require('moment');

var mongoose = require('mongoose');
var Generated = require('../models/generated.js');
var Solar = require('../models/solar.js');

router.get('/', function(req, res, next) {
    Generated.find(function(err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

router.get('/:id/:date', function(req, res, next) {
    //For when the date is given in a human way (ISO), otherwise use Unix.
    var dateM = moment(req.params.date);
    var date = "";
    if (!dateM.isValid()) date = req.params.date;
    else date = dateM.startOf('day').format('X');

    var id = req.params.id + ":" + date;
    Generated.findById(id, function(err, data) {
        if (err) return next(err);
        console.log(id);
        res.json(data);
    });
});

router.put('/', function(req, res, next) {
    var missing = [];
    if (!req.body.date) missing.push("date");
    if (!req.body.solarid) missing.push("solarid");
    if (!req.body.generated) missing.push("generated");

    if (missing.length !== 0) {
        var errormsg = "Cannot add generation info, missing required info:";
        missing.forEach(function(error) {
            errormsg = errormsg + " " + error + ",";
        });
        return next(errormsg);
    }

    //Every update of generation gets added to the totalYield of a solar panel
    Solar.findById(req.body.solarid, function(err, result) {
        if (!result || err) {
            return next("Solar panel hasn't yet been added to the registry");
        }
        console.log(result);
        result.totalYield += req.body.generated;

        result.save(function(err) {
            if (err)
                return next(err);
        });
    });

    var date = moment(req.body.date);
    if (!date.isValid()) return next("Date given isn't valid");
    //round to the nearest 5 minutes
    var remainder = date.minute() % 5;
    var upremainder = 5 - remainder;
    if (remainder < upremainder) {
        date.subtract(remainder, 'minutes');
    } else {
        date.add(upremainder, 'minutes');
    }

    //ids are saved as 'solarid:dateofdayinunix'
    var idDate = moment(date);
    idDate.startOf('day');

    Generated.findById(req.body.solarid + ':' + idDate.format('X'), function(err, result) {
        if (!result) {
            result = new Generated({
                _id: req.body.solarid + ':' + idDate.format('X'),
            });
        }

        var idHour = date.hour();
        result[idHour].set((date.minute() / 5), req.body.generated.toString());
        console.log(result);

        result.save(function(err) {
            if (err)
                return next(err);
        });
    });

    res.send("Added data to database");
});

module.exports = router;