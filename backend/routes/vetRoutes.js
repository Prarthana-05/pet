// vetRoutes.js
const express = require('express');
const router = express.Router();
const VetService = require('../models/VetService');

router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const services = await VetService.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 5000  // in meters (5 km)
        }
      }
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error finding nearby services' });
  }
});

module.exports = router;
