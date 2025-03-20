const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  location_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Unique ID for the location
  name: { type: String, required: true }, // Name of the location (e.g., "Bus Stop A")
  latitude: { type: Number, required: true }, // Latitude of the location
  longitude: { type: Number, required: true }, // Longitude of the location
  eta: { type: Number, required: true }, // Estimated time of arrival in minutes
  timestamp: { type: Date, default: Date.now } // Timestamp of the location update
});

const routeSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true }, // Reference to the vehicle
  locations: [locationSchema], // Ordered list of locations
  start_time: { type: Date, default: Date.now }, // Timestamp when the route started
  end_time: { type: Date } // Timestamp when the route ended (optional)
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;