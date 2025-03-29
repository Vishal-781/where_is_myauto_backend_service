const mongoose = require('mongoose');

const ShuttleSchema = new mongoose.Schema({
  shuttleId: {
    type: String,
    required: true,
    unique: true
  },
  routeNumber: {
    type: Number,
    required: true
  },
  currentStopId: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  inService: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Shuttle', ShuttleSchema);