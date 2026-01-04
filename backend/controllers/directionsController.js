const asyncHandler = require('express-async-handler');
const Directions = require('../models/Directions');

const createDirection = asyncHandler(async (req, res) => {
    const { startLocationName, endLocationName } = req.body;
    const userId = req.user;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!startLocationName || !endLocationName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const startGeocodedLocation = await fetch(`https://nominatim.openstreetmap.org/search?q=${startLocationName}&format=json&addressdetails=1&limit=1`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const endGeocodedLocation = await fetch(`https://nominatim.openstreetmap.org/search?q=${endLocationName}&format=json&addressdetails=1&limit=1`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const startGeocodedLocationData = await startGeocodedLocation.json();
    const endGeocodedLocationData = await endGeocodedLocation.json();

    console.log(startGeocodedLocationData);
    console.log(endGeocodedLocationData);

    const startLat = startGeocodedLocationData[0].lat;
    const startLng = startGeocodedLocationData[0].lon;
    const endLat = endGeocodedLocationData[0].lat;
    const endLng = endGeocodedLocationData[0].lon;

    const bikeDirections = await fetch(`https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${process.env.DIRECTIONS_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`);
    const bikeDirectionsData = await bikeDirections.json();
    console.log(bikeDirectionsData);

    const bikeDistance = bikeDirectionsData.features[0].properties.summary.distance;
    const bikeDuration = bikeDirectionsData.features[0].properties.summary.duration;

    let direction = await Directions.findOne({ userId, startLat, startLng });

    if (direction) return res.status(409).json({ message: 'Direction already exists' });

    direction = await Directions.create({ userId, startLocationName, endLocationName, startLat, startLng, endLat, endLng, distance: bikeDistance, duration: bikeDuration });

    res.status(201).json({ success: true, message: 'Direction created successfully', direction });
})

const getUserDirections = asyncHandler(async (req, res) => {
    const userId = req.user;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const directions = await Directions.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, directions });
})

const deleteUserDirection = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Direction ID is required' });
    }

    const direction = await Directions.findByIdAndDelete(id);
    if (!direction) return res.status(404).json({ message: 'Direction not found' });

    res.status(200).json({ success: true, message: 'Direction deleted successfully' });
})

const updateUserDirection = asyncHandler(async (req, res) => {
    const { startLocationName, endLocationName } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Direction ID is required' });
    }

    if (!startLocationName || !endLocationName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const startGeocodedLocation = await fetch(`https://nominatim.openstreetmap.org/search?q=${startLocationName}&format=json&addressdetails=1&limit=1`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const endGeocodedLocation = await fetch(`https://nominatim.openstreetmap.org/search?q=${endLocationName}&format=json&addressdetails=1&limit=1`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const startGeocodedLocationData = await startGeocodedLocation.json();
    const endGeocodedLocationData = await endGeocodedLocation.json();

    const startLat = startGeocodedLocationData[0].lat;
    const startLng = startGeocodedLocationData[0].lon;
    const endLat = endGeocodedLocationData[0].lat;
    const endLng = endGeocodedLocationData[0].lon;

    const bikeDirections = await fetch(`https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${process.env.DIRECTIONS_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`);
    const bikeDirectionsData = await bikeDirections.json();

    const bikeDistance = bikeDirectionsData.features[0].properties.summary.distance;
    const bikeDuration = bikeDirectionsData.features[0].properties.summary.duration;

    const direction = await Directions.findByIdAndUpdate(id, { startLocationName, endLocationName, startLat, startLng, endLat, endLng, distance: bikeDistance, duration: bikeDuration }, { new: true });
    if (!direction) return res.status(404).json({ message: 'Direction not found' });

    res.status(200).json({ success: true, message: 'Direction updated successfully', direction: direction });
})

module.exports = { createDirection, getUserDirections, deleteUserDirection, updateUserDirection };