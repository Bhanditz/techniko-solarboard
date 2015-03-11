var mongoose = require('mongoose');

var solarSchema = new mongoose.Schema({
  _id: String,
  description: String,
  peak: Number,

  output: Number,
  updated: {
    type: Date,
    default: Date.now()
  },

  totalYield: {
  	type: Number,
  	default: 0
  }
});
module.exports = mongoose.model('Solar', solarSchema);