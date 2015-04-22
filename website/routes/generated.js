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


router.get('/solar/:id/:date', function(req, res, next) {
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

module.exports = router;