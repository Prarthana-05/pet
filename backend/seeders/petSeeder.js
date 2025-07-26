const mongoose = require('mongoose');
const Pet = require('../models/Pet');


mongoose.connect('mongodb://localhost:27017/petAdoptionApp')
  .then(async () => {
    await Pet.insertMany([
      {
        name: 'Bella',
        breed: 'Labrador Retriever',
        age: 3,
        compatibilityScore: 90,
        ownerName: 'Alice Smith',
        contact: '9876543210',
        status: 'Available',
        image: 'pet-images/dog.jpg'
      },
      {
        name: 'Max',
        breed: 'Golden Retriever',
        age: 2,
        compatibilityScore: 85,
        ownerName: 'Bob Johnson',
        contact: '8765432109',
        status: 'Available',
        image: 'pet-images/dog1.jpg'
      },
      {
        name: 'Luna',
        breed: 'Persian Cat',
        age: 1,
        compatibilityScore: 80,
        ownerName: 'Catherine Lee',
        contact: '7654321098',
        status: 'Pending',
        image: 'pet-images/fish.jpg'
      },
      {
        name: 'Charlie',
        breed: 'Beagle',
        age: 4,
        compatibilityScore: 88,
        ownerName: 'David Kim',
        contact: '6543210987',
        status: 'Available',
        image: 'pet-images/bird.jpg'
      },
      {
        name: 'Daisy',
        breed: 'Rabbit',
        age: 1,
        compatibilityScore: 78,
        ownerName: 'Emma Wilson',
        contact: '5432109876',
        status: 'Adopted',
        image: 'pet-images/rabbit.jpg'
      },
      {
        name: 'Rocky',
        breed: 'German Shepherd',
        age: 3,
        compatibilityScore: 92,
        ownerName: 'Frank Thomas',
        contact: '4321098765',
        status: 'Available',
        image: 'pet-images/chicks.jpg'
      },
      {
        name: 'Milo',
        breed: 'Cockatiel',
        age: 2,
        compatibilityScore: 75,
        ownerName: 'Grace Martin',
        contact: '3210987654',
        status: 'Available',
        image: 'pet-images/lovebird.jpg'
      },
      {
        name: 'Simba',
        breed: 'Maine Coon',
        age: 2,
        compatibilityScore: 83,
        ownerName: 'Harry Allen',
        contact: '2109876543',
        status: 'Pending',
        image: 'pet-images/parrot.jpg'
      },
      {
        name: 'Coco',
        breed: 'Cockapoo',
        age: 3,
        compatibilityScore: 89,
        ownerName: 'Isla Young',
        contact: '1098765432',
        status: 'Available',
        image: 'pet-images/turtle.jpg'
      }
    ]);

    console.log('Sample pets inserted!');
    process.exit();
  })
  .catch(err => console.error(err));
