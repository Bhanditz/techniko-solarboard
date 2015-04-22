var mongoose = require('mongoose');

var solarSchema = new mongoose.Schema({
    _id: String,
    description: String,
    peak: Number,
    invertor: String,
    location: String,
    solarpanels: {
        type: Number,
        default: 1
    },
    highestOutput: {
        type: Number,
        default: 0
    },
    hoursOnline: {
        type: Number,
        default: 0
    },
    dateAdded: {
        type: Date,
        default: Date.now()
    },

    totalYield: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('Solar', solarSchema);