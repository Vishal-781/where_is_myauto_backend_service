const express = require('express');
const vehicleController = require('../controllers/VehicleController');

const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);

module.exports = router;