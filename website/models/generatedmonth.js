var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _id: String,
    solar: String,
    date: Date,
    total: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('GeneratedMonth', schema);