const mongoose = require('mongoose');
const adoptionRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  // Add these missing fields:
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminResponse: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
