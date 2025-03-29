const Route = require('../models/Route');

// Controller for route-related operations
const routeController = {
  // Get all routes
  getAllRoutes: async (req, res) => {
    try {
      const routes = await Route.find();
      res.json(routes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get a specific route by routeNumber
  getRouteByNumber: async (req, res) => {
    try {
      const route = await Route.findOne({ routeNumber: req.params.routeNumber });
      
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      
      res.json(route);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Create a new route (for admin purposes)
  createRoute: async (req, res) => {
    try {
      const { routeNumber, name, color, stops } = req.body;
      
      // Check if route already exists
      const existingRoute = await Route.findOne({ routeNumber });
      if (existingRoute) {
        return res.status(400).json({ message: 'Route already exists' });
      }
      
      const newRoute = new Route({
        routeNumber,
        name,
        color,
        stops
      });
      
      const savedRoute = await newRoute.save();
      res.status(201).json(savedRoute);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update a route (for admin purposes)
  updateRoute: async (req, res) => {
    try {
      const { routeNumber } = req.params;
      const { name, color, stops } = req.body;
      
      const route = await Route.findOne({ routeNumber });
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      
      route.name = name || route.name;
      route.color = color || route.color;
      route.stops = stops || route.stops;
      
      const updatedRoute = await route.save();
      res.json(updatedRoute);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = routeController;