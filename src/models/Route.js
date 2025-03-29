const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  stopId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  estimatedTimeToNextStop: {
    type: Number,
    required: true
  }
});

const RouteSchema = new mongoose.Schema({
  routeNumber: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  stops: [StopSchema]
});

module.exports = mongoose.model('Route', RouteSchema);