const mongoose = require('mongoose');

const vetServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,   // 'Vet Clinic', 'Pet Shop', 'Pet Food Store'
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  }
});

vetServiceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('VetService', vetServiceSchema, 'vetservices');

