const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');


const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/pet-images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ Get All Pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/quiz-recommendation', async (req, res) => {
  try {
    const { space, activity, time, petType } = req.body;

    let allowedBreeds = new Set();

    function addToSet(arr) {
      arr.forEach(breed => allowedBreeds.add(breed));
    }

    // 🏠 Space Logic
    if (space === 'Small') addToSet(['Persian Cat', 'Cockatiel', 'Rabbit', 'Maine Coon']);
    else if (space === 'Medium') addToSet(['Beagle', 'Labrador Retriever', 'Cockapoo']);
    else if (space === 'Large') addToSet(['German Shepherd', 'Golden Retriever']);

    // ⏰ Time Commitment
    if (time === 'Less than 1 hour') addToSet(['Cockatiel', 'Rabbit']);
    else if (time === '1-3 hours') addToSet(['Beagle', 'Persian Cat', 'Maine Coon']);
    else if (time === 'More than 3 hours') addToSet(['Labrador Retriever', 'German Shepherd', 'Golden Retriever']);

    // 🐾 Pet Type Logic
    if (petType === 'Low Maintenance') addToSet(['Cockatiel', 'Rabbit']);
    else if (petType === 'Companion') addToSet(['Beagle', 'Labrador Retriever', 'Persian Cat', 'Cockapoo', 'Maine Coon']);
    else if (petType === 'Guard') addToSet(['German Shepherd']);
    else if (petType === 'Exotic') addToSet(['Cockatiel']);

    // 🔍 Prepare Query
    const breedArray = Array.from(allowedBreeds);

    let query = { breed: { $in: breedArray } };

    // 🏃 Activity Level filter separately
    if (activity === 'Low') query.age = { $gte: 4 };
    else if (activity === 'High') query.age = { $lte: 2 };

    const pets = await Pet.find(query);

    if (!pets.length) return res.status(404).json({ message: 'No matching pets found' });

    res.json(pets);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ Get Single Pet by ID
// Inside routes/petRoutes.js
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPet);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update pet' });
  }
});





router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Add this validation
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const petData = {
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      ownerName: req.body.ownerName,
      contact: req.body.contact,
      status: req.body.status,
      image: `pet-images/${req.file.filename}`
    };

    const pet = new Pet(petData);
    await pet.save();
    res.status(201).json(pet);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ msg: 'Pet not found' });

    await pet.deleteOne();  // Mongoose 7+ uses deleteOne instead of remove
    res.json({ msg: 'Pet deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});



module.exports = router;
