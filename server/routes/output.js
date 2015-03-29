var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var solaroutputs = {};

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

router.put('/:id/:output', function(req, res, next) {
    var info = {
        name: req.params.id,
        output: req.params.output,
        date: new Date()
    };
    var solar = solaroutputs[req.params.id];
    if (!solar) {
        solaroutputs[req.params.id] = {};
    }
    solaroutputs[req.params.id] = info;
    res.send("Succesfully added output!");
});

module.exports = router;