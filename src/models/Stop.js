const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  routeNumber: {
    type: Number,
    required: true
  },
  nextStop: {
    type: String,
    required: true
  },
  previousStop: {
    type: String,
    required: true
  }
});

const StopSchema = new mongoose.Schema({
  stopId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  connections: [ConnectionSchema]
});

module.exports = mongoose.model('Stop', StopSchema);
