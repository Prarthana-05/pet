// models/ChatMessage.js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  senderId: String,
  recipientId: String,
  senderRole: { type: String, enum: ['user', 'admin'], required: true },
  message: String,
 createdAt: {
  type: Date,
  default: () => Date.now()
}

});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
