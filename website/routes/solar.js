var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Solar = require('../models/solar.js');
var Generated = require("../models/generated.js");

router.get('/', function(req, res, next) {
    Solar.find(function(err, solars) {
        if (err) return next(err);
        res.json(solars);
    });
});

router.get('/:id', function(req, res, next) {
    Solar.findById(req.params.id, function(err, solar) {
        if (err) return next(err);
        res.json(solar);
    });
});

module.exports = router;