// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const authMiddleware = require('../middleware/authMiddleware');

// Get chat history (with auth)
router.get('/chat/:userId/:recipientId', authMiddleware, async (req, res) => {
  const { userId, recipientId } = req.params;
  
  // Verify user can access this chat (add your authorization logic)
  if (req.user._id.toString()!== userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  console.log(`📥 Fetching chat history between ${userId} and ${recipientId}`);

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId }
      ]
    }).sort({ createdAt: 1 });

    console.log(`✅ Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

module.exports = router;