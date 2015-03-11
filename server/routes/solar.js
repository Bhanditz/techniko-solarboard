var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Solar = require('../models/solar.js');

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
        peak: req.body.peak
      });
    }

    if (req.body.output) {
      solar.output = req.body.output;
      solar.updated = Date.now();
    }

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
    res.send("Succesfully deleted solar panel: " + req.params.id + ".");
  });
});

module.exports = router;