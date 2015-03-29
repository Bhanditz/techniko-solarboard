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

router.put('/:id', function(req, res, next) {
    var missing = [];
    if (!req.body.id) missing.push("id");
    if (!req.body.description) missing.push("description");
    if (!req.body.peak) missing.push("peak");
    if (!req.body.location) missing.push("location");
    if (!req.body.invertor) missing.push("invertor");
    if (!req.body.solarpanels) missing.push("solarpanels");


    if (missing.length !== 0) {
        var errormsg = "Cannot add solar panel, missing required info:";
        missing.forEach(function(error) {
            errormsg = errormsg + " " + error + ",";
        });
        return next(errormsg);
    }

    Solar.findById(req.params.id, function(err, solar) {
        if (err) return next(err);

        if (!solar) {
            solar = new Solar({
                _id: req.params.id,
                description: req.body.description,
                peak: req.body.peak,
                location: req.body.location,
                invertor: req.body.invertor,
                solarpanels: req.body.solarpanels
            });
        }

        if (req.body.output) {
            solar.output = req.body.output;
            solar.updated = Date.now();
        }

        if (req.body.description)
            solar.description = req.body.description;

        if (req.body.peak)
            solar.peak = req.body.peak;

        solar.save(function(err) {
            if (err) return next(err);
        });
        res.send("Succesfully added solar panel: " + req.params.id + ".");
    });
});

router.delete('/:id', function(req, res, next) {
    Solar.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        if (!post) return next("Solar panel doesn't exist.");

        Generated.remove({
            solar: req.params.id
        }, function(err, data) {
            if (err) return next(err);
        });
        res.send("Succesfully deleted solar panel: " + req.params.id + ".");
    });
});

module.exports = router;