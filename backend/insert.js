const mongoose = require('mongoose');
const VetService = require('./models/VetService');  // Adjust path if needed

mongoose.connect('mongodb://localhost:27017/petAdoptionApp')
  .then(async () => {
    await VetService.insertMany([
      {
        name: "Pets Care Veterinary Clinic",
        type: "Vet Clinic",
        address: "Murbad Road, Kalyan West, Maharashtra",
        contact: "9023456789",
        location: { type: "Point", coordinates: [73.1206, 19.2403] }
      },
      {
        name: "Dr. Pawar Pet Clinic",
        type: "Vet Clinic",
        address: "Adharwadi, Kalyan West, Maharashtra",
        contact: "9876543210",
        location: { type: "Point", coordinates: [73.1277, 19.2564] }
      },
      {
        name: "Pet Zone Food & Accessories",
        type: "Pet Food Store",
        address: "Thakurli, Dombivli East, Maharashtra",
        contact: "9765432109",
        location: { type: "Point", coordinates: [73.0969, 19.2174] }
      },
      {
        name: "Mumbai Pet Shop & Clinic",
        type: "Vet Clinic",
        address: "Andheri West, Mumbai, Maharashtra",
        contact: "9933221100",
        location: { type: "Point", coordinates: [72.8277, 19.1299] }
      },
      {
        name: "Pet Lovers Food & Care",
        type: "Pet Food Store",
        address: "Ghatkopar East, Mumbai, Maharashtra",
        contact: "9090909090",
        location: { type: "Point", coordinates: [72.9180, 19.0865] }
      }
    ]);

    console.log('Data inserted successfully!');
    mongoose.disconnect();
  })
  .catch(err => console.error('Connection failed:', err));
