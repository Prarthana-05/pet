const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  
  ownerName: { type: String },
  contact: { type: String },
  status: { type: String, enum: ['Available', 'Pending', 'Adopted'], default: 'Available' },
  image: { type: String , required: true },  // filename or path like 'pet-images/bird1.jpg'
});

module.exports = mongoose.model('Pet', petSchema);
