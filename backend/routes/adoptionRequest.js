const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet'); // Add this line


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

// PATCH /api/adoption-requests/:id
router.patch('/:id', async (req, res) => {
  const { status, adminResponse } = req.body;

  try {
    // Find the adoption request by ID
    const request = await AdoptionRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // Update status and admin response
    request.status = status || request.status;
    request.adminResponse = adminResponse || request.adminResponse;

    await request.save();

    // If approved, update the pet's status to "adopted"
    if (status === 'approved') {
      const pet = await Pet.findById(request.petId);
      if (pet) {
        pet.status = 'adopted';
        await pet.save();
      }
    }

    res.json({ message: 'Request updated successfully', request });

  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
