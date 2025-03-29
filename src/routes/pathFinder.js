const express = require('express');
const router = express.Router();
const pathFinderController = require('../controllers/pathFinderController');

// Find path between two stops
router.get('/', pathFinderController.findPath);

module.exports = router;