var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Solar = require('../models/solar.js');

var highestoutputs = {};
var solaroutputs = {};

function checkHighestOutout(solar, output) {
    if (!highestoutputs[solar]) {
        getHighestOutput(solar, output);
    } else {
        if (highestoutputs[solar] < output) {
            addHighestOutput(solar, output);
        }
    }
}

function getHighestOutput(solar, output) {
    Solar.findById(solar, function(err, result) {
        if (result) {
            if (output > result.highestOutput) {
                addHighestOutput(solar, output);
                highestoutputs[solar] = output;
            } else {
                highestoutputs[solar] = result.highestOutput;
            }
        }
    });
}

function addHighestOutput(solar, output) {
    Solar.findById(solar, function(err, result) {
        if (result) {
            result.highestOutput = output;
        }
        highestoutputs[solar] = output;
        result.save();
    });
}

router.get('/', function(req, res, next) {
    res.json(solaroutputs);
});

router.get('/:id', function(req, res, next) {
    var solar = solaroutputs[req.params.id];
    if (!solar)
        res.status(404).send("Solar panel not found");
    else
        res.json(solar);
});

module.exports = router;