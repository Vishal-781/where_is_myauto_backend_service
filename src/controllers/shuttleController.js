const Shuttle = require('../models/Shuttle');

// Controller for shuttle-related operations
const shuttleController = {
  // Get all shuttle positions
  getAllShuttles: async (req, res) => {
    try {
      const shuttles = await Shuttle.find();
      res.json(shuttles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get a specific shuttle by id
  getShuttleById: async (req, res) => {
    try {
      const shuttle = await Shuttle.findOne({ shuttleId: req.params.shuttleId });
      
      if (!shuttle) {
        return res.status(404).json({ message: 'Shuttle not found' });
      }
      
      res.json(shuttle);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update shuttle position (from driver app)
  updateShuttlePosition: async (req, res) => {
    try {
      const { shuttleId } = req.params;
      const { currentStopId, inService } = req.body;
      
      const shuttle = await Shuttle.findOne({ shuttleId });
      
      if (!shuttle) {
        return res.status(404).json({ message: 'Shuttle not found' });
      }
      
      shuttle.currentStopId = currentStopId || shuttle.currentStopId;
      shuttle.lastUpdated = Date.now();
      
      if (inService !== undefined) {
        shuttle.inService = inService;
      }
      
      const updatedShuttle = await shuttle.save();
      res.json(updatedShuttle);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Create a new shuttle (added functionality)
  createShuttle: async (req, res) => {
    try {
      const { shuttleId, routeNumber, currentStopId, inService } = req.body;
      
      // Check if shuttle already exists
      const existingShuttle = await Shuttle.findOne({ shuttleId });
      if (existingShuttle) {
        return res.status(400).json({ message: 'Shuttle already exists' });
      }
      
      const newShuttle = new Shuttle({
        shuttleId,
        routeNumber,
        currentStopId,
        inService: inService !== undefined ? inService : true
      });
      
      const savedShuttle = await newShuttle.save();
      res.status(201).json(savedShuttle);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = shuttleController;
