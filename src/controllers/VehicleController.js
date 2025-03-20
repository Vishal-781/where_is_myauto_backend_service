const Vehicle = require('../models/VehicleModel');

exports.createVehicle = async (req, res) => {
    try {
        const { name, type } = req.body;
        const vehicle = new Vehicle({ name, type });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};