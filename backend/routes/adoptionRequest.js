const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../models/AdoptionRequest');

// POST /api/adoption-request
router.post('/', async (req, res) => {

     console.log("Received adoption request:", req.body);
  try {
    const {
      userId,
      petId,
      userEmail,
      userName,
      phone,    // Add this
      address,  // Add this
      message   // Add this
    } = req.body;

    const newRequest = new AdoptionRequest({
      userId,
      petId,
      userEmail,
      userName,
      phone,    // Add this
      address,  // Add this
      message   // Add this
    });

    await newRequest.save();
    res.status(201).json({ message: 'Adoption request submitted successfully.' });

  } catch (error) {
    console.error('Error creating adoption request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
