const express = require('express');
const routeController = require('../controllers/RouteController');

const router = express.Router();

router.post('/', routeController.createRoute);
router.get('/:vehicleId', routeController.getRoutesByVehicleId);

module.exports = router;