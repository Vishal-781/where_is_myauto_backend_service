const express = require('express');
const router = express.Router();
const shuttleController = require('../controllers/shuttleController');

// Get all shuttle positions
router.get('/', shuttleController.getAllShuttles);

// Get a specific shuttle by id
router.get('/:shuttleId', shuttleController.getShuttleById);

// Create a new shuttle (added functionality)
router.post('/', shuttleController.createShuttle);

// Update shuttle position (from driver app)
router.post('/:shuttleId/update', shuttleController.updateShuttlePosition);

module.exports = router;