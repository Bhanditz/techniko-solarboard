var express = require('express');
var router = express.Router();

var moment = require('moment');

var mongoose = require('mongoose');
var Generated = require('../models/generated.js');
var GeneratedMonth = require('../models/generatedmonth.js');
var Solar = require('../models/solar.js');

var smallifyData = function(data) {
    var sendData = [];
    data.forEach(function(day) {
        sendData.push({
            date: day.date,
            solar: day.solar,
            total: day.total
        });
    });
    return sendData;
};

function processMonth(solar, date, generated, oldValue) {
    var momentDate = moment.utc(date, 'X');
    var unixDate = momentDate.startOf('month').format('X');
    var id = solar + ':' + unixDate + ':month';
    GeneratedMonth.findById(id, function(err, result) {
        if (!result) {
            result = new GeneratedMonth({
                _id: id,
                solar: solar,
                date: momentDate.toDate(),
                total: generated
            });
        } else {
            oldValue = oldValue ? oldValue : 0;
            result.total += generated - oldValue;
        }

        result.save(function(err) {
            if (err)
                return next(err);
        });

    });
}

router.get('/', function(req, res, next) {
    Generated.find(function(err, data) {
        if (err) return next(err);
        res.json(data);
    });
});


router.get('/:id/:date', function(req, res, next) {
    var date = moment.utc(req.params.date, 'X');
    var id = req.params.id + ":" + date.format('X');
    Generated.findById(id, function(err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

router.get('/month/:date', function(req, res, next) {
    var monthDate = moment.utc(req.params.date, 'X').startOf('month');
    if (monthDate.isValid()) {
        Generated.find({
            date: {
                $gte: monthDate.toDate(),
                $lt: moment(monthDate).add(1, 'months').toDate()
            }
        }, function(err, data) {
            if (err) return next(err);
            res.json(smallifyData(data));
        });
    }
});

router.get('/year/:date', function(req, res, next) {
    var yearDate = moment.utc(req.params.date, 'X').startOf('year');
    if (yearDate.isValid) {
        GeneratedMonth.find({
            date: {
                $gte: yearDate.toDate(),
                $lt: moment(yearDate).add(1, 'years').toDate()
            }
        }, function(err, data) {
            if (err) return next(err);
            res.json(data);
        });
    }
});

router.get('/date=:date', function(req, res, next) {
    Generated.find({
        date: new Date(req.params.date * 1000)
    }, function(err, data) {
        res.json(data);
    });
});

/**
 * Query for a date range (optional paramater to save bandwidth)
 * @return given date range
 */
router.get('/date_start=:datestart&date_end=:dateend/:totalonly?', function(req, res, next) {
    var startDate = moment.utc(req.params.datestart, 'X').toDate();
    var endDate = moment.utc(req.params.dateend, 'X').toDate();
    Generated.find({
        date: {
            $gte: startDate,
            $lt: endDate
        }
    }, function(err, data) {
        if (err) return next(err);
        var sendData = [];

        //Option to send only total to save bandwidth
        if (req.params.totalonly) {
            sendData = smallifyData(data);
        } else {
            sendData = data;
        }
        res.json(sendData);
    });
});

router.delete('/:id/:date', function(req, res, next) {
    Generated.findByIdAndRemove(req.params.id + ":" + req.params.date, function(err, data) {
        if (err) return next(err);
        if (!data) return next("Couldn't find " + req.params.id + ":" + req.params.date);
        res.send("Succesfully deleted " + req.params.id + ":" + req.params.date);
    });
});

router.put('/', function(req, res, next) {
    var missing = [];
    if (!req.body.solarid) missing.push("solarid");
    if (!req.body.generated) missing.push("generated");

    if (missing.length !== 0) {
        var errormsg = "Cannot add generation info, missing required info:";
        missing.forEach(function(error) {
            errormsg = errormsg + " " + error + ",";
        });
        return next(errormsg);
    }
    var date;
    if (req.body.date) {
        date = moment.utc(req.body.date, 'X');
    } else {
        date = moment();
    }
    if (!date.isValid()) return next("Date given isn't valid");

    date.startOf('minute');
    //round to the nearest 5 minutes
    var remainder = date.minute() % 5;
    var upremainder = 5 - remainder;
    if (remainder < upremainder) {
        date.subtract(remainder, 'minutes');
    } else {
        date.add(upremainder, 'minutes');
    }

    var idDate = moment.utc(date);
    idDate.startOf('day');

    Generated.findById(req.body.solarid + ':' + idDate.format('X'), function(err, result) {
        if (!result) {
            result = new Generated({
                _id: req.body.solarid + ':' + idDate.format('X'),
                date: idDate.toDate(),
                solar: req.body.solarid
            });
        }

        var idHour = date.hour();
        var generated = (req.body.generated / 300) * (1 / 12);

        //If there already was a value this can't be added to the total, so calculate net
        var oldValue = result[idHour][(date.minute() / 5)];
        oldValue = oldValue ? oldValue : 0;
        var netGenerated = (generated - oldValue);
        result.total += netGenerated;

        result[idHour].set((date.minute() / 5), generated);

        result.save(function(err) {
            if (err)
                return next(err);
        });


        processMonth(req.body.solarid, idDate.format('X'), generated, oldValue);


        //Every update of generation gets added to the totalYield of a solar panel
        Solar.findById(req.body.solarid, function(err, result) {
            if (!result || err) {
                return next("Solar panel hasn't yet been added to the registry");
            }
            result.totalYield += parseInt(netGenerated);

            result.save(function(err) {
                if (err)
                    return next(err);
            });
        });
    });

    res.send("Added data to database");
});

module.exports = router;