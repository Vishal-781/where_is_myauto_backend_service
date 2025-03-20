const Route = require('../models/RouteModel');
const Vehicle = require('../models/VehicleModel');
const wss = require('../server'); // Import WebSocket server

// Function to calculate ETAs for all locations
const calculateETAs = (currentLocationIndex, locations, currentTime) => {
  const etas = [];
  let eta = currentTime; // Start with the current time

  // Iterate through the locations starting from the current location
  for (let i = currentLocationIndex; i < locations.length; i++) {
    etas.push({
      location_id: locations[i].location_id,
      name: locations[i].name,
      eta: new Date(eta) // Convert to Date object
    });

    // Add 5 minutes for the next location
    eta += 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  return etas;
};

exports.updateLocation = async (req, res) => {
  try {
    const { vehicleId, latitude, longitude, currentLocationIndex } = req.body;

    // Check if the vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Fetch the route for the vehicle
    const route = await Route.findOne({ vehicle_id: vehicleId });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Get the current time
    const currentTime = new Date().getTime(); // Current time in milliseconds

    // Calculate ETAs for all locations
    const etas = calculateETAs(currentLocationIndex, route.locations, currentTime);

    // Prepare the update message
    const updateMessage = JSON.stringify({
      vehicleId,
      latitude,
      longitude,
      currentLocationIndex,
      etas
    });

    // Broadcast the update to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(updateMessage);
      }
    });

    res.status(200).json({ message: 'Location updated', etas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};