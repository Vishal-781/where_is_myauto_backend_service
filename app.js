const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/VehicleRoutes');
const routeRoutes = require('./routes/RouteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/vehicles', vehicleRoutes);
app.use('/routes', routeRoutes);

module.exports = app;