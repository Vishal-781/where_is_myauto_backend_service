const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Get all routes
router.get('/', routeController.getAllRoutes);

// Get a specific route by routeNumber
router.get('/:routeNumber', routeController.getRouteByNumber);

// Create a new route (for admin purposes)
router.post('/', routeController.createRoute);

// Update a route (for admin purposes)
router.put('/:routeNumber', routeController.updateRoute);

module.exports = router;